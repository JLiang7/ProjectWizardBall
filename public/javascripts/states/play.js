var WizardBall = WizardBall || {};

WizardBall.play = function(game){
    var levelData;
    var player;
    var fireRate = 100;
    var nextThrow = 0;
    var facing = 'right';
    var jumpTimer = 0;
    
    var filter;

    var cursors;
    var jumpButton;
    var jump
    var level;
    var leftButton;
    var rightButton;
    var leftClick;
    var balls;
}

WizardBall.play.prototype = {
    preload: function() {

    },
    

    create: function(){


        fireRate = 100;
        nextThrow = 0;
        facing = 'idle';
        jumpTimer = 0;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        
        level = new Level();
        level.setBackgroundImage('greenBar',1,true);
        level.setMusic(this.game.add.audio('bgmusic'));
        level.getMusic().play();



        this.game.add.tileSprite(0,0,1280,720,level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;

        this.player = new Player(500,200,'player',this.game);
        this.player.tint = 0xffffff;

        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        leftClick = this.game.input.activePointer.leftButton;



        map = this.game.add.tilemap('levelOne');
        map.addTilesetImage('platform_tile','platform_tile');
 //       map.addTilesetImage('medium_platform','platform_medium');
 //       map.addTilesetImage('small_platform','platform_small');
        this.layer = map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        map.setCollisionBetween(1,20);


       // layer.resizeWorld();
        // level.setBalls(this.game.add.group());
        // level.getBalls().enableBody = true;
        // level.getBalls().physicsBodyType = Phaser.Physics.ARCADE;
        // level.getBalls().createMultiple(1000,'ball');

        //player.running = 0;
    },

    render: function() {

    },

    throwBall: function(){
        if (this.game.time.now > nextThrow && level.getBalls().countDead() > 0)
        {
            nextThrow = this.game.time.now + fireRate;

            var ball = this.ball_group.create(this.player.x,this.player.y,'ball');
            ball.body.mass = 100;

            // var ball = level.getBalls().getFirstDead();
            

            // ball.reset(this.player.x,this.player.y);
            this.game.physics.arcade.moveToPointer(ball,300);
            ball.body.collideWorldBounds = true;
            ball.body.bounce.setTo(.3,.5);
        }
    },

    handleCollision: function(player,ball){
        player.hp -= 1;
        if (player.hp == 0) {
            player.kill();
        }
        ball.kill();
    },

    handleBallCollision: function(ball1,ball2){
        console.log("ball collision");
    },

    collided : function(){
        console.log("COLLIDING");
    },


    update: function(){

        this.game.physics.arcade.collide(this.player,this.player.ball_group,this.handleCollision,null,this);
        this.game.physics.arcade.collide(this.player.ball_group,this.player.ball_group,this.handleBallCollision,null,this);
        this.game.physics.arcade.collide([this.player,this.player.ball_group],this.layer,this.collided, null, this);
//        this.game.physics.arcade.collide(this.ball_group,this.layer,this.collided, null, this);
        //this.game.physics.arcade.collide(player, layer);
        this.player.body.velocity.x = 0;

        //this.controlHandler();
        this.player.handleInput();

        

    }
}