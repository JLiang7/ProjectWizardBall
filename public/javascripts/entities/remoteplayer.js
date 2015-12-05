var RemotePlayer = function(x,y,id,game){
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
    this.MOVE_DELAY = 30;
    this.movLag = 0;
    //this.previousPosition = {x: x, y: y};
    this.didAnimCheck = true;
    this.targetPosition;
    this.moving = false;
	  this.id = id;
	  this.facing = "idle_right";
    this.frame = 15;
    this.lastMoveTime = 0;
	//this.speed = 0;
    this.running = 0;
    this.hp = 3;
	//this.flying_speed = FLYING_SPEED;
    this.game = game;
	  this.nextShot = 0;

	game.physics.enable(this, Phaser.Physics.ARCADE);
  game.physics.arcade.enable(this);

    this.scale.setTo(.5,.5);

  this.body.collideWorldBounds = true;
  this.body.gravity.y = 0;
  this.body.maxVelocity.y = 0;
  this.body.setSize(140,210,0, 12);

    this.ball_group = this.game.add.physicsGroup();

    this.animations.add('left', [0,1,2, 3, 4, 5, 6, 7], 12, true);
    this.animations.add('right', [16,17,18,19,20,21,22,23], 12, true);
    this.animations.add('throwRight',[13,12],12,false);
    this.animations.add('throwLeft',[10,11],12,false);

    game.add.existing(this);
}; 

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype); 

RemotePlayer.prototype.interpolate = function(lastFrameTime) {
    //console.log("interpolateing");
    if(this.distanceToCover && lastFrameTime) {
      
        if((this.distanceCovered.x < Math.abs(this.distanceToCover.x) || this.distanceCovered.y < Math.abs(this.distanceToCover.y))) {
          this.didAnimCheck = false;
          this.movLag = this.game.time.now + this.MOVE_DELAY;
         
          var fractionOfTimeStep = (game.time.now - lastFrameTime) / remotePlayerUpdateInterval;
          var distanceCoveredThisFrameX = fractionOfTimeStep * this.distanceToCover.x;
          var distanceCoveredThisFrameY = fractionOfTimeStep * this.distanceToCover.y;

          this.distanceCovered.x += Math.abs(distanceCoveredThisFrameX);
          this.distanceCovered.y += Math.abs(distanceCoveredThisFrameY);

          this.x += distanceCoveredThisFrameX;
          this.y += distanceCoveredThisFrameY;

        } else {
          
          this.x = this.targetPosition.x;
          this.y = this.targetPosition.y;
        }
    }

};

RemotePlayer.prototype.reset = function() {
  this.x = this.spawnPoint.x;
  this.y = this.spawnPoint.y;
  //this.previousPosition = {x: this.x, y: this.y};
  this.distanceToCover = null;
  this.distanceCovered = null;
  this.targetPosition = null
  this.lastMoveTime = null;
  
  if(!this.alive) {
    this.revive();
  }
};

RemotePlayer.prototype.characterController = function(){

  if(this.facing == "idle_left"){
        this.animations.stop();
        this.frame = 8;
  }else
  if(this.facing == "idle_right"){
        this.animations.stop();
        this.frame = 15;
  }else
  if(this.facing == "flying_right"){
        this.animations.stop();
        this.frame = 14;
  }else
  if(this.facing == "flying_left"){
        this.animations.stop();
        this.frame = 9;
  }else
  if(this.facing == "running_left"){
        this.animations.play('left');
  }else
  if(this.facing == "running_right"){
        this.animations.play('right');
  }else
  if(this.facing == "throw_left"){
        this.animations.play('throwLeft');
  }else
  if(this.facing == "throw_right"){
        this.animations.play('throwRight');
  }else{
    this.animations.stop();
  }

};