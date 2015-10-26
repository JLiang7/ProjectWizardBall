var colorIndices = { 
 	"red": 0, 
 	"green": 1, 
 	"purple": 2, 
 	"yellow": 3
} 
 
 
var PendingGame = function() { 
 	this.players = {}; 
 	this.state = "empty"; 
 	this.mapID= ""; 
 	this.colors = [{colorName: "red", available: true}, {colorName: "green", available: true}, {colorName: "purple", available: true}, {colorName: "yellow", available: true}]; 
}; 
 
 
PendingGame.prototype = { 
 	function getPlayerIds() { 
 		return Object.keys(this.players); 
	}, 
 
 
 	function getNumPlayers() { 
 		return Object.keys(this.players).length; 
 	}, 
 
 
 	function removePlayer(id) { 
 		this.colors[colorIndices[this.players[id].color]].available = true; 
 		delete this.players[id]; 
 	}, 
 
 
 	function addPlayer(id) { 
 		this.players[id] = {color: this.claimFirstAvailableColor()}; 
 	}, 
 

 	function claimFirstAvailableColor() { 
 		for(var i = 0; i < this.colors.length; i++) { 
 			var color = this.colors[i]; 
 			if(color.available) { 
 				color.available = false; 
 				return color.colorName; 
 			} 
 		} 
 	} 
}; 
 
 
module.exports = PendingGame; 
