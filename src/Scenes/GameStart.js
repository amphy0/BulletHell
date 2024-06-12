class GameStart extends Phaser.Scene{
    constructor(){
        super("gameStart");
    }
    preload(){
        this.load.setPath("./assets/");
        this.load.bitmapFont("kenneyFont", "kenneyFont_0.png", "kenneyFont.fnt");
        this.load.image('wKey', 'wKey.png');
        this.load.image('aKey', 'aKey.png');
        this.load.image('sKey', 'sKey.png');
        this.load.image('dKey', 'dKey.png');
        this.load.image('space1', 'space1.png');
        this.load.image('space2', 'space2.png');
        this.load.image('space3', 'space3.png');
        this.load.image('boss1', 'KingSlime_Idle1.png');
        this.load.image('boss2', 'KingSlime_Idle2.png');
        this.load.image('boss3', 'KingSlime_Idle3.png');
        this.load.image('boss4', 'KingSlime_Idle4.png');
    
        
    }
    create(){
        this.add.image(150,250,'wKey').setScale(3);
        this.add.image(100,300,'aKey').setScale(3);
        this.add.image(150,300,'sKey').setScale(3);
        this.add.image(200,300,'dKey').setScale(3);
        this.add.image(110,450,'space1').setScale(3);
        this.add.image(150,450,'space2').setScale(3);
        this.add.image(190,450,'space3').setScale(3);
        this.add.image(430,300,'boss1').setScale(1.5);
        
        this.add.bitmapText(150,200,"kenneyFont", "Controls", 32).setOrigin(0.5);
        this.add.bitmapText(150,350,"kenneyFont", "to move", 32).setOrigin(0.5);
        this.add.bitmapText(150,500,"kenneyFont", "to shoot", 32).setOrigin(0.5);
        this.add.bitmapText(480,200,"kenneyFont", "Finish the Boss", 32).setOrigin(0.5);
        this.add.bitmapText(320,650,"kenneyFont", "Press SPACE to start", 32).setOrigin(0.5);
        this.input.keyboard.on('keydown-SPACE', ()=> {
            this.scene.start('BossScene');
        });
    }
}