var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'images/dude.png', 32, 48);
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
var bg;
var leftButton;
var rightButton;
var leftClick;
var balls;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.arcade.gravity.y = 300;

    player = game.add.sprite(32, 320, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    leftClick = game.input.activePointer.leftButton;


    balls = game.add.group();
    balls.enableBody = true;
    balls.physicsBodyType = Phaser.Physics.ARCADE;

    balls.createMultiple(10,'ball');



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
    if (game.time.now > nextThrow && balls.countDead() > 0)
    {
        nextThrow = game.time.now + fireRate;

        var ball = balls.getFirstDead();
        

        ball.reset(player.x,player.y);
        game.physics.arcade.moveToPointer(ball,300);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(.4,.4);
    }
}

function controlHandler(){
    if(leftClick.isDown){
        throwBall();
    }
    
     if (leftButton.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (rightButton.isDown)
    {
        player.body.velocity.x = 150;

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
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
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