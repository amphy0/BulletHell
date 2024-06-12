class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    
    create(){
        const score = this.registry.get('Score');

        this.add.bitmapText(350, 180, 'kenneyFont', 'Game Over', 64).setOrigin(0.5);
        this.add.bitmapText(350,325,'kenneyFont', 'Score: ' + score, 32).setOrigin(0.5);
        this.add.bitmapText(350,450,'kenneyFont', 'Press SPACE to try again', 32).setOrigin(0.5);
        this.input.keyboard.on('keydown-SPACE', ()=> {
            this.scene.start('BossScene');
        });
    }
}