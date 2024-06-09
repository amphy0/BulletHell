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
        
        this.load.image('player', 'KingSlime_Idle2.png');
    }

    create(){
        this.anims.create({
            key: 'boss',
            frames: [
                { key: 'boss1' },
                { key: 'boss2' },
                { key: 'boss3' },
                { key: 'boss4' }
            ],
            frameRate: 6,
            repeat: -1
        });
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

        this.spawnBoss();
    }
    spawnBoss(){
        const bounds = this.physics.world.bounds;
        const boss = this.physics.add.sprite(bounds.x+350, bounds.y+150, 'boss1').play('boss');
        boss.setScale(5);
        boss.hp = 1000;

        enemies.add(boss);
        let x = 0;
        const bulletTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                x += 5;
                this.bulletPattern1(boss, 10);
            },
            loop: true
        });
    }
    bossShootBullet(boss){
        this.bulletPattern1(boss);
    }
    bulletPattern1(boss,x){
        for(let i = 0+x; i < 45+x; i++) {
            const bullet = this.enemyBullets.create(boss.x, boss.y, 'enemyBullet');
            const v = 150;
            bullet.setVelocityX(v*Math.cos(i));
            bullet.setVelocityY(v*Math.sin(i));
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', ()=>{
                bullet.destroy();
            });

        }
        
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