var WizardBall = WizardBall || {};

WizardBall.setup = function(){};

var xOffset = 40;
var yOffset = 50;

var thumbnailXOffset = 1280/2;
var thumbnailYOffset = 720/2;

var stageNameYOffset = 328;
var previewDim = 500;


var stages = [
	{name: "All out Brawl", thumbnailKey: "levelPreview2", tilemapName: "levelOne", maxPlayers: 4, size: "W.e", bg: "levelOneBG"},
	{name: "Jungle Tussle", thumbnailKey: "levelPreview1", tilemapName: "levelTwo", maxPlayers: 4, size: "W.e", bg: "levelTwoBG"}
];

WizardBall.setup.prototype = {
	init: function(gameID) {
		this.gameID = gameID;
	},

	create: function() {
		this.canPress = true;
		this.phoneGraphicsAngle = 2;
		this.stageselectedStageIndex = 0;
		this.phoneX = 310;
		this.phoneY = 355;
		//var selectionWindow = this.game.add.image(xOffset, yOffset, "", "/public/images/transRed.png");
		this.thumbnail = this.game.add.sprite(this.phoneX, this.phoneY, stages[this.stageselectedStageIndex].thumbnailKey);
		this.thumbnail2 = this.game.add.sprite(this.phoneX + 375, this.phoneY -2, 'levelPreview1');
		this.thumbnail.anchor.setTo(.5,.5);
		this.thumbnail2.anchor.setTo(.5,.5);
		this.thumbnail.angle = this.phoneGraphicsAngle;
		this.thumbnail2.angle = this.phoneGraphicsAngle;
		background = this.game.add.sprite(0,0,'setupBackground');
		phone = this.game.add.sprite(this.phoneX,this.phoneY, 'phoneGraphic');
		phone.anchor.setTo(.5,.5);
		phone.angle = this.phoneGraphicsAngle;
		this.selectedStageIndex = 0;
		var initialStage = stages[this.selectedStageIndex];
		
		this.leftButton = this.game.add.button(110, 500, 'leftButton', this.leftSelect, this, 1,0);
		this.leftButton.angle = this.phoneGraphicsAngle;

		this.rightButton = this.game.add.button(390,510, 'rightButton', this.rightSelect, this,1,0);
		this.rightButton.angle = this.phoneGraphicsAngle;

		this.okButton = this.game.add.button(255,505, 'okButton', this.confirmStageSelection, this,1,0);
		this.okButton.angle = this.phoneGraphicsAngle;

		

		

		// Display title
		var style = { font: "50px Arial", fill: "#000000", align: "left"};
		this.text = this.game.add.text(900, 100, initialStage.name,style);
		this.configureText(this.text, "black", 50);
		this.text.anchor.setTo(.5, .5);

		// Display number of players
/*		this.numPlayersText = this.game.add.text(145, 390, "Max # of players:   " + initialStage.maxPlayers);
		this.configureText(this.numPlayersText, "white", 18);

		// Display stage size
		this.stageSizeText = this.game.add.text(145, 420, "Map size:   " + initialStage.size);
		this.configureText(this.stageSizeText, "white", 18);*/
	},

	swipeLeft : function() {
		this.canPress = false;
		this.thumbnail2.x = this.phoneX + 375;
		this.thumbnail2.y = this.phoneY + 10;
		this.thumbnail2.loadTexture(stages[this.selectedStageIndex].thumbnailKey);
		this.thumbnail2.angle = this.phoneGraphicsAngle;
		this.thumbnail2.anchor.setTo(.5,.5);
		var lastTween = this.game.add.tween(this.thumbnail2).to({x:this.phoneX,y:this.phoneY},200,Phaser.Easing.Linear.none).start();
		lastTween.onComplete.add(this.updateSwipe,this);
	},

	swipeRight : function(){
		this.canPress = false;
		this.thumbnail2.x = this.phoneX - 375;
		this.thumbnail2.y = this.phoneY - 10;
		this.thumbnail2.loadTexture(stages[this.selectedStageIndex].thumbnailKey);
		this.thumbnail2.angle = this.phoneGraphicsAngle;
		this.thumbnail2.anchor.setTo(.5,.5);
		var lastTween = this.game.add.tween(this.thumbnail2).to({x:this.phoneX,y:this.phoneY},200,Phaser.Easing.Linear.none).start();
		lastTween.onComplete.add(this.updateSwipe,this);
	},

	updateSwipe : function(){
		this.thumbnail.loadTexture(stages[this.selectedStageIndex].thumbnailKey);
		this.canPress = true;
	},

	leftSelect: function() {
		if(this.canPress){
			if(this.selectedStageIndex === 0) {
				this.selectedStageIndex = stages.length - 1;
			} else {
				this.selectedStageIndex--;
			}
			this.swipeRight();
			this.updateStageInfo();
		}
	},

	rightSelect: function() {
		if(this.canPress){
			if(this.selectedStageIndex === stages.length - 1) {
				this.selectedStageIndex = 0;
			} else {
				this.selectedStageIndex++;
			}
			this.swipeLeft();
			this.updateStageInfo();
		}
	},

	update: function() {

	},

	updateStageInfo: function() {
		var newStage = stages[this.selectedStageIndex];
		this.text.setText(newStage.name);
		this.numPlayersText.setText("Max # of players:   " + newStage.maxPlayers);
		this.stageSizeText.setText("Map size:   " + newStage.size);
	},

	configureText: function(text, color, size) {
		text.font = "Carter One";
		text.fill = color;
		text.fontSize = size;
	},

	confirmStageSelection: function() {
		var selectedStage = stages[this.selectedStageIndex];
		socket.emit("select stage", {mapID: selectedStage.tilemapName, bg: selectedStage.bg});
		this.game.state.start("PendingGame", true, false, selectedStage.tilemapName, this.gameID, selectedStage.bg);
	}
};