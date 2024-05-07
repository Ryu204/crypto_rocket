import Phaser from 'phaser'
import theme from './theme'
import { GameScene } from './gameScene'
import Button from './button'
import provider from './api/provider'
import Textfield from './textfield'
import { BaseScene } from './baseScene'

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
        }
        const restart = this.scene.add.existing(new Button(this.scene, 'Restart', restartCallback, 0, 100))

        const highscores = () => {
            this.scene.scene.start('highscores')
        }
        const hs = this.scene.add.existing(new Button(this.scene, 'High scores', highscores, 0, 50))

        const savescore = this.scene.add.existing(new Button(this.scene, 'Save score', async () => {
            this.saveScore()
        }, 0, 0))

        this.add([text, restart, hs, savescore])
    }

    private async saveScore() {
        const saveWithName = (name: string) => {
            provider.saveNewEntry(name, 1)
        }
        const textfield = this.scene.add.existing(new Textfield(this.scene as BaseScene, (text: string) => {
            saveWithName(text)
        }, 'Your name'))
    }
}