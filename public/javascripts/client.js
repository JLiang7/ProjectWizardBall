var WizardBall = WizardBall || {};

WizardBall.game = new Phaser.Game(1024, 576, Phaser.CANVAS, "Wizard Ball");
//game.state.add("Preload", preload);
WizardBall.game.state.add("Boot", WizardBall.boot);
WizardBall.game.state.add("Preload", WizardBall.preload);
WizardBall.game.state.add("Play", WizardBall.play);
WizardBall.game.state.start("Boot");