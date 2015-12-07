

var express = require('express'),
	http = require('http'),
	app = express(),
	port = process.env.PORT || 3000;

process.env.PWD = process.cwd();

var	root = process.env.PWD || __dirname;


	

app.use(express.static(process.env.PWD+'/public'));

var server = http.createServer(app);
io = require("socket.io").listen(server);
server.listen(port, function (){
  console.log('listening on \'localhost:3000\'');
});

//adding this comment because its broked
var games = {};
var playersOnServer = [];
var Player = require("./server/objects/player");
var Map = require("./server/objects/map");
var MapInfo = require("./public/javascripts/data/map_info");
var Game = require("./server/objects/game");
var Lobby = require("./server/lobby");
var PendingGame = require("./server/objects/pending_game");
var updateDelay = 50;

init();

function init(){
	Lobby.initialize();

	setEventHandlers();

	setInterval(broadcastingLoop, updateDelay);
};

function setEventHandlers(){
	io.on("connection",function(client){

		client.on("move player", onMovePlayer);
		client.on("ball throw", onBallThrown);
		client.on("ball destroy", onBallDestroy);
		client.on("disconnect", onClientDisconnect);
		client.on("start game on server", onStartGame);
		client.on("enter lobby", Lobby.onEnter);
		client.on("host game", Lobby.onHost);
		client.on("select stage", Lobby.onStageSelect);
		client.on("enter pending game", Lobby.onEnterLobby);
		client.on("leave pending game", Lobby.onLeaveLobby);
		client.on("player hit", onPlayerHit);
		client.on("game over", onGameOver);
		client.on("terminate slot", function(data){
			onClientDisconnect();
			var lobbySlots = Lobby.getLobbies();
			if(lobbySlots[this.gameID]){
				lobbySlots[this.gameID].reset();
			}
			terminateExistingGame(data);
		});
	});
};

function onClientDisconnect() {
	if (this.gameID == null) {
		return;
	}

	var lobbySlots = Lobby.getLobbies();
	if (lobbySlots[this.gameID].state == "joinable" || lobbySlots[this.gameID].state == "full") {
		Lobby.onLeaveLobby.call(this);
	} else if (lobbySlots[this.gameID].state == "prejoinable") {
		lobbySlots[this.gameID].state = "empty";

		Lobby.broadcastStateUpdate(this.gameID, "empty");
	} else if(lobbySlots[this.gameID].state == "inprogress") {
		var game = games[this.gameID];
	
		if(this.id in game.players) {
			delete game.players[this.id];
	
			io.in(this.gameID).emit("remove player", {id: this.id});	
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

	delete games[gameID];

	Lobby.getLobbies()[gameID] = new PendingGame();

	Lobby.broadcastStateUpdate(gameID, "empty");
};

function onStartGame() {
	var lobbySlots = Lobby.getLobbies();

	var game = new Game();
	games[this.gameID] = game;
	var pendingGame = lobbySlots[this.gameID];
	lobbySlots[this.gameID].state = "inprogress";

	Lobby.broadcastStateUpdate(this.gameID, "inprogress");

	var IDs = pendingGame.getPlayerIDs();
	
	for(var i = 0; i < IDs.length; i++) {
		var playerId = IDs[i];
		var TILE_SIZE = 60;
		var spawnPoint = MapInfo[pendingGame.mapID].spawnLocations[i];
		var newPlayer = new Player(spawnPoint.x * TILE_SIZE, spawnPoint.y * TILE_SIZE, "down", playerId, pendingGame.players[playerId].color);

		newPlayer.spawnPoint = spawnPoint;

		game.players[playerId] = newPlayer;
	}

	game.numPlayersAlive = IDs.length;

	io.in(this.gameID).emit("start game on client", {mapID: pendingGame.mapID, players: game.players, bg:pendingGame.bg, meme:pendingGame.meme});
};

function onGameOver(data) {
	var game = games[this.gameID];

	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}
	game.won = true;
	game.winnerID = data.winnerID;
	game.gameID = this.gameID;
};

function onPlayerHit(data) {
	var game = games[this.gameID];

	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}

	var hitPlayer = game.players[this.id];

	if(!hitPlayer) {
		return;
	}

	hitPlayer.dead = true;
};

function onMovePlayer(data) {
	var game = games[this.gameID];

	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}

	var movingPlayer = game.players[this.id];

	// Moving player can be null if a player is killed and leftover movement signals come through.
	if(!movingPlayer) {
		return;
	}

	movingPlayer.x = data.x;
	movingPlayer.y = data.y;
	movingPlayer.facing = data.facing;
	movingPlayer.hasMoved = true;
};

function onBallThrown(data) {
	var game = games[this.gameID];
	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}

	io.in(this.gameID).emit("ball throw",{x: data.x, y: data.y, throw_angle: data.throw_angle, thrower: data.thrower, speed: data.speed, time: data.time});
	
};

function onBallDestroy(data) {
	var game = games[this.gameID];
	if(game === undefined || game.awaitingAcknowledgements) {
		return;
	}
	io.in(this.gameID).emit("ball destroy",{id : data.id});
}

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



function broadcastingLoop(){
	for(var g in games){
		var game = games[g];
		for(var i in game.players){
			var player = game.players[i];
			if(player.alive && player.hasMoved){
				io.to(g).emit("m",{id: player.id, x: player.x, y: player.y, f:player.facing, dead:player.dead, won:game.won, winnerID: game.winnerID, gameID: game.gameID});
				player.hasMoved = false;
			}
		}
	}
};


app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});




