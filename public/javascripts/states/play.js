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

    },

    init: function(tilemapName, players, id) {
        this.tilemapName = tilemapName;
        this.players = players;

        this.playerId = id;
    },
    

    create: function(){
        this.remotePlayers = {};
        //this.remotePlayersGroup = this.game.add.physicsGroup();
        this.balls = {};
        //this.ballsGroup = this.game.add.physicsGroup();

        fireRate = 100;
        nextThrow = 0;
        facing = 'idle';
        jumpTimer = 0;

        
       dead = false;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //    filter = this.game.add.filter('Plasma',800,600);
        
        this.level = new Level(this.tilemapName);
        this.level.setBackgroundImage('greenBar',1,true);
        this.level.setMusic(this.game.add.audio('bgmusic'));
        this.level.getMusic().play();



        this.game.add.tileSprite(0,0,1280,720,this.level.getBackgroundImage());

        this.game.physics.arcade.gravity.y = 300;



        //this.player = new Player(500,200,this.playerId,this.game);

//        this.player = new Player(210,3400,'player',this.game);
        //this.opponent = new Player(300,3400,'opp',this.game);

        //this.player.tint = 0xffffff;

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
    },

    render: function() {

    },

    handleCollision: function(player,ball){
        if (this.game.time.now < player.catchTime) {
            player.ballCount++;
            for (var i in this.balls) {
                if (this.balls[i].ball == ball) {
                    socket.emit("ball destroy",{id : this.balls[i].id});
                }
            }
        } else { 
            player.hp -= 1;
            if (player.hp == 0) {
                if (player.id == 'player') {
                    dead = true; 
                }
                socket.emit("player hit");
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
        if(this.player && data.id == this.player.id || this.gameFrozen) {
            return;
        }

        var movingPlayer = this.remotePlayers[data.id];
        if(data.dead === true){
            if(movingPlayer && movingPlayer.alive){
                this.numPlayers --;
                movingPlayer.kill();
            }
            return;
        }

        movingPlayer.facing = data.f;
        if(movingPlayer.targetPosition) {

            movingPlayer.characterController();
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

        this.player.handleInput();
        this.player.characterController();
        this.updateRemoteAnimations();
        this.setEventHandlers();
    },

    updateRemoteAnimations: function(){
        if(this.facing == "flying_left" || this.facing == "running_left" || this.facing == "throw_left"){
            this.facing = "idle_left";
            this.characterController();
        } else if(this.facing == "flying_right" || this.facing == "running_right" || this.facing == "throw_right"){
            this.facing = "idle_right";
            this.characterController();
        } else if(!(this.facing != "idle_right" && this.facing != "idle_left")){
            this.facing = "idle_right";
            this.characterController();                  
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
            return false;
        }
        return true;
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

        this.player.body.velocity.x = 0;

        if (!dead) {
            this.player.handleInput();
        }

    },

    gameOver: function(data) {
        WizardBall.game.state.start("GameOver", true, false, data.mapID, data.players, this.id);
    }
}

var Ball = function(ball,id) {
    this.id = id;
    this.ball = ball;   
};
