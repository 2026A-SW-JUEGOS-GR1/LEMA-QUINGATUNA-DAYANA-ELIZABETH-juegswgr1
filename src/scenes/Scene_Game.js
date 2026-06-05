class Scene_Game extends Phaser.Scene {
  constructor() {
    super("Scene_Game");
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 70;
    this.crystalsLeft = 10;
    this.invulnerable = false;
    this.gameOver = false;

    this.createMap();
    this.createDog();
    this.createCrystals();
    this.createEnemies();
    this.createHUD();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D");

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    this.physics.add.overlap(this.player, this.crystals, this.collectCrystal, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.gameOver) return;

        this.timeLeft--;
        this.updateHUD();

        if (this.timeLeft <= 0) {
          this.endGame(false);
        }
      }
    });
  }

  playTone(freq, duration) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  createMap() {
    this.add.rectangle(450, 300, 900, 600, 0x3b1f4a);

    for (let x = 0; x < 900; x += 45) {
      for (let y = 0; y < 600; y += 45) {
        const color = (x / 45 + y / 45) % 2 === 0 ? 0x5c3472 : 0x6d3c86;

        this.add.rectangle(x + 22, y + 22, 42, 42, color)
          .setStrokeStyle(1, 0xffb3e6)
          .setAlpha(0.9);
      }
    }

    this.walls = this.physics.add.staticGroup();

    const wallsData = [
      [450, 20, 900, 40],
      [450, 580, 900, 40],
      [20, 300, 40, 600],
      [880, 300, 40, 600],
      [220, 140, 240, 35],
      [680, 140, 240, 35],
      [450, 290, 310, 35],
      [180, 430, 240, 35],
      [720, 430, 240, 35],
      [450, 500, 35, 110],
      [450, 100, 35, 110]
    ];

    wallsData.forEach(w => {
      const wall = this.add.rectangle(w[0], w[1], w[2], w[3], 0xff8fd8);
      wall.setStrokeStyle(3, 0xffffff);
      wall.setAlpha(0.75);

      this.physics.add.existing(wall, true);
      this.walls.add(wall);
    });

    for (let i = 0; i < 35; i++) {
      this.add.circle(
        Phaser.Math.Between(60, 840),
        Phaser.Math.Between(60, 540),
        Phaser.Math.Between(5, 12),
        0xffc2ec
      ).setAlpha(0.35);
    }

    for (let i = 0; i < 12; i++) {
      this.add.text(
        Phaser.Math.Between(50, 820),
        Phaser.Math.Between(60, 520),
        "✿",
        {
          fontSize: "24px",
          color: "#ffd6f2"
        }
      ).setAlpha(0.7);
    }
  }

  createDog() {
    const dog = this.add.graphics();

    dog.fillStyle(0xf7c98b, 1);
    dog.fillRoundedRect(-18, -10, 36, 24, 8);

    dog.fillStyle(0xffe1b3, 1);
    dog.fillCircle(0, -18, 16);

    dog.fillStyle(0x8b5a2b, 1);
    dog.fillEllipse(-12, -20, 10, 18);
    dog.fillEllipse(12, -20, 10, 18);

    dog.fillStyle(0x000000, 1);
    dog.fillCircle(-5, -20, 2);
    dog.fillCircle(5, -20, 2);

    dog.fillStyle(0x5c2e12, 1);
    dog.fillCircle(0, -15, 3);

    dog.lineStyle(2, 0xff9ad5, 1);
    dog.strokeCircle(0, -5, 14);

    dog.fillStyle(0xff9ad5, 1);
    dog.fillCircle(0, -2, 4);

    dog.fillStyle(0xf7c98b, 1);
    dog.fillRect(-14, 10, 6, 12);
    dog.fillRect(8, 10, 6, 12);

    dog.lineStyle(4, 0xf7c98b, 1);
    dog.beginPath();
    dog.moveTo(18, -3);
    dog.lineTo(28, -12);
    dog.strokePath();

    dog.generateTexture("dogPlayer", 64, 64);
    dog.destroy();

    this.player = this.physics.add.sprite(90, 90, "dogPlayer");
    this.player.setScale(0.9);
    this.player.setCollideWorldBounds(true);
  }

  createCrystals() {
    const crystalGraphic = this.add.graphics();

    crystalGraphic.fillStyle(0xff7bd5, 1);
    crystalGraphic.fillTriangle(16, 0, 32, 18, 16, 40);
    crystalGraphic.fillTriangle(16, 0, 0, 18, 16, 40);

    crystalGraphic.lineStyle(2, 0xffffff, 1);
    crystalGraphic.strokeTriangle(16, 0, 32, 18, 16, 40);
    crystalGraphic.strokeTriangle(16, 0, 0, 18, 16, 40);

    crystalGraphic.generateTexture("pinkCrystal", 32, 42);
    crystalGraphic.destroy();

    this.crystals = this.physics.add.group();

    const positions = [
      [120, 250],
      [270, 80],
      [630, 80],
      [780, 250],
      [450, 220],
      [310, 370],
      [590, 370],
      [120, 520],
      [780, 520],
      [450, 555]
    ];

    positions.forEach(pos => {
      const crystal = this.crystals.create(pos[0], pos[1], "pinkCrystal");
      crystal.setScale(0.8);
      crystal.body.setAllowGravity(false);

      this.tweens.add({
        targets: crystal,
        y: crystal.y - 8,
        duration: 700,
        yoyo: true,
        repeat: -1
      });
    });
  }

  createEnemies() {
    const enemyGraphic = this.add.graphics();

    enemyGraphic.fillStyle(0x2b1538, 1);
    enemyGraphic.fillCircle(24, 24, 18);

    enemyGraphic.fillStyle(0x000000, 1);
    enemyGraphic.fillCircle(18, 20, 3);
    enemyGraphic.fillCircle(30, 20, 3);

    enemyGraphic.lineStyle(3, 0xff4fa3, 1);
    enemyGraphic.strokeCircle(24, 24, 18);

    enemyGraphic.fillStyle(0xff4fa3, 1);
    enemyGraphic.fillTriangle(12, 10, 6, 2, 17, 6);
    enemyGraphic.fillTriangle(36, 10, 42, 2, 31, 6);

    enemyGraphic.generateTexture("shadowBug", 48, 48);
    enemyGraphic.destroy();

    this.enemies = this.physics.add.group();

    const positions = [
      [800, 90],
      [90, 500],
      [800, 500],
      [450, 360]
    ];

    positions.forEach(pos => {
      const enemy = this.enemies.create(pos[0], pos[1], "shadowBug");
      enemy.setScale(0.85);
      enemy.setCollideWorldBounds(true);
      enemy.setBounce(1);

      enemy.setVelocity(
        Phaser.Math.Between(-145, 145),
        Phaser.Math.Between(-145, 145)
      );

      this.tweens.add({
        targets: enemy,
        angle: 360,
        duration: 1800,
        repeat: -1
      });
    });
  }

  createHUD() {
    this.hud = this.add.text(15, 15, "", {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#b84c9c",
      padding: { x: 12, y: 7 }
    });

    this.updateHUD();
  }

  updateHUD() {
    this.hud.setText(
      "Puntos: " + this.score +
      " | Vidas: " + this.lives +
      " | Tiempo: " + this.timeLeft +
      " | Cristales: " + this.crystalsLeft
    );
  }

  update() {
    if (this.gameOver) return;

    const speed = 195;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) vx = -speed;
    if (this.cursors.right.isDown || this.keys.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.keys.W.isDown) vy = -speed;
    if (this.cursors.down.isDown || this.keys.S.isDown) vy = speed;

    this.player.body.setVelocity(vx, vy);

    if (vx !== 0 && vy !== 0) {
      this.player.body.velocity.normalize().scale(speed);
    }

    if (vx < 0) this.player.setFlipX(true);
    if (vx > 0) this.player.setFlipX(false);

    if (vx !== 0 || vy !== 0) {
      this.player.angle = Math.sin(this.time.now / 80) * 4;
    } else {
      this.player.angle = 0;
    }
  }

  collectCrystal(player, crystal) {
    this.playTone(850, 0.15);

    crystal.destroy();
    this.score += 10;
    this.crystalsLeft--;

    this.updateHUD();

    this.tweens.add({
      targets: this.player,
      scale: 1.05,
      duration: 120,
      yoyo: true
    });

    if (this.crystalsLeft <= 0) {
      this.endGame(true);
    }
  }

  hitEnemy(player, enemy) {
    if (this.invulnerable || this.gameOver) return;

    this.playTone(180, 0.25);

    this.invulnerable = true;
    this.lives--;
    this.updateHUD();

    player.setTint(0xff4fa3);

    const knockX = player.x < enemy.x ? -260 : 260;
    const knockY = player.y < enemy.y ? -260 : 260;

    player.setVelocity(knockX, knockY);

    this.time.delayedCall(1000, () => {
      player.clearTint();
      this.invulnerable = false;
    });

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  endGame(victory) {
    if (this.gameOver) return;

    this.gameOver = true;

    if (this.timer) {
      this.timer.remove(false);
    }

    this.playTone(victory ? 1000 : 120, 0.4);

    this.time.delayedCall(400, () => {
      this.scene.start("Scene_End", {
        victory: victory,
        score: this.score
      });
    });
  }
}