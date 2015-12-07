var Player = function(xSpawn, ySpawn, facing, id, color,username) {
	this.xSpawn = xSpawn;
	this.ySpawn = ySpawn;
	this.dead = false;
	this.x = xSpawn;
	this.y = ySpawn;
	this.facing = facing;
	this.id = id;
	this.color = color;
	this.wins = 0;
	this.alive = true;
	this.username = username;
}

Player.prototype = {
	resetForNewRound: function() {
		this.x = this.xSpawn;
		this.y = this.ySpawn;
		this.alive = true;
		this.dead = false;
	}
}

module.exports = Player;