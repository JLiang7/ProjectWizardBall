var express = require('express'),
	app = express(),
	http = require('http').Server(app);
	
	io = require("socket.io").listen(http);

var games = {};
var playersOnServer = [];
var Player = require("./server/objects/player");
var Map = require("./server/objects/map");
var MapInfo = require("./public/javascripts/data/map_info");
var Game = require("./server/objects/game");
var Lobby = require("./server/lobby");
var PendingGame = require("./server/objects/pending_game");
var updateDelay = 100;

init();

function init(){
	Lobby.initialize();

	setEventHandlers();

	setInterval(broadcastingLoop, updateDelay);
};

function setEventHandlers(){
	io.on("connection",function(client){
		client.on("move player", onMovePlayer);
		client.on("disconnect", onClientDisconnect);
//		client.on("place bomb", onPlaceBomb);
//		client.on("register map", onRegisterMap);
		client.on("start game on server", onStartGame);
//		client.on("ready for round", onReadyForRound);
		//client.on("powerup overlap", onPowerupOverlap);

		client.on("enter lobby", Lobby.onEnter);
		client.on("host game", Lobby.onHost);
		client.on("select stage", Lobby.onStageSelect);
		client.on("enter pending game", Lobby.onEnterLobby);
		client.on("leave pending game", Lobby.onLeaveLobby);
	});
};

function onClientDisconnect() {
	if (this.gameID == null) {
		return;
	}

	var lobbySlots = Lobby.getLobbySlots();

	if (lobbySlots[this.gameID].state == "joinable" || lobbySlots[this.gameID].state == "full") {
		Lobby.onLeavePendingGame.call(this);
	} else if (lobbySlots[this.gameID].state == "prejoinable") {
		lobbySlots[this.gameID].state = "empty";

		Lobby.broadcastSlotStateUpdate(this.gameID, "empty");
	} else if(lobbySlots[this.gameID].state == "inprogress") {
		var game = games[this.gameID];
	
		if(this.ID in game.players) {
			console.log("deleting " + this.ID);
			delete game.players[this.ID];
	
			io.in(this.gameID).emit("remove player", {ID: this.ID});	
		}

		if(game.numPlayers < 2) {
			if(game.numPlayers == 1) {
				io.in(this.gameID).emit("no opponents left");
			}
			terminateExistingGame(this.gameID);
		}

		if(game.awaitingAcknowledgements && game.numEndOfRoundAcknowledgements >= game.numPlayers) {
			game.awaitingAcknowledgements = false;
		}
	}
};

// Deletes the game object and frees up the slot.
function terminateExistingGame(gameID) {
	games[gameID].clearBombs();

	delete games[gameID];

	Lobby.getLobbySlots()[gameID] = new PendingGame();

	Lobby.broadcastSlotStateUpdate(gameID, "empty");
};

function onStartGame() {
	var lobbySlots = Lobby.getLobbySlots();

	var game = new Game();
	games[this.gameID] = game;
	var pendingGame = lobbySlots[this.gameID];
	lobbySlots[this.gameID].state = "inprogress";

	Lobby.broadcastSlotStateUpdate(this.gameID, "inprogress");

	var IDs = pendingGame.getPlayerIDs();
	
	for(var i = 0; i < IDs.length; i++) {
		var playerID = IDs[i];
		var spawnPoint = MapInfo[pendingGame.mapName].spawnLocations[i];
		var newPlayer = new Player(spawnPoint.x * TILE_SIZE, spawnPoint.y * TILE_SIZE, "down", playerID, pendingGame.players[playerID].color);
		newPlayer.spawnPoint = spawnPoint;

		game.players[playerID] = newPlayer;
	}

	game.numPlayersAlive = IDs.length;

	io.in(this.gameID).emit("start game on client", {mapName: pendingGame.mapName, players: game.players});
};

function onRegisterMap(data) {
	games[this.gameID].map = new Map(data, TILE_SIZE);
};

function onMovePlayer(data) {
	var game = games[this.gameID];

	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}

	var movingPlayer = game.players[this.ID];

	// Moving player can be null if a player is killed and leftover movement signals come through.
	if(!movingPlayer) {
		return;
	}

	movingPlayer.x = data.x;
	movingPlayer.y = data.y;
	movingPlayer.facing = data.facing;
	movingPlayer.hasMoved = true;
};

