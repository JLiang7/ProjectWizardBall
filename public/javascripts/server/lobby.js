var Maps = require('./data/map_info');

var PendingGame = require('./objects/pending_game');

var lobbyID = -1;
var totalNumOfLobbies = 10;
var lobbies = [];


var Lobby = {
	function getLobbies(){
		return lobbies;
	},

	function getLobbyID(){
		return lobbyID;
	},

	function getTotalNumOfLobbies(){
		return totalNumOfLobbies;
	},

	function broadcastStateUpdate(gameID, newState){
		broadcastStateUpdate(gameID,newState);
	},

	function initialize(){
		for(var i = 0; i < totalNumOfLobbies; i ++){
			lobbies.push(new PendingGame());
		}
	},

	function onEnter(data){
		this.join(lobbyID);
		io.in(lobbyID).emit("add slots", lobbies);
	},

	function onHost(data){
		lobbies[data.gameID].state = "pre-joinable";
		this.gameID = data.gameID;
		broadcastStateUpdate(data.gameID, "pre-joinable");
	},

	function onStageSelect(data){
		lobbies[this.gameID].state = "joinable";
		lobbies[this.gameID].mapID = data.mapID;
		broadcastStateUpdate(this.gameID,"joinable");
	},

	function onEnterLobby(data){
		var pendingGame = lobbySlots[data.gameID]; 
 	 
 		this.leave(lobbyID); 
 		this.join(data.gameID); 
 	 
 		pendingGame.addPlayer(this.ID); 
 		this.gameID = data.gameID; 
 	 
 		this.emit("show current players", {players: pendingGame.players}); 
 		this.broadcast.to(data.gameID).emit("player joined", {id: this.ID, color: pendingGame.players[this.ID].color}); 
 	 
 		if(pendingGame.getNumPlayers() >= Maps[pendingGame.mapID].spawnLocations.length) { 
 			pendingGame.state = "full"; 
 			broadcastSlotStateUpdate(data.gameId, "full"); 
 		} 

	},

	function onLeaveLobby(data){
		leaveLobby.call(this);
	}
};

function broadcastSlotStateUpdate(gameID, newState) { 
 	io.in(lobbyID).emit("update slot", {gameID: gameID, newState: newState}); 
 }; 
 
 
 function leavePendingGame() { 
	var lobbySlot = lobbies[this.gameID]; 
 
 
 	this.leave(this.gameID); 
 	lobbySlot.removePlayer(this.ID); 
 	io.in(this.gameID).emit("player left", {players: lobbies.players}); 
 
 
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
