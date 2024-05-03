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
        text.setOrigin(0.5, 0.5).setY(-100)
        if (text.displayWidth > this.scene.scale.gameSize.width)
            text.setScale((this.scene.scale.gameSize.width - 20) / text.displayWidth)

        const restartCallback = () => { 
            ;(this.scene as GameScene).restart() 
            ;(this.scene as GameScene).confirmSfx?.play()
        }
        const button = this.scene.add.rectangle(0, 0, 180, 40, 0x00ff00)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, restartCallback)
            .setY(100)

        const restart = this.scene.add.text(button.x, button.y, 'Restart', theme.baseText)
            .setOrigin(0.5, 0.5)
            .setFontSize(20)
            .setColor('#000000')
            .setStroke('#00', 0)
            .setInteractive()
        restart.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            restart.setColor('#fff')
            ;(this.scene as GameScene).hoverSfx?.play()
        })
        restart.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            restart.setColor('#000')
        })
        restart.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, restartCallback)

        this.add([text, button, restart])
    }
}