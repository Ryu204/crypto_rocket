import Bird from './bird'
import ProgressBar from './progressBar'

export default class FuelBar extends Phaser.GameObjects.Container {
    private bar: ProgressBar
    private bird: Bird

    constructor(scene: Phaser.Scene, bird: Bird) {
        super(scene)
        this.bar = new ProgressBar(scene, {
            width: 200,
            x: -100,
            y: 200,
            margin: 4
        })
        this.scene.add.existing(this.bar)
        this.add(this.bar)
        this.bird = bird
    }

    preUpdate() {
        this.bar.setProgress(this.bird.fuel)
    }
}