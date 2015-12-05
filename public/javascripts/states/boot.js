//this is where we set up the screen, physics, and preload assets (loading bar, splash, etc)

var WizardBall = WizardBall || {};
var levelData;
WizardBall.boot = function(){
	Phaser.State.call(this);
};

WizardBall.boot.prototype = {
	preload : function(){
		$.getJSON('json/leveldata.json', function(data){
			levelData = data;
		});
		this.load.image('logo',"images/loadingBG.png");
		this.load.image("loader", "images/loader.png");
		WizardBall.game.stage.disableVisibilityChange = true;
	},

	create : function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 640;
		this.scale.minHeight = 360;
		this.scale.maxWidth = 1280;
		this.scale.maxHeight = 720;

		this.scale.pageAlignHorizontally = true;

		this.scale.updateLayout();

		this.game.physics.startSystem(Phaser.Physics.ARCADE);


		this.state.start("Preload");
	}
};