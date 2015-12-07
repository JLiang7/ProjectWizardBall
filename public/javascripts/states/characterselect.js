var WizardBall = WizardBall || {};

WizardBall.charSelect = function(){
	var background;
	var accent1;
	var accent2;
	var charSplash;
	var charNameText;
	var charDescText;
	var enterKey;
	var backSpaceKey;
	var aKey;
	var dKey;
	var option;

	var transYellow;
	var transGreen;
	var transRed;
	var transPurple;

	var clickDelay; //find way to make global for all menus
	var nextClick;
}

WizardBall.charSelect.prototype = {
	preload : function(){

	},

	create : function(){
		WizardBall.username = document.getElementById('username').value;
 		if(WizardBall.username == ""){
 			WizardBall.username = "Enter a Username in the Lobby";
 		}
		nextClick = 0;
		enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		backSpaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
		aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

		this.option = 0;
		this.clickDelay = 1000;
		this.nextClick = 0;
		var style = { font: "35px Arial", fill: "#dde0ff", align: "center" };
		var style2 = { font: "50px Arial", fill: "#dde0ff", align: "left"};


		background = this.game.add.sprite(0,0,'purpleBar');
		accent1 = this.game.add.sprite(600,0, 'accent1');
		
		charSplash = this.game.add.sprite(120,40,'characterSplash');
		charSplash.scale.setTo(.75,.75);
		accent2 = this.game.add.sprite(0,550, 'accent2');
		charNameText = this.game.add.text(this.game.world.centerX+100, this.game.world.centerY+100, WizardBall.username,style);

		transPurple = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'purpleBar');
		transRed = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'redBar');
		transGreen = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'greenBar');
		transYellow = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'yellowBar');
		

		transPurple.alpha = 0.0;
		transRed.alpha = 0.0;
		transGreen.alpha = 0.0;
		transYellow.alpha = 0.0;

		transYellow.anchor.setTo(.5,.5);
		transYellow.scale.setTo(1,.05);

		transGreen.anchor.setTo(.5,.5);
		transGreen.scale.setTo(1,.05);

		transRed.anchor.setTo(.5,.5);
		transRed.scale.setTo(1,.05);

		transPurple.anchor.setTo(.5,.5);
		transPurple.scale.setTo(1,.05);
		
		



		
		charDescText = this.game.add.text(150, this.game.world.centerY +213, "Character Description",style2);
		charNameText.angle = -50;
		

	},

	reversePlaySelectAnimation : function(){
		charDescText.alpha = 0.0;
		charSplash.alpha = 0.0;
		charSplash.position.x = -200;
		charSplash.position.y = 40;
		charSplash.scale.setTo(.75,.75);


		this.game.add.tween(accent2.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent2).to({x:0,y:550},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1).to({x:600,y:0},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1).to({angle: 0},500,Phaser.Easing.Linear.none).start();

		this.game.add.tween(charNameText).to({angle: -50, x:this.game.world.centerX+100, y:this.game.world.centerY+100},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(charNameText.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none).start();

		this.game.add.tween(charSplash).to({x:120}, 500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(charSplash).to({alpha:1}, 100,Phaser.Easing.Linear.none).start();
		this.game.add.tween(charDescText).to({alpha:1}, 600,Phaser.Easing.Linear.none).start();


		this.option = 0;	
	},

	playSelectAnimation : function(){
		charDescText.alpha = 0.0;
		charSplash.alpha = 0.0;
		charSplash.position.x = 1280;
		charSplash.position.y = 200;
		charSplash.scale.setTo(1,1);


		this.game.add.tween(accent2.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent2).to({x:0,y:50},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1.scale).to({x:1.5,y:1.5},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1).to({x:-200,y:0},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(accent1).to({angle: 30},500,Phaser.Easing.Linear.none).start();

		this.game.add.tween(charNameText).to({angle: 0, x:50, y:100},500,Phaser.Easing.Linear.none).start();
		this.game.add.tween(charNameText.scale).to({x:1,y:1},500,Phaser.Easing.Linear.none).start();

		this.game.add.tween(charSplash).to({x:800,}, 600,Phaser.Easing.Linear.none).start();
		this.game.add.tween(charSplash).to({alpha:1}, 1000,Phaser.Easing.Linear.none).start();

		this.option = 1	
	},

	lobbyTransition : function(){
		transPurple.alpha = 1.0;
		transRed.alpha = 1.0;
		transGreen.alpha = 1.0;
		transYellow.alpha = 1.0;
		this.game.add.tween(transPurple.scale).to({y:1}, 100,Phaser.Easing.Linear.none).start();
		this.game.add.tween(transRed.scale).to({y:1}, 300,Phaser.Easing.Linear.none).start();
		this.game.add.tween(transGreen.scale).to({y:1}, 500,Phaser.Easing.Linear.none).start();
		this.lastTween = this.game.add.tween(transYellow.scale).to({y:1}, 700,Phaser.Easing.Linear.none).start();
		
		this.lastTween.onComplete.add(this.lobbyGo,this);
		this.option = 2;

	},

	lobbyGo : function(){
		backSpaceKey = {};
		this.state.start("Lobby");
	},

	update : function(){;

		if(this.option == 0){
			if(this.game.time.now > this.nextClick){
				if(enterKey.isDown){
					this.nextClick = this.game.time.now + this.clickDelay;
					this.playSelectAnimation();
				}
			}
		}
		if(this.option == 1){
			if(this.game.time.now > this.nextClick){
				if(backSpaceKey.isDown){
					this.nextClick = this.game.time.now + this.clickDelay;
					this.reversePlaySelectAnimation();
				}
				if(enterKey.isDown){
					this.nextClick = this.game.time.now + this.clickDelay;
					this.lobbyTransition();
					//go to lobby
				}
			}
		}
	}
}