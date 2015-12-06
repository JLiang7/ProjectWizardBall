var WizardBall = WizardBall || {};

WizardBall.game = new Phaser.Game(1280 , 720, Phaser.CANVAS, "Wizard Ball");
//socket = io("https://secret-mountain-2394.herokuapp.com");
socket = io ("http://localhost:3000");
//game.state.add("Preload", preload);
WizardBall.game.state.add("Boot", WizardBall.boot);
WizardBall.game.state.add("Preload", WizardBall.preload);
WizardBall.game.state.add("PendingGame", WizardBall.pendinggame);
WizardBall.game.state.add("Lobby", WizardBall.lobby);
WizardBall.game.state.add("TitleScreen",WizardBall.titlescreen);
WizardBall.game.state.add("CharacterSelect", WizardBall.charSelect);
WizardBall.game.state.add("Setup", WizardBall.setup)
WizardBall.game.state.add("Play", WizardBall.play);
WizardBall.game.state.add("GameOver", WizardBall.gameover);
WizardBall.game.state.start("Boot");