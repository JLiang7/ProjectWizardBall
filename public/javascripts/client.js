var WizardBall = WizardBall || {};

WizardBall.game = new Phaser.Game(800, 600, Phaser.CANVAS, "Wizard Ball");
//game.state.add("Preload", preload);
WizardBall.game.state.add("Play", WizardBall.play);
WizardBall.game.state.start("Play");