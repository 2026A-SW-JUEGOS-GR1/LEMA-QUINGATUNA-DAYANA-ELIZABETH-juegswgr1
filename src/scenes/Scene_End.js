class Scene_End extends Phaser.Scene {
  constructor() {
    super("Scene_End");
  }

  init(data) {
    this.victory = data.victory;
    this.score = data.score;
  }

  create() {
    this.add.rectangle(450, 300, 900, 600, 0x2b1538);

    for (let i = 0; i < 50; i++) {
      this.add.circle(
        Phaser.Math.Between(20, 880),
        Phaser.Math.Between(20, 580),
        Phaser.Math.Between(3, 8),
        0xff9ad5
      ).setAlpha(0.35);
    }

    const titulo = this.victory ? "¡VICTORIA!" : "MISIÓN FALLIDA";
    const color = this.victory ? "#ffd6f2" : "#ff6fae";

    const mensaje = this.victory
      ? "Lumi recolectó todos los cristales y encontró el camino a casa."
      : "Los bichitos sombra atraparon a Lumi. Inténtalo otra vez.";

    this.add.text(450, 120, titulo, {
      fontSize: "54px",
      color: color,
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(450, 235, mensaje, {
      fontSize: "25px",
      color: "#ffffff",
      align: "center",
      lineSpacing: 8
    }).setOrigin(0.5);

    this.add.text(450, 325, "Puntaje final: " + this.score, {
      fontSize: "32px",
      color: "#ffe6f7"
    }).setOrigin(0.5);

    const retry = this.add.text(450, 440, "JUGAR DE NUEVO", {
      fontSize: "28px",
      color: "#ffffff",
      backgroundColor: "#e754a6",
      padding: { x: 26, y: 12 }
    }).setOrigin(0.5).setInteractive();

    retry.on("pointerdown", () => {
      this.scene.start("Scene_Game");
    });

    const menu = this.add.text(450, 515, "VOLVER AL MENÚ", {
      fontSize: "22px",
      color: "#ffffff",
      backgroundColor: "#8e3a7a",
      padding: { x: 22, y: 10 }
    }).setOrigin(0.5).setInteractive();

    menu.on("pointerdown", () => {
      this.scene.start("Scene_Menu");
    });
  }
}