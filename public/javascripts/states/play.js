var WizardBall = WizardBall || {};

WizardBall.play = function(game){
    var levelData;
    var player;
    var fireRate = 100;
    var nextThrow = 0;
    var facing = 'left';
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
        //Read from json file to get dependencies
        levelData = $.parseJSON(
           $.ajax({
                   url: "json/levelData.json", 
                   async: false, 
                   dataType: 'json'
                }
            ).responseText
        );

        this.game.load.spritesheet('player',levelData.test_level.player, 32, 32);
        this.game.load.image('background', levelData.test_level.background);
        this.game.load.image('ball', levelData.test_level.ball);
        this.game.load.audio('bgmusic',"audio/world_map.ogg");

    },
    

    create: function(){


        fireRate = 100;
        nextThrow = 0;
        facing = 'left';
        jumpTimer = 0;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        
        level = new Level();
        level.setBackgroundImage('background',1,true);
        level.setMusic(this.game.add.audio('bgmusic'));
        level.getMusic().setT
        level.getMusic().play();


        this.game.add.tileSprite(0, 0, 800, 600, level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;

        player = this.game.add.sprite(32, 320, 'player');
        player.scale.setTo(2,2);
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 500;
        player.body.setSize(32, 32, 2, 12);

        player.animations.add('right', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 15, true);
    //    player.animations.add('turn', [4], 20, true);
        player.animations.add('left', [24,23,22,21,20,19,18,17,16,15,13], 15, true);

        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        leftClick = this.game.input.activePointer.leftButton;


        level.setBalls(this.game.add.group());
        level.getBalls().enableBody = true;
        level.getBalls().physicsBodyType = Phaser.Physics.ARCADE;
        level.getBalls().createMultiple(10,'ball');



    },

    render: function() {

        // this.game.debug.text(this.game.time.physicsElapsed, 32, 32);
        // this.game.debug.body(player);
        this.game.debug.bodyInfo(player, 16, 24);
         this.game.debug.text("Left Button: " + leftButton.isDown, 300, 132);
        this.game.debug.text("Middle Button: " + this.game.input.activePointer.middleButton.isDown, 300, 196);

    },

    throwBall: function(){
        if (this.game.time.now > nextThrow && level.getBalls().countDead() > 0)
        {
            nextThrow = this.game.time.now + fireRate;

            var ball = level.getBalls().getFirstDead();
            

            ball.reset(player.x,player.y);
            this.game.physics.arcade.moveToPointer(ball,300);
            ball.body.collideWorldBounds = true;
            ball.body.bounce.setTo(.3,.5);
        }
    },

    controlHandler: function(){
        if(leftClick.isDown){
            this.throwBall();
        }
        
         if (leftButton.isDown)
        {
            player.body.velocity.x = -200;

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (rightButton.isDown)
        {
            player.body.velocity.x = 200;

            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 25;
                }
                else
                {
                    player.frame = 0;
                }

                facing = 'idle';
            }
        }
        
        if (jumpButton.isDown && player.body.onFloor() && this.game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = this.game.time.now + 750;
        }
    },

    update: function(){

        // this.game.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        this.controlHandler();

    }
}