var WizardBall = WizardBall || {};

 WizardBall.lobby = function() {}; 
 
 
 //var TextConfigurer = require("./util/text_configurer"); 
 

 var initialSlotYOffset = 130; 
 var slotXOffset = 40; 
 var lobbySlotDistance = 100; 
 
 
 var textXOffset = 260; 
 var textYOffset = 25; 
 
 
 var headerYOffset = 70; 
 
 
 //module.exports = Lobby; 
 
 
 WizardBall.lobby.prototype = { 
 	init: function(rbts) { 
// 		repeatingBombTilesprite = rbts; 
 	}, 
 
 
 	create: function() { 
 		this.game.stage.backgroundColor = '#DDDDDD';
 		this.stateSettings = { 
 			empty: { 
 				outFrame: 2, 
 				overFrame: 1, 
 				text: "Host Game ",
 				callback: this.hostGameAction 
 			}, 
 			joinable: { 
 				outFrame: 2, 
 				overFrame: 1, 
 				text: "Join Game ", 
 				callback: this.joinGameAction 
 			}, 
 			prejoinable: { 
 				outFrame: 2, 
 				overFrame: 1, 
 				text: "Game is being set up... ", 
 				callback: null 
 			}, 
 			inprogress: { 
 				outFrame: 2, 
 				overFrame: 1, 
 				text: "Game in Progress ", 
 				callback: null 
 			}, 
 			full: { 
 				outFrame: 2, 
 				overFrame: 1, 
 				text: "Game Full ", 
 				callback: null 
 			} 
 		}; 
 
 
// 		repeatingBombTilesprite.doNotDestroy = true; 
 
 
// 		this.backdrop = game.add.image(12.5, 12.5, TEXTURES, "lobby/lobby_backdrop.png"); 
 		this.header = this.game.add.text(this.game.camera.width / 2, headerYOffset, "Lobby"); 
 		this.header.anchor.setTo(.5, .5); 
 //		TextConfigurer.configureText(this.header, "white", 32); 
 
 
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
 
 
 			(function(n, fn) { 
 				if(fn != null) { 
 					callback = function() { 
 						fn(n); 
 					} 
 				} 
 			})(i, settings.callback); 
 
 
 			var slotYOffset = initialSlotYOffset + i * lobbySlotDistance; 
 			this.slots[i] = this.game.add.button(slotXOffset, slotYOffset, "buttonTextures", callback, null, settings.overFrame, settings.outFrame); 
// 			this.slots[i].setDownSound(buttonClickSound); 
 			 
 			var text = this.game.add.text(slotXOffset + textXOffset, slotYOffset + textYOffset, settings.text); 
 	//		TextConfigurer.configureText(text, "white", 18); 
 			text.anchor.setTo(.5, .5); 
 
 
 			this.labels[i] = text; 
 		} 
 	}, 
 
 
 	hostGameAction: function(gameID) { 
 		socket.emit("host game", {gameID: gameID}); 
 		socket.removeAllListeners(); 
 	//	this.game.state.start("StageSelect", true, false, gameID); //
 	}, 
 
 
 	joinGameAction: function(gameID) { 
 		socket.removeAllListeners(); 
 		this.game.state.start("PendingGame", true, false, null, gameID); 
 	}, 
 
 
 	updateSlot: function(updateInfo) { 
 		var settings = this.stateSettings[updateInfo.newState]; 
 		var ID = updateInfo.gameID; 
 		var button = this.slots[ID]; 
 
 
 		this.labels[id].setText(settings.text); 
 		button.setFrames(settings.overFrame, settings.outFrame); 
 
 		button.onInputUp.removeAll(); 
 		button.onInputUp.add(function() { return settings.callback(ID)}, this); 
 	} 
}; 
