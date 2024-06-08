let enemies;
let fireRate = 150;
let lastShotTime = 0;
let playerVelocity = 140;
class BossScene extends Phaser.Scene {
    constructor() {
        super("BossScene");
    }

    preload(){
        this.load.setPath("./assets/");
    }

    create(){
        this.player = this.physics.add.sprite(320,730, "player");
        this.playerHP = 5;
        this.player.setCollideWorldBounds(true);
        
        this.bullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        
        enemies = this.physics.add.group({collideWorldBounds: false});
        
        this.W_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.A_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.Space_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);

        if(this.W_Key.isDown){
            this.player.setVelocityY(-playerVelocity);
        }
        if(this.A_Key.isDown){
            this.player.setVelocityX(-playerVelocity);
        }
        if(this.S_Key.isDown){
            this.player.setVelocityY(playerVelocity);
        }
        if(this.D_Key.isDown){
            this.player.setVelocityX(playerVelocity);
        }
        if(Phaser.Input.Keyboard.JustDown(this.Space_Key)){
            this.shootBullet();
        }

        this.physics.overlap(this.bullets, enemies, this.bulletHitEnemy, null, this);
        this.physics.overlap(this.enemyBullets, this.player, this.bulletHitPlayer, null, this);
        this.physics.overlap(this.player, enemies, this.bulletHitPlayer, null, this);

        if(this.playerHP <= 0){
            this.updateScore();
            this.scene.start('gameOver');
        }
    }
}