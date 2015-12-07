var WizardBall = WizardBall || {};

 WizardBall.lobby = function() {}; 

 var initialSlotYOffset = 200; 
 var slotXOffset = 40; 
 var lobbySlotDistance = 100; 
 
 
 var textXOffset = 240; 
 var textYOffset = 50; 
 
 var headerXOffset = 1100; 
 var headerYOffset = 600; 
 

 
 
 WizardBall.lobby.prototype = { 
 	init: function(gameID) { 
 		
 	}, 
 
 
 	create: function() { 
 		background = this.game.add.sprite(0,0,'yellowBar');
 		bar = this.game.add.sprite(50,0,'lobbyBar');
 		triangle = this.game.add.sprite(0,350,'lobbyTriangle');
 		this.stateSettings = { 
 			empty: { 
 				outFrame: 0, 
 				overFrame: 1, 
 				text: "Host Game ",
 				callback: this.hostGameAction 
 			}, 
 			joinable: { 
 				outFrame: 0, 
 				overFrame: 1, 
 				text: "Join Game ", 
 				callback: this.joinGameAction 
 			}, 
 			prejoinable: { 
 				outFrame: 0, 
 				overFrame: 1, 
 				text: "Game is being set up... ", 
 				callback: null 
 			}, 
 			inprogress: { 
 				outFrame: 0, 
 				overFrame: 1, 
 				text: "Game in Progress ", 
 				callback: null 
 			}, 
 			full: { 
 				outFrame: 0, 
 				overFrame: 1, 
 				text: "Game Full ", 
 				callback: null 
 			} 
 		}; 
 
 
// 		this.backdrop = game.add.image(12.5, 12.5, TEXTURES, "lobby/lobby_backdrop.png"); 
		var style = { font: "50px Arial", fill: "#000000", align: "left"};
 		this.header = this.game.add.text(headerXOffset, headerYOffset, "Lobby",style); 
 		this.header.anchor.setTo(.5, .5);  
 
 		this.slots = []; 
 		this.labels = []; 
 
 		var gameData = [{state: "empty"}, {state: "empty"}, {state: "joinable"}, {state: "insession"}]; 
 
 
 		socket.emit("enter lobby"); 
 
 
 		if(!socket.hasListeners("add slots")) { 
 			socket.on("add slots", this.addSlots.bind(this)); 
 			socket.on("update slot", this.updateSlot.bind(this));
 		} 
 	}, 


 	update: function() { 
 	}, 
 

 	addSlots: function(gameData) { 
 		for(var i = 0; i < gameData.length; i++) { 
 			var callback = null; 
 			var state = gameData[i].state; 
 			var settings = this.stateSettings[state]; 
 			var slantAngle = -20;
 			var progression = 25;
 
 			(function(n, fn) { 
 				if(fn != null) { 
 					callback = function() { 
 						fn(n); 
 					} 
 				} 
 			})(i, settings.callback); 
 
 
 			var slotYOffset = initialSlotYOffset + i * lobbySlotDistance; 
 			this.slots[i] = this.game.add.button(slotXOffset + (i*progression), slotYOffset, "buttonTextures", callback, null, settings.overFrame, settings.outFrame); 
 			this.slots[i].angle = slantAngle;
 			 
 			var style = { font: "25px Arial", fill: "#000000", align: "left"}; 
 			var text = this.game.add.text(slotXOffset + textXOffset + (i*progression), slotYOffset - textYOffset, settings.text, style); 
 	//		TextConfigurer.configureText(text, "white", 18); 
 			text.anchor.setTo(.5, .5); 
 
 
 			this.labels[i] = text;
 			this.labels[i].angle = slantAngle;
 		} 
 	}, 
 
 
 	hostGameAction: function(gameID) { 
 		socket.emit("host game", {gameID: gameID}); 
 		socket.removeAllListeners(); 
 		WizardBall.game.state.start("Setup", true, false, gameID); 
 	}, 
 
 
 	joinGameAction: function(gameID) { 
 		socket.removeAllListeners(); 
 		WizardBall.game.state.start("PendingGame", true, false, null, gameID); 
 	}, 
 
 
 	updateSlot: function(updateInfo) {
 		
 		var settings = this.stateSettings[updateInfo.newState]; 
 		var id = updateInfo.gameID; 
 		var button = this.slots[id]; 
 
 
 		this.labels[id].setText(settings.text); 
 		button.setFrames(settings.overFrame, settings.outFrame); 
 
 		button.onInputUp.removeAll(); 
 		button.onInputUp.add(function() { return settings.callback(id)}, this); 
 	} 
}; 
