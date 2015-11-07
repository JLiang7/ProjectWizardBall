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
    //    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        
        level = new Level();
        level.setBackgroundImage('greenBar',1,true);
        level.setMusic(this.game.add.audio('bgmusic'));
        level.getMusic().play();


        this.game.add.tileSprite(0,0,1280,720,level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;

        player = new Player(210,3400,'player',this.game);
        player.tint = 0xffffff;

    //     player = this.game.add.sprite(210,3400, 'player');
    //     player.scale.setTo(.5,.5);
    //     this.game.physics.enable(player, Phaser.Physics.ARCADE);

    //     player.body.collideWorldBounds = true;
    //     player.body.gravity.y = 1000;
    //     player.body.maxVelocity.y = 500;
    //     player.body.setSize(140,210,0, 12);

    //     player.animations.add('left', [0,1,2, 3, 4, 5, 6, 7], 12, true);
    // //    player.animations.add('turn', [4], 20, true);
    //     player.animations.add('right', [16,17,18,19,20,21,22,23], 12, true);
    //     player.animations.add('throwRight',[13,12],12,false);
    //     player.animations.add('throwLeft',[10,11],12,false);

         leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
         rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
         jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
         leftClick = this.game.input.activePointer.leftButton;


        level.setBalls(this.game.add.group());
        level.getBalls().enableBody = true;
        level.getBalls().physicsBodyType = Phaser.Physics.ARCADE;
        level.getBalls().createMultiple(1000,'ball');

        //player.running = 0;
    },

    render: function() {

        // this.game.debug.text(this.game.time.physicsElapsed, 32, 32);
        // this.game.debug.body(player);
    //    this.game.debug.bodyInfo(player, 16, 24);
    //    this.game.debug.text("Left Button: " + leftButton.isDown, 300, 132);
    //    this.game.debug.text("Middle Button: " + this.game.input.activePointer.middleButton.isDown, 300, 196);

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

    /*controlHandler: function(){
        if(leftClick.isDown){
            this.throwBall();
            if(player.frame == 8 || facing == 'leftJump' || facing == 'throwLeft'){
                player.animations.play('throwLeft');
                facing = 'throwLeft';
            }else{
                player.animations.play('throwRight');
                facing = 'throwRight';
            }
        }else if (leftButton.isDown)
        {
            player.body.velocity.x = -200;
            if(player.body.velocity.y != 0){
                if(facing != 'leftJump'){
                    facing = 'leftJump';
                    player.frame = 9;
                }
            } else if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
            player.running = 1;
        }
        else if (rightButton.isDown)
        {
            player.body.velocity.x = 200;

            if(player.body.velocity.y != 0){
                if(facing != 'rightJump'){
                    facing = 'rightJump';
                    player.frame = 14;
                }
            }else if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
                player.running = 1;
            }

        }
        else if (jumpButton.isDown && player.body.onFloor() && this.game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = this.game.time.now + 750;
            if(facing == 'left' || player.frame == 8){
                facing = 'leftJump';
                player.frame = 9;
            }else{
                facing = 'rightJump';
                player.frame = 14;
            }
        }else{
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
        
        

        
    },*/

    update: function(){

        //this.game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;

        //this.controlHandler();
        player.handleInput();
    }
}