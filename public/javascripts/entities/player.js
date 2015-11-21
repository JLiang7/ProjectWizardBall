var DEFAULT_PLAYER_SPEED = 300;
var FLYING_SPEED = 250;

var Player = function(x, y, id, game) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
    this.uuid = id;
	this.id = id;
	this.facing = "idle";
    this.frame = 15;
	//this.speed = 0;
    this.running = 0;
    this.hp = 3;
	//this.flying_speed = FLYING_SPEED;
	this.game = game;
	this.nextShot = 0;

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
	 if (this.game.time.now > this.nextShot)
        {
        	this.nextShot = this.game.time.now + 300;
            //var ball = level.getBalls().getFirstDead();
            var ball = this.ball_group.create(this.x,this.y,'ball');
            //ball.reset(this.x,this.y);
            this.game.physics.arcade.moveToPointer(ball, 800);
            ball.body.collideWorldBounds = true;
            ball.body.bounce.setTo(.5,.5);
        }
}

Player.prototype.handleInput = function() {

	//var moving = true;
	//var game = this.game;
	//var speed = this.speed;
	//var flying_speed = this.flying_speed;

    if ( leftButton.isDown || rightButton.isDown || jumpButton.isDown || leftClick.isDown ) {

	if (leftButton.isDown) { 
   		this.body.velocity.x = -DEFAULT_PLAYER_SPEED;
        if (this.body.velocity.y != 0){
            if (facing != 'leftJump') {
                facing = 'leftJump';
                this.frame = 9;
            } 
        } else if (facing != 'left') {
                this.animations.play('left');
                facing = 'left';
        }
        this.running = 1;
   	}

    if (rightButton.isDown) { 
   		this.body.velocity.x = DEFAULT_PLAYER_SPEED;
        if (this.body.velocity.y != 0){
            if (facing != 'rightJump') {
                facing = 'rightJump';
                this.frame = 14;
            } 
        } else if (facing != 'right') {
            this.animations.play('right');
            facing = 'right';
        }
        this.running = 1;
   	}

    if (jumpButton.isDown) { 
   		this.body.velocity.y = -DEFAULT_PLAYER_SPEED;
        if (facing == 'left' || this.frame == 8) {
            facing = 'leftJump';
            this.frame = 9;
        } else {
            facing = 'rightJump';
            this.frame = 14;
        }
   	}

   	if (leftClick.isDown) { 
   	    this.throwBall();
        if (this.frame == 8 || facing == 'leftJump' || facing == 'throwLeft') {
            this.animations.play('throwLeft');
            facing = 'throwLeft';
        } else {
            this.animations.play('throwRight');
            facing = 'throwRight';
        }	
   	}

    }	

    else { 
       if(this.body.velocity.y == 0 && this.running != 0){
                if (facing != 'idle' || facing != 'throwLeft'||facing != 'throwRight')
                {
                    this.animations.stop();

                    if (facing == 'left' || facing == 'leftJump' || facing == 'throwLeft')
                    {
                        this.frame = 8;
                    }
                    else
                    {
                        this.frame = 15;
                    }

                    facing = 'idle';
                    this.running = 0;
                }
            } 
  	} 

};

 Player.prototype.freeze = function() { 
     this.body.velocity.x = 0; 
     this.body.velocity.y = 0; 
     this.animations.stop(); 
}; 

