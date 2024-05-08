import Phaser from 'phaser'
import theme from './theme'
import { GameScene } from './gameScene'
import Button from './button'

export default class GameOverOverlay extends Phaser.GameObjects.Container {
    private mScore: number
    
    constructor(scene: Phaser.Scene, score: number) {
        super(scene)
        this.build()
        this.mScore = score
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
            this.scene.data.set('score', this.mScore)
            this.scene.scene.start('savescore')
        }, 0, 0))

        this.add([text, restart, hs, savescore])
    }
}