var RemotePlayer = function(x,y,id,game){
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
    //this.previousPosition = {x: x, y: y};
    this.targetPosition;

	this.id = id;
	this.facing = "idle";
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

    //this.body.collideWorldBounds = true;
    //this.body.gravity.y = 1000;
    //this.body.maxVelocity.y = 500;
    //this.body.setSize(140,210,0, 12);

    this.ball_group = this.game.add.physicsGroup();

 /*   this.animations.add('left', [0,1,2, 3, 4, 5, 6, 7], 12, true);
    this.animations.add('right', [16,17,18,19,20,21,22,23], 12, true);
    this.animations.add('throwRight',[13,12],12,false);
    this.animations.add('throwLeft',[10,11],12,false);*/

    game.add.existing(this);
} 

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype); 

RemotePlayer.prototype.interpolate = function(lastFrameTime) {
    if(this.distanceToCover && lastFrameTime) {
        if((this.distanceCovered.x < Math.abs(this.distanceToCover.x) || this.distanceCovered.y < Math.abs(this.distanceToCover.y))) {
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
}

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