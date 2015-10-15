var WizardBall = WizardBall || {};

WizardBall.game = new Phaser.Game(1280 , 720, Phaser.CANVAS, "Wizard Ball");
//game.state.add("Preload", preload);
WizardBall.game.state.add("Boot", WizardBall.boot);
WizardBall.game.state.add("Preload", WizardBall.preload);
WizardBall.game.state.add("TitleScreen",WizardBall.titlescreen);
WizardBall.game.state.add("CharacterSelect", WizardBall.charSelect);
WizardBall.game.state.add("Play", WizardBall.play);
WizardBall.game.state.start("Boot");