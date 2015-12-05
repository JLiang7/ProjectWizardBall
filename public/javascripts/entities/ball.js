//var audioPlayer = require("../audio/audio_player");
//var textureUtil = require("../images/texture_util");
var WizardBall = WizardBall || {};

var Ball = function(x, y, id, game) {
	Phaser.Sprite.call(this, game, x, y, 'ball');
	this.id = id;

	this.anchor.setTo(.5,.5);
	game.physics.enable(this, Phaser.Physics.ARCADE);

	game.add.existing(this);

};

Ball.prototype = Object.create(Phaser.Sprite.prototype);

Ball.prototype.remove = function () {
    this.destroy();
};



