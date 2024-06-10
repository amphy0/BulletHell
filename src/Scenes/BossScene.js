let enemies;
let fireRate = 150;
let lastShotTime = 0;
let playerVelocity = 140;
let bulletsPerSecond = 1;
class BossScene extends Phaser.Scene {
    constructor() {
        super("BossScene");
    }

    preload(){
        this.load.setPath("./assets/");
        
        this.load.image('player', 'ship.png');


        this.load.image("enemyBullet", "bullet.png");

        this.load.image("playerBullet", "playerbullet.png");

        this.load.image("buff", "buff.png");
        this.load.image("buff2", "buff2.png");
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
        this.player = this.physics.add.sprite(320,730, "player").setScale(0.3);
        this.player.flipY = true;
        this.playerHP = 5;
        this.player.setCollideWorldBounds(true);
        this.playerDamage = 10;
        
        this.bullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.buffs = this.physics.add.group();
        this.buffs2 = this.physics.add.group();
        
        enemies = this.physics.add.group({collideWorldBounds: false});
        
        this.W_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.S_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.A_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.D_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.Space_Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.spawnBoss();
        this.startPlayerShooting();
    }
    spawnBoss(){
        const bounds = this.physics.world.bounds;
        const boss = this.physics.add.sprite(bounds.x+350, bounds.y+150, 'boss1').play('boss');
        boss.setScale(5);
        boss.hp = 1000;

        //boss's HP
        boss.hpText = this.add.text(boss.x, boss.y - 60, `HP: ${boss.hp}`, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        enemies.add(boss);
        let x = 0;
        let bulletCount = 0;
        const bulletTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (bulletCount < 5) {
                    this.bulletPattern1(boss, bulletCount * 5);
                    bulletCount++;
                } else {
                    bulletCount = 0;
                    bulletTimer.paused = true;
                    this.time.delayedCall(1000, () => {
                        bulletTimer.paused = false;
                    });
                }
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

    shootBullet() {
        const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'playerBullet').setScale(0.5);
        bullet.setVelocityY(-300);
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', () => {
            bullet.destroy();
        });
    }
    startPlayerShooting() {
        this.time.addEvent({
            delay: 1000 / bulletsPerSecond,   
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });
    }

    //buff
    dropBuff(enemy) {
        const x = enemy.x + Phaser.Math.Between(-150, 150);
        const y = enemy.y + Phaser.Math.Between(-50, 50);
        const buff = this.buffs.create(x, y, 'buff').setScale(0.3);
        buff.setVelocityY(100); 
    }
    dropBuff2(enemy) {
        const x = enemy.x + Phaser.Math.Between(-150, 150);
        const y = enemy.y + Phaser.Math.Between(-50, 50);
        const buff2 = this.buffs2.create(x, y, 'buff2').setScale(0.3);
        buff2.setVelocityY(100); 
    }

    collectBuff(player, buff) {
        buff.destroy();
        this.playerDamage += 1;  
    }
    collectBuff2(player, buff2) {
        buff2.destroy(); 
        bulletsPerSecond += 1; 

        this.time.removeAllEvents();
        this.startPlayerShooting();
    }
    

    //damage
    bulletHitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.hp -= this.playerDamage;
        enemy.hpText.setText(`HP: ${enemy.hp}`);
        this.dropBuff(enemy);
        this.dropBuff2(enemy);
        if (enemy.hp <= 0) {
            enemy.destroy();
            enemy.hpText.destroy();
        }
    }

    bulletHitPlayer(player, bullet) {
        bullet.destroy();
        this.playerHP -= 1; // Adjust damage as needed
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
        this.physics.overlap(this.player, this.buffs, this.collectBuff, null, this);
        this.physics.add.overlap(this.player, this.buffs2, this.collectBuff2, null, this);

        if(this.playerHP <= 0){
            this.updateScore();
            this.scene.start('gameOver');
        }
    }
}