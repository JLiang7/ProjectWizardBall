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
 	this.bg = "";
 	this.meme = false;
 	this.colors = [{colorName: "red", available: true}, {colorName: "green", available: true}, {colorName: "purple", available: true}, {colorName: "yellow", available: true}]; 
}; 
 
 
PendingGame.prototype = {
	reset : function(){
		this.players = {}
		this.state = "empty";
	},

 	getPlayerIDs : function() { 
 		return Object.keys(this.players); 
	}, 
 
 
 	getNumPlayers : function() { 
 		return Object.keys(this.players).length; 
 	}, 
 
 
 	removePlayer : function(id) { 
 		//this.colors[colorIndices[this.players[id].color]].available = true; 
 		delete this.players[id]; 
 	}, 
 
 
 	addPlayer : function(id, name) { 
 		this.players[id] = {color: this.claimFirstAvailableColor()}; 
 		this.players[id] = {username: name};
 	}, 
 

 	claimFirstAvailableColor : function() { 
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
