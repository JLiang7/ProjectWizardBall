function Level(levelData){
	var platforms = [];
	var backgroundImage = levelData;
	var balls = [];
	var ballSpawnLocations = [];
	var playerSpawnLocations = [];


	this.addPlatform = function(platform){
		this.platforms.add(platform);
	}

	this.setBackgroundImage = function(sprite){
		this.backgroundImage = sprite;
	}

	this.addBall = function(ball){
		this.balls.add(ball);
	}

	this.setBallSpawnLocations = function(locations){
		this.ballSpawnLocations = locations;
	}

	this.setPlayerSpawnLocations = function(locations){
		this.playerSpawnLocations = locations;
	}

	this.getPlatforms = function(){
		return this.platforms;
	}

	this.getBackgroundImage = function(){
		return this.backgroundImage;
	}

	this.getBalls = function(){
		return this.balls;
	}

	this.getBallSpawnLocations = function(){
		return this.ballSpawnLocations;
	}

	this.getPlayerSpawnLocations = function(){
		return this.playerSpawnLocations;
	}
}