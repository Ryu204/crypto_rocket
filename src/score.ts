import Phaser from 'phaser'
import theme from './theme'

export default class Score extends Phaser.GameObjects.Text {
    mScore: number

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, '0', theme.scoreText)
        this.mScore = 0
        this.depth = 1
        this.setOrigin(0.5, 0.5)
        this.y = scene.cameras.main.scrollY + 60
    }

    get score() {
        return this.mScore
    }

    increase() {
        this.mScore ++
        this.setText(this.mScore.toString())
    }
}