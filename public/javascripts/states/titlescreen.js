var WizardBall = WizardBall || {};

WizardBall.titlescreen = function(){
	var enterKey;
};

WizardBall.titlescreen.prototype = {
	preload : function(){

	},

	create : function(){
		this.clickDelay = 1000;
		this.nextClick = 0;
		this.background = this.game.add.sprite(0,0,"titleScreen");
		this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		this.transPurple = this.game.add.sprite(-3480,0, 'purpleBar');
		this.transRed = this.game.add.sprite(-2480,0, 'redBar');
		this.transGreen = this.game.add.sprite(-1880,0, 'greenBar');
		this.transYellow = this.game.add.sprite(-1680,0, 'yellowBar');
		

		this.transPurple.alpha = 0.0;
		this.transRed.alpha = 0.0;
		this.transGreen.alpha = 0.0;
		this.transYellow.alpha = 0.0;

//		this.transYellow.anchor.setTo(.5,.5);
//		this.transYellow.scale.setTo(1,.05);

//		this.transGreen.anchor.setTo(.5,.5);
//		this.transGreen.scale.setTo(1,.05);

//		this.transRed.anchor.setTo(.5,.5);
//		this.transRed.scale.setTo(1,.05);

//		this.transPurple.anchor.setTo(.5,.5);
//		this.transPurple.scale.setTo(1,.05);
	},

	transitionGo : function(){

		this.state.start("CharacterSelect");
	},

	transitionAnimation : function(){
		this.transPurple.alpha = 1;
		this.transRed.alpha = 1;
		this.transGreen.alpha = 1;
		this.transYellow.alpha = 1;
		this.game.add.tween(this.transYellow).to({x:2480} ,800,Phaser.Easing.Linear.none).start();
		this.game.add.tween(this.transGreen).to({x:1880} ,800,Phaser.Easing.Linear.none).start();
		this.game.add.tween(this.transRed).to({x:1280} ,800,Phaser.Easing.Linear.none).start();
		this.lastTween = this.game.add.tween(this.transPurple).to({x:0} ,800,Phaser.Easing.Linear.none).start();

		this.lastTween.onComplete.add(this.transitionGo,this);
	},

	

	update : function(){
		if(this.enterKey.isDown && this.game.time.now > this.nextClick){
			this.nextClick = this.game.time.now + this.clickDelay;
			this.transitionAnimation();
		}
	}
};