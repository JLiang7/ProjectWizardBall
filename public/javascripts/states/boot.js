//this is where we set up the screen, physics, and preload assets (loading bar, splash, etc)

var WizardBall = WizardBall || {};

WizardBall.boot = function(){};

WizardBall.boot.prototype = {
	preload : function(){
		this.load.image('logo',"images/icon.jpg");
		this.load.image("loader", "images/loader.png");
	},

	create : function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 200;
		this.scale.minHeight = 150;
		this.scale.maxWidth = 1200;
		this.scale.maxHeight = 800;

		this.scale.pageAlignHorizontally = true;

		this.scale.updateLayout();

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.state.start("Preload");
	}
};