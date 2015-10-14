var WizardBall = WizardBall || {};

WizardBall.preload = function(){};
var levelData;
WizardBall.preload.prototype = {

	preload: function(){
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
		this.splash.anchor.setTo(0.5);

		this.preloadBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY, "loader");
		this.preloadBar.anchor.setTo(0.5);

		this.load.setPreloadSprite(this.preloadBar);

		levelData = $.parseJSON(
           $.ajax({
                   url: "json/levelData.json", 
                   async: false, 
                   dataType: 'json'
                }
            ).responseText
        );

		this.loadPlayResources();
		this.loadTransitionEffects();
		this.loadCharacterSelectResources();
	},

	loadPlayResources : function(){
		this.game.load.spritesheet('player',levelData.test_level.player, 32, 32);
        this.game.load.image('background', levelData.test_level.background);
        this.game.load.image('ball', levelData.test_level.ball);
        this.game.load.audio('bgmusic',levelData.test_level.bgmusic);
	},

	loadTransitionEffects : function(){
		this.game.load.image('yellowBar',levelData.special.trans_yellow);
		this.game.load.image('greenBar', levelData.special.trans_green);
		this.game.load.image('redBar', levelData.special.trans_red);
		this.game.load.image('purpleBar', levelData.special.trans_purple);
	},


	loadCharacterSelectResources : function(){
		this.game.load.image('selectBackground', levelData.character_select.background);
		this.game.load.image('accent1', levelData.character_select.accent1);
		this.game.load.image('accent2', levelData.character_select.accent2);
		this.game.load.image("characterSplash", levelData.character_select.character_splash);
	},

	create: function(){
		this.state.start("CharacterSelect");
	}
};