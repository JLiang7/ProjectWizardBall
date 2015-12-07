var Maps = require('../public/javascripts/data/map_info');

var PendingGame = require('./objects/pending_game');

var lobbyID = -1;
var totalNumOfLobbies = 5;
var lobbies = [];


var Lobby = {
	getLobbies: function(){
		return lobbies;
	},

	getLobbyID: function(){
		return lobbyID;
	},

	getTotalNumOfLobbies: function(){
		return totalNumOfLobbies;
	},

	broadcastStateUpdate: function(gameID, newState){
		broadcastStateUpdate(gameID,newState);
	},

	initialize: function(){
		for(var i = 0; i < totalNumOfLobbies; i ++){
			lobbies.push(new PendingGame());
		}
	},

	onEnter: function(data){
		this.join(lobbyID);
		io.in(lobbyID).emit("add slots", lobbies);
	},

	onHost: function(data){
		lobbies[data.gameID].state = "prejoinable";
		this.gameID = data.gameID;
		broadcastStateUpdate(data.gameID, "prejoinable");
	},

	onStageSelect: function(data){
		lobbies[this.gameID].state = "joinable";
		lobbies[this.gameID].mapID = data.mapID;
		lobbies[this.gameID].bg = data.bg;
		lobbies[this.gameID].meme = data.meme;
		broadcastStateUpdate(this.gameID,"joinable");
	},

	onEnterLobby: function(data){
		var pendingGame = lobbies[data.gameID]; 
 	 
 		this.leave(lobbyID); 
 		this.join(data.gameID); 
 	 
 		pendingGame.addPlayer(this.id); 
 		this.gameID = data.gameID;
 	 
 		this.emit("show current players", {players: pendingGame.players}); 
 		this.broadcast.to(data.gameID).emit("player joined", {id: this.id, color: pendingGame.players[this.id].color}); 
 	 
 		if(pendingGame.getNumPlayers() >= Maps[pendingGame.mapID].spawnLocations.length) { 
 			pendingGame.state = "full"; 
 			broadcastStateUpdate(data.gameId, "full"); 
 		} 

	},

	onLeaveLobby: function(data){
		leavePendingGame.call(this);
	}
};

function broadcastStateUpdate(gameID, newState) { 
 	io.in(lobbyID).emit("update slot", {gameID: gameID, newState: newState}); 
 }; 
 
 
 function leavePendingGame() { 
	var lobbySlot = lobbies[this.gameID]; 
 
 
 	this.leave(this.gameID); 
 	lobbySlot.removePlayer(this.id); 
 	io.in(this.gameID).emit("player left", {players: lobbySlot.players}); 
 
 
 	if(lobbySlot.getNumPlayers()== 0) { 
 		lobbySlot.state = "empty"; 
 		io.in(lobbyID).emit("update slot", {gameID: this.gameID, newState: "empty"}); 
	} 
 
 
 	if(lobbySlot.state == "full") { 
 		lobbySlot.state = "joinable"; 
 		io.in(lobbyId).emit("update slot", {gameId: this.gameID, newState: "joinable"}); 
 	} 
}; 
 
module.exports = Lobby; 