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
    //var balls;
}

WizardBall.play.prototype = {
    
    preload: function() {
        if(this.meme){
            this.game.load.audio('catch',['audio/horns.mp3', 'audio/horns.ogg']);
            this.game.load.audio('hit', ['audio/horn.mp3', 'audio/horn.ogg']);
        }else{
            this.game.load.audio('catch',['audio/catch.wav','audio/catch.ogg']);
            this.game.load.audio('hit',['audio/marker.mp3','audio/marker.ogg']);
        }
    },

    init: function(tilemapName, players, id, bg, meme) {
        this.tilemapName = tilemapName;
        this.players = players;
        this.bg = bg;
        this.playerId = id;

        this.meme = meme;
    },
    

    create: function(){
        this.whistleBlower = false;
        this.remotePlayers = {};
        //this.remotePlayersGroup = this.game.add.physicsGroup();
        this.balls = {};
        //this.ballsGroup = this.game.add.physicsGroup();
        this.MEME_DELAY = 5000;
        this.memeTime = this.game.time.now + this.MEME_DELAY;
        fireRate = 100;
        nextThrow = 0;
        facing = 'idle';
        jumpTimer = 0;

        catchSound = this.game.add.audio('catch');
        hitSound = this.game.add.audio('hit');
        
       dead = false;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        this.level = new Level(this.tilemapName);
        this.level.setBackgroundImage(this.bg,1,true);
        
        //this.level.getMusic().play();



        this.game.add.tileSprite(0,0,1280,720,this.level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;
        

        //this.player = new Player(500,200,this.playerId,this.game);

//        this.player = new Player(210,3400,'player',this.game);
        //this.opponent = new Player(300,3400,'opp',this.game);


        leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        catchButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        leftClick = this.game.input.activePointer.leftButton; 


        map = this.game.add.tilemap(this.level.getMap());

        map.addTilesetImage('platform_tile','platform_tile');
 //       map.addTilesetImage('medium_platform','platform_medium');
 //       map.addTilesetImage('small_platform','platform_small');
        this.layer = map.createLayer("Tile Layer 1");
        this.layer.resizeWorld();
        map.setCollisionBetween(1,20);

        this.initializePlayers();
        this.player.tint = 0xFF7919;

    },

    render: function() {

    },

    handleCollision: function(player,ball){
        if (this.game.time.now < player.catchTime) {
            catchSound.play();
            player.ballCount++;
            for (var i in this.balls) {
                if (this.balls[i].ball == ball) {
                    var tempx = this.balls[i].ball.x;
                    var tempy = this.balls[i].ball.y;
                    if(this.meme){
                        var quickscope = this.game.add.sprite(tempx,tempy,"quickscope");
                        quickscope.anchor.setTo(.5, .5);
                        quickscope.scale.setTo(.5,.5);
                        quickscope.animations.add('shoot',[7,8,9,10,11,12,13,14,15,16,17,18], 21, false);
                        quickscope.animations.play('shoot');
                        quickscope.events.onAnimationComplete.add(function(){
                           quickscope.kill();
                        }, this);
                    }
                    socket.emit("ball destroy",{id : this.balls[i].id});
                }
            }
        } else { 
            player.hp -= 1;
            if (player.hp == 0) {
                hitSound.play();
                if (player.id == 'player') {
                    dead = true; 
                }
                socket.emit("player hit");
                player.dead = true;
                player.kill();
            }
            for (var i in this.balls) {
                if (this.balls[i].ball == ball) {
                    socket.emit("ball destroy",{id : this.balls[i].id});
                }
            }
        }
        //ball.kill();
    },

    handleBallCollision: function(ball1,ball2){
        
    },

    collided : function(){
    
    },

    onMovePlayer: function(data) {
        if(data.won){
            this.onGameOver({winnerID:data.winnerID});
        }
        if(this.player && data.id == this.player.id || this.gameFrozen) {
            return;
        }
       

        var movingPlayer = this.remotePlayers[data.id];
        movingPlayer.facing = data.f;
        if(data.dead === true){
             movingPlayer.dead = true;
            if(movingPlayer && movingPlayer.alive){
                this.numPlayers --;
                movingPlayer.kill();
                hitSound.play();
            }
            return;
        }

        movingPlayer.facing = data.f;
        if(movingPlayer.targetPosition) {

            //movingPlayer.characterController();
            movingPlayer.lastMoveTime = WizardBall.game.time.now;

            if(data.x == movingPlayer.targetPosition.x && data.y == movingPlayer.targetPosition.y) {
                return;
            }

            movingPlayer.distanceToCover = {x: data.x - movingPlayer.targetPosition.x, y: data.y - movingPlayer.targetPosition.y};
            movingPlayer.distanceCovered = {x: 0, y:0};
            var tw = this.game.add.tween(movingPlayer).to({ x: movingPlayer.targetPosition.x, y: movingPlayer.targetPosition.y}, 50).interpolation(Phaser.Math.bezierInterpolation).start();

        }

        movingPlayer.targetPosition = {x: data.x, y: data.y};
    },



    update: function(){

        this.game.physics.arcade.collide(this.player,this.player.ball_group,this.handleCollision,null,this);

        this.game.physics.arcade.collide(this.player.ball_group,this.player.ball_group,this.handleBallCollision,null,this);

        this.game.physics.arcade.collide([this.player,this.player.ball_group],this.layer,this.collided, null, this);

        this.player.body.velocity.x = 0;
        this.updateRemoteAnimations();
        //this.player.handleInput();
        this.player.characterController();
        
        this.setEventHandlers();

        if(this.meme && this.game.time.now > this.memeTime){
            this.memeTime = this.game.time.now + this.MEME_DELAY;
            var tempx = this.game.rnd.realInRange(20, 1260);
            var tempy = this.game.rnd.realInRange(20,700);
            var froggy = this.game.add.sprite(tempx,tempy,"froggy");
            froggy.anchor.setTo(.5, .5);
            froggy.scale.setTo(.5,.5);
            froggy.animations.add('spin',[0,1,2,3,4,5,6,7,8,9], 20, true);
            froggy.animations.play("spin");
            
        }

        if(this.checkGameOver()){
            this.leftButton = {};
            this.rightButton = {};
            this.jumpButton = {};
            socket.emit("game over", {winnerID: this.id});
        }
    },

    updateRemoteAnimations: function(){
       for(var i in this.remotePlayers){
            this.remotePlayers[i].characterController();
       }
    },

    onSocketDisconnect: function() {
        this.broadcast.emit("remove player", {id: this.id});
    },

    initializePlayers: function() {
        for(var i in this.players) {
            var data = this.players[i];
            if(data.id == this.playerId) {
                this.player = new Player(data.x, data.y, data.id, WizardBall.game);
            } else {
                var remotePlayer = new RemotePlayer(data.x, data.y, data.id, WizardBall.game);
                remotePlayer.tint = 0x19AFFF;
                this.remotePlayers[data.id] = remotePlayer;
            }
        }
    },

    onRemovePlayer: function(data) {
        var playerToRemove = this.remotePlayers[data.id];

        if(playerToRemove.alive) {
            playerToRemove.destroy();
        }

        delete this.remotePlayers[data.id];
        delete this.players[data.id];
    },

    onBallThrown: function(data) {
            
            for (var i in this.balls) {
                if (this.balls[i].id == data.time) {
                    return;
                }
            }
            var ball = this.player.ball_group.create(data.x,data.y,'ball');

            var ball_wrapper = new Ball(ball,data.time);
            this.balls[data.time] = ball_wrapper;
            this.game.physics.arcade.velocityFromAngle(data.throw_angle, data.speed,ball.body.velocity);

            ball.body.collideWorldBounds = true;
            ball.body.bounce.setTo(.5,.5);
    },

    checkGameOver: function(data){
        for(var i in this.remotePlayers){
            
            if(!this.remotePlayers[i].dead)
                return false;
        }
        this.whistleBlower = true;
        return true;
    },

    onGameOver: function(data){
        var won = false;

        if(this.whistleBlower){
            won = true;
        }

        WizardBall.game.state.start("GameOver", true, false, won, this.meme);    
    },

    onBallDestroy: function(data) {
        for (var i in this.balls) {
            if (this.balls[i].id == data.id) {
                this.balls[i].ball.kill();
                delete this.balls[i];
            }
        }
    },

    setEventHandlers: function(){
        socket.on("disconnect",this.onClientDisconnect);
        socket.on("m", this.onMovePlayer.bind(this));
        socket.on("remove player",this.onRemovePlayer.bind(this));
        socket.on("ball throw", this.onBallThrown.bind(this));
        socket.on("ball destroy", this.onBallDestroy.bind(this));
        socket.on("game over", this.onGameOver.bind(this));

        this.player.body.velocity.x = 0;

        if (!dead) {
            this.player.handleInput();
        }

    },

 /*   gameOver: function(data) {
        WizardBall.game.state.start("GameOver", true, false, data.mapID, data.players, this.id);
    }*/
}

var Ball = function(ball,id) {
    this.id = id;
    this.ball = ball;   
};
