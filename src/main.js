const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  backgroundColor: "#2b1538",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Scene_Menu, Scene_Game, Scene_End]
};

new Phaser.Game(config);