function onPlaceBomb(data) {
	var game = games[this.gameID];
	var player = game.players[this.ID];

	if(game === undefined || game.awaitingAcknowledgements || player.numBombsAlive >= player.bombCapacity) {
		return;
	}

	var gameID = this.gameID;
	var bombID = data.ID;
	var normalizedBombLocation = game.map.placeBombOnGrID(data.x, data.y);

	if(normalizedBombLocation == -1) {
		return;
	}

	player.numBombsAlive++;

	var bombTimeoutID = setTimeout(function () {
		console.log("detonatin with ", game.players);
		var explosionData = bomb.detonate(game.map, player.bombStrength, game.players);
		player.numBombsAlive--;

		io.in(gameID).emit("detonate", {explosions: explosionData.explosions, ID: bombID, 
			destroyedTiles: explosionData.destroyedBlocks});
		delete game.bombs[bombID];
		game.map.removeBombFromGrID(data.x, data.y);

		handlePlayerDeath(explosionData.killedPlayers, gameID);
	}, 2000);

	var bomb = new Bomb(normalizedBombLocation.x, normalizedBombLocation.y, bombTimeoutID);
	game.bombs[bombID] = bomb;

	io.to(this.gameID).emit("place bomb", {x: normalizedBombLocation.x, y: normalizedBombLocation.y, ID: data.ID});
};

/*onPowerupOverlap : (data) {
	var powerup = games[this.gameID].map.claimPowerup(data.x, data.y);

	if(!powerup) {
		return;
	}

	var player = games[this.gameID].players[this.ID];

	if(powerup.powerupType === PowerupIDs.BOMB_STRENGTH) {
		player.bombStrength++;
	} else if(powerup.powerupType === PowerupIDs.BOMB_CAPACITY) {
		player.bombCapacity++;
	}

	io.in(this.gameID).emit("powerup acquired", {acquiringPlayerID: this.ID, powerupID: powerup.ID, powerupType: powerup.powerupType});
};*/

function handlePlayerDeath(deadPlayerIDs, gameID) {
	var tiedWinnerIDs;

	if(deadPlayerIDs.length > 1 && games[gameID].numPlayersAlive - deadPlayerIDs.length == 0) {
		tiedWinnerIDs = deadPlayerIDs;
	}

	deadPlayerIDs.forEach(function (deadPlayerID) {
		games[gameID].players[deadPlayerID].alive = false;
		io.in(gameID).emit("kill player", {ID: deadPlayerID});
		games[gameID].numPlayersAlive--;
	}, this);

	if(games[gameID].numPlayersAlive <= 1) {
		endRound(gameID, tiedWinnerIDs);
	}
};

function endRound(gameID, tiedWinnerIDs) {
	var roundWinnerColors = [];

	var game = games[gameID];

	if(tiedWinnerIDs) {
		tiedWinnerIDs.forEach(function (tiedWinnerID) {
			roundWinnerColors.push(game.players[tiedWinnerID].color);
		});
	} else {
		var winner = game.calculateRoundWinner();
		winner.wins++;
		roundWinnerColors.push(winner.color);
	}

	game.currentRound++;

	if(game.currentRound > 2) {
		var gameWinners = game.calculateGameWinners();

		if(gameWinners.length == 1 && (game.currentRound > 3 || gameWinners[0].wins == 2)) {
			io.in(gameID).emit("end game", {completedRoundNumber: game.currentRound - 1, roundWinnerColors: roundWinnerColors, 
				gameWinnerColor: gameWinners[0].color});
			terminateExistingGame(gameID);
			return;
		}
	}

	game.awaitingAcknowledgements = true;
	game.resetForNewRound();


	io.in(gameID).emit("new round", {completedRoundNumber: game.currentRound - 1, roundWinnerColors: roundWinnerColors});
};

function onReadyForRound() {
	var game = games[this.gameID];

	if(!game.awaitingAcknowledgements) {
		return;
	}

	game.acknowledgeRoundReadinessForPlayer(this.ID);

	if(game.numRoundReadinessAcknowledgements >= game.numPlayers) {
		game.awaitingAcknowledgements = false;
	}
};



function broadcastingLoop(){
	for(var g in games){
		var game = games[g];
		for(var i in game.players){
			var player = game.players[i];
			if(player.alive && player.hasMoved){
				io.to(g).emit("m",{ID: player.ID, x: player.x, y: player.y, f:player.facing});
				player.hasMoved = false;
			}
		}
	}
};

//add dependencies for html script calls
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function (){
  console.log('listening on \'localhost:3000\'');
});

