var WizardBall = WizardBall || {};

WizardBall.preload = function(){};

WizardBall.preload.prototype = {
	preload: function(){
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
		this.splash.anchor.setTo(0.5);

		this.preloadBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY, "loader");
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		var levelData = $.parseJSON(
           $.ajax({
                   url: "json/levelData.json", 
                   async: false, 
                   dataType: 'json'
                }
            ).responseText
        );

        this.game.load.spritesheet('player',levelData.test_level.player, 32, 32);
        this.game.load.image('background', levelData.test_level.background);
        this.game.load.image('ball', levelData.test_level.ball);
        this.game.load.audio('bgmusic',levelData.test_level.bgmusic);
	},

	create: function(){
		this.state.start("Play");
	}
};