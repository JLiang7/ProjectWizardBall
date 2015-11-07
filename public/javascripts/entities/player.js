var DEFAULT_PLAYER_SPEED = 300;
var FLYING_SPEED = 250;

var Player = function(x, y, id, game) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
	this.id = id;
	this.facing = "idle";
    this.frame = 15;
	//this.speed = 0;
    this.running = 0;
	//this.flying_speed = FLYING_SPEED;
	this.game = game;
	this.nextShot = 0;

	game.physics.enable(this, Phaser.Physics.ARCADE);

    this.scale.setTo(.5,.5);

    this.body.collideWorldBounds = true;
    this.body.gravity.y = 1000;
    this.body.maxVelocity.y = 500;
    this.body.setSize(140,210,0, 12);

    this.animations.add('left', [0,1,2, 3, 4, 5, 6, 7], 12, true);
    this.animations.add('right', [16,17,18,19,20,21,22,23], 12, true);
    this.animations.add('throwRight',[13,12],12,false);
    this.animations.add('throwLeft',[10,11],12,false);

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype); 

Player.prototype.throwBall = function() {
	 if (level.getBalls().countDead() > 0 && this.game.time.now > this.nextShot)
        {
        	this.nextShot = this.game.time.now + 300;
            var ball = level.getBalls().getFirstDead();
            ball.reset(player.x,player.y);
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

    //leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    //rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    //jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    //leftClick = this.game.input.activePointer.leftButton;


	if (leftButton.isDown) { 
   		player.body.velocity.x = -DEFAULT_PLAYER_SPEED;
        if (player.body.velocity.y != 0){
            if (facing != 'leftJump') {
                facing = 'leftJump';
                player.frame = 9;
            } 
        } else if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
        }
        player.running = 1;
   	} else if (rightButton.isDown) { 
   		player.body.velocity.x = DEFAULT_PLAYER_SPEED;
        if (player.body.velocity.y != 0){
            if (facing != 'rightJump') {
                facing = 'rightJump';
                player.frame = 14;
            } 
        } else if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
        }
        player.running = 1;
   	} else if (jumpButton.isDown && player.body.onFloor() && this.game.time.now > jumpTimer) { 
   		player.body.velocity.y = -DEFAULT_PLAYER_SPEED;
        if (facing == 'left' || player.frame == 8) {
            facing = 'leftJump';
            player.frame = 9;
        } else {
            facing = 'rightJump';
            player.frame = 14;
        }
   	} else if (leftClick.isDown) { 
   	    this.throwBall();
        if (player.frame == 8 || facing == 'leftJump' || facing == 'throwLeft') {
            player.animations.play('throwLeft');
            facing = 'throwLeft';
        } else {
            player.animations.play('throwRight');
            facing = 'throwRight';
        }	
   	} else { 
       if(player.body.velocity.y == 0 && player.running != 0){
                if (facing != 'idle' || facing != 'throwLeft'||facing != 'throwRight')
                {
                    player.animations.stop();

                    if (facing == 'left' || facing == 'leftJump' || facing == 'throwLeft')
                    {
                        player.frame = 8;
                    }
                    else
                    {
                        player.frame = 15;
                    }

                    facing = 'idle';
                    player.running = 0;
                }
            } 
  	} 

};

 Player.prototype.freeze = function() { 
     this.body.velocity.x = 0; 
     this.body.velocity.y = 0; 
     this.animations.stop(); 
}; 

