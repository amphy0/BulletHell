let enemies;
let fireRate = 150;
let lastShotTime = 0;
let playerVelocity = 140;
let bulletsPerSecond = 1;
let bulletlevel = 1;
class BossScene extends Phaser.Scene {
    constructor() {
        super("BossScene");
    }

    preload(){
        this.load.setPath("./assets/");
        
        this.load.image('player', 'ship.png');


        this.load.image("enemyBullet", "bullet.png");

        this.load.image("playerBullet", "playerbullet.png");

        this.load.image('heart', 'heart.png');

        this.load.image("buff", "buff.png");
        this.load.image("buff2", "buff2.png");

        this.load.image("background", "b1.png");

        this.load.audio('bgm', 'bgm01.ogg');

        this.load.audio('biu', 'shootingsound.ogg');

        // For animation
        this.load.image("explosion00", "explosion00.png");
        this.load.image("explosion01", "explosion01.png");
        this.load.image("explosion02", "explosion02.png");
        this.load.image("explosion03", "explosion03.png");
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

        this.anims.create({
            key: 'explosion',
            frames: [
                { key: 'explosion00' },
                { key: 'explosion01' },
                { key: 'explosion02' },
                { key: 'explosion03' }
            ],
            frameRate: 10,
            repeat: 0
        });
        this.player = this.physics.add.sprite(320,730, "player").setScale(0.3);
        this.player.flipY = true;
        this.playerHP = 30;
        this.player.setCollideWorldBounds(true);
        this.playerDamage = 10;
        this.score = 0;
        this.scoreText = this.add.text(80, 20, `score: ${this.score}`, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);


        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background');
        this.background.setOrigin(0, 0);
        this.background.displayWidth = game.config.width;
        this.background.displayHeight = game.config.height;
        this.background.setDepth(-1);

        

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

        this.time.addEvent({
            delay: 2500, // buff / 5 sec
            callback: this.dropBuffRandom,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 7500, // buff2 / 15 sec
            callback: this.dropBuff2Random,
            callbackScope: this,
            loop: true
        });

        this.bgm = this.sound.add('bgm', { loop: true });
        this.bgm.play();

        this.heart = this.add.image(640, 20, 'heart').setScale(1.8);
        this.hpText = this.add.text(650, 10, ` ${this.playerHP}`, {
        fontSize: '20px',
        fill: '#ffffff'
        });
    }
    spawnBoss(){
        const bounds = this.physics.world.bounds;
        const boss = this.physics.add.sprite(bounds.x+350, bounds.y+150, 'boss1').play('boss');
        boss.setScale(5);
        boss.hp = 10000;

        //boss's HP
        boss.hpText = this.add.text(boss.x, boss.y - 60, `HP: ${boss.hp}`, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        enemies.add(boss);
        let dir = true;
        let bulletCount = 0;
        let x = 0;
        const bulletTimer = this.time.addEvent({
            delay: 20,
            callback: () => {
                if(boss.hp > 9000){
                    if (bulletCount < 500) {
                        this.bulletPattern1(boss, x);
                        x += 60;
                        bulletCount++;
                    } else {
                        bulletCount = 0;
                        bulletTimer.paused = true;
                        this.time.delayedCall(800, () => {
                            bulletTimer.paused = false;
                        });
                    }
                }
                else if(boss.hp > 8000){
                    if (bulletCount < 500) {
                        this.bulletPattern2(boss, x);
                        x += 110;
                        bulletCount++;
                    } else {
                        bulletCount = 0;
                        bulletTimer.paused = true;
                        this.time.delayedCall(800, () => {
                            bulletTimer.paused = false;
                        });
                    }
                    this.bulletPattern2(boss, x);
                    x += 110;
                }
                else if(boss.hp > 6000){
                    this.bulletPattern3(boss, x);
                    this.bulletPattern4(boss, x);
                    x += 92;
                }
                else if(boss.hp > 4000){
                    if (bulletCount < 90) {
                        this.bulletPattern5(boss, x);
                        x += 25;
                        bulletCount++;
                    } else {
                        bulletCount = 0;
                        bulletTimer.paused = true;
                        this.time.delayedCall(1000, () => {
                            bulletTimer.paused = false;
                        });
                    }
                }
                else if(boss.hp > 1){
                    this.bulletPattern5(boss, x);
                    x += 180
                }
                else if(boss.hp <= 0){
                    this.registry.set('Score', this.score);
                    this.bgm.stop();
                    this.scene.start('gameOver');
                    
                }
            },
            loop: true
        });
    }
    bulletPattern1(boss,x){
        const bullet = this.enemyBullets.create(boss.x, boss.y, 'enemyBullet').setScale(0.4);
        const v = 100;
        bullet.setVelocityX(v*Math.cos((x/360*Math.PI)+x));
        bullet.setVelocityY(v*Math.sin((x/360*Math.PI)+x));
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', ()=>{
            bullet.destroy();
        });
    }
    bulletPattern2(boss,x){
        const bullet = this.enemyBullets.create(boss.x, boss.y, 'enemyBullet').setScale(0.4);
        const v = 150;
        bullet.setVelocityX(v*Math.cos((x/360*Math.PI)));
        bullet.setVelocityY(v*Math.sin((x/360*Math.PI)));
        this.time.addEvent({
            delay: 3500,
            callback: ()=>{
                
                bullet.setVelocityX(v/4*Math.cos((x/360*Math.PI)));
                bullet.setVelocityY(v/4*Math.sin((x/360*Math.PI)));
            }
        })
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', ()=>{
            bullet.destroy();
        });
    }
    bulletPattern3(boss,x){
        const bullet = this.enemyBullets.create(boss.x+100, boss.y, 'enemyBullet').setScale(0.4);
        const v = 80;
        bullet.setVelocityX(v*Math.cos((-x/360*Math.PI)));
        bullet.setVelocityY(v*Math.sin((-x/360*Math.PI)));
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', ()=>{
            bullet.destroy();
        });
    }
    bulletPattern4(boss,x){
        const bullet = this.enemyBullets.create(boss.x-100, boss.y, 'enemyBullet').setScale(0.4);
        const v = 80;
        bullet.setVelocityX(v*Math.cos((x/360*Math.PI)));
        bullet.setVelocityY(v*Math.sin((x/360*Math.PI)));
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', ()=>{
            bullet.destroy();
        });
    }
    bulletPattern5(boss,x){
        const bullet = this.enemyBullets.create(boss.x, boss.y, 'enemyBullet').setScale(0.4);
        let v = 300;
        bullet.setVelocityX(v*Math.cos((Math.PI)+0.35*x));
        bullet.setVelocityY(v*Math.sin((Math.PI)+0.35*x));
        this.time.addEvent({
            delay: 2000,
            callback: ()=>{
                v *= -1;
                bullet.setVelocityX(v*Math.cos((Math.PI)+0.35*x));
                bullet.setVelocityY(v*Math.sin((Math.PI)+0.35*x));
            }
        })
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', ()=>{
            bullet.destroy();
        });
    }
    shootBullet() {
        const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'playerBullet').setScale(0.5);
        bullet.setVelocityY(-300);
        bullet.body.onWorldBounds = true;
        bullet.body.world.on('worldbounds', () => {
            bullet.destroy();
        });
        this.sound.play('biu');
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
    dropBuffRandom() {
        const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
        const y = Phaser.Math.Between(0, this.physics.world.bounds.height / 2); 
        const buff = this.buffs.create(x, y, 'buff').setScale(0.3);
        buff.setVelocityY(100);
    }
    dropBuff2Random() {
        const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
        const y = Phaser.Math.Between(0, this.physics.world.bounds.height / 2); 
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

        //this.time.removeAllEvents();
        this.startPlayerShooting();
    }
    

    //damage
    bulletHitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.hp -= this.playerDamage;
        this.score += this.playerDamage * 10;
        this.scoreText.setText(`score: ${this.score}`);
        enemy.hpText.setText(`HP: ${enemy.hp}`);

        const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion00').setScale(0.2);
        explosion.play('explosion');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });

        if (enemy.hp <= 0) {
            enemy.destroy();
            enemy.hpText.destroy();
        }
    }

    bulletHitPlayer(player, bullet) {
        bullet.destroy();
        this.playerHP -= 1; 
        this.hpText.setText(` ${this.playerHP}`);
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
            this.registry.set('Score', this.score);
            this.bgm.stop();
            this.scene.start('gameOver');
        }
        
    }
}