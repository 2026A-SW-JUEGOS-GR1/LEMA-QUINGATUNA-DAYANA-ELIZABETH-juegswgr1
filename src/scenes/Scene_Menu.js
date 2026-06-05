class Scene_Menu extends Phaser.Scene {
  constructor() {
    super("Scene_Menu");
  }

  create() {
    this.add.rectangle(450, 300, 900, 600, 0x2b1538);

    for (let i = 0; i < 45; i++) {
      this.add.circle(
        Phaser.Math.Between(20, 880),
        Phaser.Math.Between(20, 580),
        Phaser.Math.Between(3, 8),
        0xff9ad5
      ).setAlpha(0.35);
    }

    this.add.text(450, 80, "LUMINA PAWS", {
      fontSize: "58px",
      color: "#ffd6f2",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(450, 145, "Aventura Top-Down", {
      fontSize: "24px",
      color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(450, 255,
      "Narrativa:\n" +
      "Lumi es una perrita mágica que se perdió en un jardín encantado.\n" +
      "Para volver a casa debe recolectar 10 cristales de luz.\n" +
      "Pero debe evitar a los bichitos sombra que protegen el lugar.",
      {
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    this.add.text(450, 400,
      "Controles:\n" +
      "Flechas o WASD = moverse\n" +
      "Cristales = +10 puntos\n" +
      "Bichitos sombra = pierdes vida",
      {
        fontSize: "20px",
        color: "#ffe6f7",
        align: "center",
        lineSpacing: 8
      }
    ).setOrigin(0.5);

    const boton = this.add.text(450, 515, "INICIAR AVENTURA", {
      fontSize: "28px",
      color: "#ffffff",
      backgroundColor: "#e754a6",
      padding: { x: 28, y: 13 }
    }).setOrigin(0.5).setInteractive();

    boton.on("pointerover", () => {
      boton.setStyle({ backgroundColor: "#ff78c2" });
    });

    boton.on("pointerout", () => {
      boton.setStyle({ backgroundColor: "#e754a6" });
    });

    boton.on("pointerdown", () => {
      this.scene.start("Scene_Game");
    });
  }
}