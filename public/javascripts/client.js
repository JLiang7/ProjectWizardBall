var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('player', 'images/playerTest.png', 32, 32);
    game.load.image('background', 'images/background2.png');
    game.load.image('ball', 'images/ball.png');

}
//put in own class?
var player;
var fireRate = 100;
var nextThrow = 0;
var facing = 'left';
var jumpTimer = 0;
//

var cursors;
var jumpButton;
var jump
var level;
var leftButton;
var rightButton;
var leftClick;
var balls;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    
    level = new Level();
    level.setBackgroundImage('background');


    game.add.tileSprite(0, 0, 800, 600, level.getBackgroundImage());

    game.physics.arcade.gravity.y = 300;

    player = game.add.sprite(32, 320, 'player');
    player.scale.setTo(2,2);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
    player.body.setSize(32, 32, 2, 12);

    player.animations.add('right', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 15, true);
//    player.animations.add('turn', [4], 20, true);
    player.animations.add('left', [24,23,22,21,20,19,18,17,16,15,13], 15, true);

    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    leftClick = game.input.activePointer.leftButton;


    level.setBalls(game.add.group());
    level.getBalls().enableBody = true;
    level.getBalls().physicsBodyType = Phaser.Physics.ARCADE;
    level.getBalls().createMultiple(10,'ball');



}

function update() {

    // game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    controlHandler();

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    game.debug.bodyInfo(player, 16, 24);
     game.debug.text("Left Button: " + leftButton.isDown, 300, 132);
    game.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);

}

function throwBall(){
    if (game.time.now > nextThrow && level.getBalls().countDead() > 0)
    {
        nextThrow = game.time.now + fireRate;

        var ball = level.getBalls().getFirstDead();
        

        ball.reset(player.x,player.y);
        game.physics.arcade.moveToPointer(ball,300);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(.3,.5);
    }
}

function controlHandler(){
    if(leftClick.isDown){
        throwBall();
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
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -500;
        jumpTimer = game.time.now + 750;
    }
}