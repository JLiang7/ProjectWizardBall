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
var remotePlayers = [];

WizardBall.play.prototype = {
    preload: function() {

    },
    

    create: function(){

        var uuid = this.uuid();
        fireRate = 100;
        nextThrow = 0;
        facing = 'idle';
        jumpTimer = 0;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        
        this.level = new Level("levelOne");
        this.level.setBackgroundImage('greenBar',1,true);
        this.level.setMusic(this.game.add.audio('bgmusic'));
        this.level.getMusic().play();



        this.game.add.tileSprite(0,0,1280,720,this.level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;


        this.player = new Player(500,200,uuid,this.game);
        this.player.tint = 0xffffff;
        console.log(uuid);
        socket.emit("new player",{x:this.player.x,y:this.player.y,uuid:uuid});

        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        leftClick = this.game.input.activePointer.leftButton;



        map = this.game.add.tilemap(this.level.getMap());

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
    //    console.log("COLLIDING");
    },
    uuid : function(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
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
        this.tempNewPlayerListeners();

        socket.emit("update player",{x:this.player.x,y:this.player.y,uuid:this.uuid});

        

    },
    tempNewPlayerListeners : function(){
        socket.on("new player", function(data){
            if(findPlayer(data.uuid) == null && this.uuid != data.uuid){
 //               console.log(data.uuid);
                remotePlayers.push(new RemotePlayer(data.x,data.y,data.uuid,WizardBall.game));
            }
            console.log(remotePlayers[0].uuid);
        });
        socket.on("update player", function(data){
            foundPlayer = findPlayer(data.id);
            if(foundPlayer != null){
                    foundPlayer.x =data.x;
                    foundPlayer.y =data.y;
            }
            
        });
    }
}
var findPlayer = function(uid){
    for(var i = 0; i <remotePlayers.length; i ++){
        if(remotePlayers[i].uuid === uid)
            return remotePlayers[i];
    };

    return;
};