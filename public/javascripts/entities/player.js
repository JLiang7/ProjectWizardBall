var DEFAULT_PLAYER_SPEED = 300;
var FLYING_SPEED = 250;
var CATCH_WINDOW = 300;
var THROW_COOLDOWN = 300;
var CATCH_COOLDOWN = 300;
var MIN_POWER = 100;
var MAX_POWER = 1000;
var CHARGE_RATE = 20;

var Player = function(x, y, id, game) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
    this.dead = false;
    this.uuid = id;
	this.id = id;
	this.facing = "idle_right";
    this.frame = 15;
	//this.speed = 0;
    this.running = 0;
    this.hp = 1;
	//this.flying_speed = FLYING_SPEED;
	this.game = game;
	this.nextShot = 0;
    this.nextCatch = 0;
    this.ballCount = 3;
    this.chargeThrow = 0;


	//game.physics.enable(this, Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this);

    this.scale.setTo(.5,.5);

    //this.body.collideWorldBounds = true;
    this.body.gravity.y = 1000;
    this.body.maxVelocity.y = 500;
    this.body.setSize(140,210,0, 12);

    this.ball_group = this.game.add.physicsGroup();

    this.animations.add('left', [0,1,2, 3, 4, 5, 6, 7], 12, true);
    this.animations.add('right', [16,17,18,19,20,21,22,23], 12, true);
    this.animations.add('throwRight',[13,12],12,false);
    this.animations.add('throwLeft',[10,11],12,false);

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype); 

Player.prototype.throwBall = function() {
	  if (this.game.time.now > this.nextShot && this.ballCount > 0) {
        this.ballCount--;
        this.nextShot = this.game.time.now + THROW_COOLDOWN;
        this.throwAngle = Phaser.Math.radToDeg(this.game.physics.arcade.angleToPointer(this));
       socket.emit("ball throw", {x: this.x, y: this.y, speed: this.chargeThrow, throw_angle: this.throwAngle, thrower: this.id, time: this.game.time.now});
    }
}

Player.prototype.catch = function() {
    if (this.game.time.now > this.nextCatch) {
        this.nextCatch = this.game.time.now + CATCH_COOLDOWN;
        this.catchTime = this.game.time.now + CATCH_WINDOW;
    }
}

Player.prototype.handleInput = function() {
	var moving;

    if ( leftButton.isDown || rightButton.isDown || jumpButton.isDown || leftClick.isDown || catchButton.isDown) {

        moving = true;
	  if (leftButton.isDown) { 
   		this.body.velocity.x = -DEFAULT_PLAYER_SPEED;
        if (this.body.velocity.y != 0){
            if (this.facing != "flying_left") {
                this.facing = "flying_left";
            } 
        } else if (this.facing != "running_left") {
                
                this.facing = "running_left";
        }
        this.running = 1;
   	}

    if (rightButton.isDown) { 
   		this.body.velocity.x = DEFAULT_PLAYER_SPEED;
        if (this.body.velocity.y != 0){
            if (this.facing != "flying_right") {
                this.facing = "flying_right";
                
            } 
        } else if (this.facing != "running_right") {
        
            this.facing = "running_right";
        }
        this.running = 1;
   	}

    if (jumpButton.isDown) { 
   		this.body.velocity.y = -DEFAULT_PLAYER_SPEED;
       
        if (this.body.velocity.y == 0){
            if (this.facing == "idle_left" || this.facing == "running_left" || this.frame == 8) {
                this.facing = "flying_left";
                
            } else {
                this.facing = "flying_right";
            }
          this.running = 0;
        }
   	}

   	if (leftClick.isDown) { 
        if (this.chargeThrow < MAX_POWER) {
            this.chargeThrow += CHARGE_RATE;
        }
        if (this.frame == 8 || this.facing == "flying_left" || this.facing == "throw_left" || this.facing == "running_left") {           
            this.facing = "throw_left";
        } else if (this.frame == 15 || this.facing == "flying_right" || this.facing == "throw_right" || this.facing == "running_right"){
            this.facing = "throw_right";
        }	
   	}

    if (catchButton.isDown) {
        this.catch();
        if (this.frame == 8 || this.facing == "flying_left" || this.facing == "throw_left") {
            this.facing = "throw_left";
        } else {
            this.facing = "throw_right";
        }   
    }

    }	

    else { 
        if(this.body.velocity.y == 0 && this.running != 0) {
            if (this.facing != "throw_left"||this.facing != "throw_right") {
                if (this.facing == "running_left" || this.facing == "flying_left" || this.facing == "throw_left") {
                      this.facing = "idle_left";
                } else {
                      this.facing = "idle_right";
                  }
                      this.running = 0;
            }
        }    
  	}

    if(this.body.velocity.y == 0 && this.body.velocity.x == 0){
        moving = false;
    } else {
        moving = true;
    }
    if(moving){
        socket.emit("move player", {x: this.x, y: this.y, facing: this.facing, dead: this.dead}); 
    }

    if (!leftClick.isDown && this.chargeThrow > MIN_POWER) {
        this.throwBall();
        this.chargeThrow = 0;
        /*if(this.facing == "running_left" || this.facing == "throw_left" || this.facing == "flying_left") {
          this.facing = "idle_left";
        } else if(this.facing == "running_right" || this.facing == "throw_right" || this.facing == "flying_right") {
          this.facing = "idle_right" ;
        }*/
    }
    //this.characterController();

};

 Player.prototype.freeze = function() { 
     this.body.velocity.x = 0; 
     this.body.velocity.y = 0; 
     this.animations.stop(); 
}; 

Player.prototype.characterController = function(){

  if(this.facing == "idle_left"){
        this.animations.stop();
        this.frame = 8;
  }
  if(this.facing == "idle_right"){
        this.animations.stop();
        this.frame = 15;
  }
  if(this.facing == "flying_right"){
        this.frame = 14;
  }
  if(this.facing == "flying_left"){
        this.frame = 9;
  }
  if(this.facing == "running_left"){
        this.animations.play('left');
  }
  if(this.facing == "running_right"){
        this.animations.play('right');
  }
  if(this.facing == "throw_left"){
        this.animations.play('throwLeft');
  }
  if(this.facing == "throw_right"){
        this.animations.play('throwRight');
  }
};

