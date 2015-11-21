var RemotePlayer = function(x,y,id,game){
	Phaser.Sprite.call(this, game, x, y, 'player');
	//this.spawnPoint = {x: x, y: y};
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
    //game.physics.arcade.enable(this);

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

RemotePlayer.prototype.updateCord = function(x,y){
	this.x = x;
	this.y = y;
}