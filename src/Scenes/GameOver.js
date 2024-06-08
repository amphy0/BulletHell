class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    create(){
        this.add.bitmapText(320, 180, 'kenneyFont', 'Game Over', 64).setOrigin(0.5);
        this.add.bitmapText(150,325,'kenneyFont', 'Score: ' + this.registry.get('score'), 32).setOrigin(0.5);
        this.add.bitmapText(450,325,'kenneyFont', 'High Score: ' + this.registry.get('highScore'), 32).setOrigin(0.5);
        this.add.bitmapText(320,450,'kenneyFont', 'Press SPACE to try again', 32).setOrigin(0.5);
        this.input.keyboard.on('keydown-SPACE', ()=> {
            this.scene.start('forestScene');
        });
    }
}