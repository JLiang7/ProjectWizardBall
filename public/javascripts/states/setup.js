var WizardBall = WizardBall || {};

WizardBall.setup = function(){};

//var StageSelect = function() {};

//module.exports = WizardBall.setup;

var xOffset = 40;
var yOffset = 50;

var thumbnailXOffset = 255;
var thumbnailYOffset = 150;

var stageNameYOffset = 328;

var repeatingBombTilesprite;

var stages = [
	{name: "Stage 1", thumbnailKey: "/public/images/anime_city.png", tilemapName: "levelOne", maxPlayers: 4, size: "W.e"},
	{name: "Stage 2", thumbnailKey: "/public/images/ball.png", tilemapName: "levelTwo", maxPlayers: 4, size: "W.e"}
];

WizardBall.setup.prototype = {
	init: function(gameID) {
		//repeatingBombTilesprite = rbts;
		this.gameID = gameID;
	},

	create: function() {
		var selectionWindow = game.add.image(xOffset, yOffset, TEXTURES, "/public/images/transRed.png");
		this.selectedStageIndex = 0;
		var initialStage = stages[this.selectedStageIndex];

		this.leftButton = game.add.button(150, 180, TEXTURES, this.leftSelect, this, "/public/images/transYellow.png", "/public/images/ball.png");
		this.rightButton = game.add.button(400, 180, TEXTURES, this.rightSelect, this, "/public/images/transPurple.png", "/public/images/ball.png");
		this.okButton = game.add.button(495, 460, TEXTURES, this.confirmStageSelection, this, "/public/images/transGreen.png", "/public/images/ball.png");

		this.leftButton.setDownSound(buttonClickSound);
		this.rightButton.setDownSound(buttonClickSound);
		this.okButton.setDownSound(buttonClickSound);

		this.thumbnail = game.add.image(thumbnailXOffset, thumbnailYOffset, TEXTURES, initialStage.thumbnailKey);

		// Display title
		this.text = game.add.text(game.camera.width / 2, stageNameYOffset, initialStage.name);
		this.configureText(this.text, "white", 28);
		this.text.anchor.setTo(.5, .5);

		// Display number of players
		this.numPlayersText = game.add.text(145, 390, "Max # of players:   " + initialStage.maxPlayers);
		this.configureText(this.numPlayersText, "white", 18);

		// Display stage size
		this.stageSizeText = game.add.text(145, 420, "Map size:   " + initialStage.size);
		this.configureText(this.stageSizeText, "white", 18);
	},

	leftSelect: function() {
		if(this.selectedStageIndex === 0) {
			this.selectedStageIndex = stages.length - 1;
		} else {
			this.selectedStageIndex--;
		}
	this.updateStageInfo();
	},

	rightSelect: function() {
		if(this.selectedStageIndex === stages.length - 1) {
			this.selectedStageIndex = 0;
		} else {
			this.selectedStageIndex++;
		}

		this.updateStageInfo();
	},

	update: function() {
		repeatingBombTilesprite.tilePosition.x++;
		repeatingBombTilesprite.tilePosition.y--;
	},

	updateStageInfo: function() {
		var newStage = stages[this.selectedStageIndex];
		this.text.setText(newStage.name);
		this.numPlayersText.setText("Max # of players:   " + newStage.maxPlayers);
		this.stageSizeText.setText("Map size:   " + newStage.size);
		this.thumbnail.loadTexture(TEXTURES, newStage.thumbnailKey);
	},

	configureText: function(text, color, size) {
		text.font = "Carter One";
		text.fill = color;
		text.fontSize = size;
	},

	confirmStageSelection: function() {
		var selectedStage = stages[this.selectedStageIndex];

		socket.emit("select stage", {mapName: selectedStage.tilemapName});
		game.state.start("PendingGame", true, false, selectedStage.tilemapName, this.gameID, repeatingBombTilesprite);
	}
};