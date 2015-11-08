var WizardBall = WizardBall || {};

WizardBall.setup = function(){};

//var StageSelect = function() {};

//module.exports = WizardBall.setup;

var xOffset = 40;
var yOffset = 50;

var thumbnailXOffset = 1280/2;
var thumbnailYOffset = 720/2;

var stageNameYOffset = 328;
var previewDim = 500;

var repeatingBombTilesprite;

var stages = [
	{name: "Stage 1", thumbnailKey: "thumbnailOne", tilemapName: "levelOne", maxPlayers: 4, size: "W.e"},
	{name: "Stage 2", thumbnailKey: "thumbnailTwo", tilemapName: "levelTwo", maxPlayers: 4, size: "W.e"}
];

WizardBall.setup.prototype = {
	init: function(gameID) {
		//repeatingBombTilesprite = rbts;
		this.gameID = gameID;
	},

	create: function() {
		//var selectionWindow = this.game.add.image(xOffset, yOffset, "", "/public/images/transRed.png");
		background = this.game.add.sprite(0,0,'setupBackground');
		phone = this.game.add.sprite(115,38, 'phoneGraphic');
		phone.angle = 2;
		this.selectedStageIndex = 0;
		var initialStage = stages[this.selectedStageIndex];
//		this.thumbnail = this.game.add.sprite(thumbnailXOffset, thumbnailYOffset, 'levelPreview');
//		this.thumbnail.anchor.setTo(.5,.5);
		
		this.leftButton = this.game.add.button(thumbnailXOffset - (previewDim/2) - 100, thumbnailYOffset - (thumbnailYOffset/2), 'leftButton', this.leftSelect, this, 1,0);
		//this.leftButton.anchor.setTo(.5,.5);
		this.rightButton = this.game.add.button(thumbnailXOffset + (previewDim/2), thumbnailYOffset - (thumbnailYOffset/2), 'rightButton', this.rightSelect, this,1,0);
		//this.rightButton.anchor.setTo(.5,.5);
		this.okButton = this.game.add.button(thumbnailXOffset + (previewDim/2), thumbnailYOffset + (previewDim/2) , 'okButton', this.confirmStageSelection, this,1,0);
		//this.okButton.anchor.setTo(.5,.5);
		//this.leftButton.setDownSound(buttonClickSound);
		//this.rightButton.setDownSound(buttonClickSound);
		//this.okButton.setDownSound(buttonClickSound);

		

		// Display title
		this.text = this.game.add.text(this.game.camera.width / 2, stageNameYOffset, initialStage.name);
		this.configureText(this.text, "white", 28);
		this.text.anchor.setTo(.5, .5);

		// Display number of players
/*		this.numPlayersText = this.game.add.text(145, 390, "Max # of players:   " + initialStage.maxPlayers);
		this.configureText(this.numPlayersText, "white", 18);

		// Display stage size
		this.stageSizeText = this.game.add.text(145, 420, "Map size:   " + initialStage.size);
		this.configureText(this.stageSizeText, "white", 18);*/
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
	//	repeatingBombTilesprite.tilePosition.x++;
	//	repeatingBombTilesprite.tilePosition.y--;
	},

	updateStageInfo: function() {
		var newStage = stages[this.selectedStageIndex];
		this.text.setText(newStage.name);
		this.numPlayersText.setText("Max # of players:   " + newStage.maxPlayers);
		this.stageSizeText.setText("Map size:   " + newStage.size);
		//this.thumbnail.loadTexture('purpleBar', newStage.thumbnailKey);
	},

	configureText: function(text, color, size) {
		text.font = "Carter One";
		text.fill = color;
		text.fontSize = size;
	},

	confirmStageSelection: function() {
		var selectedStage = stages[this.selectedStageIndex];

		socket.emit("select stage", {mapID: selectedStage.tilemapName});
		this.game.state.start("PendingGame", true, false, selectedStage.tilemapName, this.gameID, repeatingBombTilesprite);
	}
};