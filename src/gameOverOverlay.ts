import Phaser from 'phaser'
import theme from './theme'
import { GameScene } from './gameScene'

export default class GameOverOverlay extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.build()
    }

    private build() {
        const text = this.scene.add.text(0, 0, 'Game over', theme.titleText)
        text.setOrigin(0.5, 0.5)

        const button = this.scene.add.rectangle(0, 0, 150, 60, 0x123456)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_UP, () => { 
                ;(this.scene as GameScene).restart() 
            })
            .setY(100)

        const restart = this.scene.add.text(button.x, button.y, 'Restart', theme.baseText)
            .setOrigin(0.5, 0.5)

        this.add([text, button, restart])
    }
}