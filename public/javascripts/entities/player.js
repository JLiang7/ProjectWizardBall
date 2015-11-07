var DEFAULT_PLAYER_SPEED = 300;
var FLYING_SPEED = 250;

var Player = function(x, y, id, game) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.spawnPoint = {x: x, y: y};
	this.id = id;
	this.facing = "left";
	this.speed = DEFAULT_PLAYER_SPEED;
	this.flying_speed = FLYING_SPEED;
	this.game = game;

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

Player.prototype.handleInput = function() {

	var moving = true;
	var game = this.game;
	var speed = this.speed;
	var flying_speed = this.flying_speed;
	var facing = this.facing;

    leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    leftClick = this.game.input.activePointer.leftButton;


	if (leftButton.isDown) { 
   		player.body.velocity.x = -speed;
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
   		player.body.velocity.x = speed;
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
   	} else if (jumpButton.isDown) { 
   		player.body.velocity.y = -speed;
        if (facing == 'left' || player.frame == 8) {
            facing = 'leftJump';
            player.frame = 9;
        } else {
            facing = 'rightJump';
            player.frame = 14;
        }
   	} else if (leftClick.isDown) { 
   		var x = 'hi';
   	    // this.throwBall();
        // if (player.frame == 8 || facing == 'leftJump' || facing == 'throwLeft') {
        //     player.animations.play('throwLeft');
        //     facing = 'throwLeft';
        // } else {
        //     player.animations.play('throwRight');
        //     facing = 'throwRight';
        // }	
   	} else { 
       moving = false; 
   	//   this.freeze(); 
  	} 

};

 Player.prototype.freeze = function() { 
     this.body.velocity.x = 0; 
     this.body.velocity.y = 0; 
     this.animations.stop(); 
}; 

