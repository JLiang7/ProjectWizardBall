var WizardBall = WizardBall || {};

WizardBall.gameover = function(game) {
}
WizardBall.gameover.prototype = {
	init: function(won,meme){
		this.won = won;
		this.meme = meme;
		this.victory = "Victory";
		this.defeat = "Defeat";
		if(this.meme){
			this.victory = "****The winner is you****";
			this.defeat = "get reKt kid"
		}
	},
	create: function(){
		background = this.game.add.sprite(0,0,'redBar');
		var messege = this.defeat;
		if(this.won){
			messege = this.victory;

		}else{
			if(this.meme){
				var pepe = this.game.add.sprite(0,300,"pepe");
			}
		}
		
		var style = { font: "100px Arial", fill: "#000000", align: "center"};
		this.text = this.game.add.text(600, 350, messege,style);
		this.text.anchor.set(0.5);
		this.leaveGameButton = this.game.add.button(1100,600, 'LeaveButton', this.leaveGameAction, null, // TEXTURES
			1, 2); // leave game button 2, 1
	},
	leaveGameAction: function() {
		socket.emit("leave pending game");
		socket.removeAllListeners();
		this.game.state.start("Lobby", true, false); //4th parameter rtbs
	},
}

