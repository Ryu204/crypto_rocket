import Rocket from './rocket'
import ProgressBar from './progressBar'

export default class FuelBar extends Phaser.GameObjects.Container {
    private bar: ProgressBar
    private rocket: Rocket

    constructor(scene: Phaser.Scene, rocket: Rocket) {
        super(scene)
        const width = 0.8 * scene.scale.gameSize.width
        this.bar = new ProgressBar(scene, {
            width: width,
            x: -width / 2,
            y: 200,
            margin: 4
        })
        this.scene.add.existing(this.bar)
        this.add(this.bar)
        this.setDepth(2)
        this.rocket = rocket
    }

    preUpdate() {
        this.bar.setProgress(this.rocket.fuel)
        const percent = Phaser.Math.Clamp(this.rocket.fuel, 0.2, 0.8)
        const [r, g] = [ 255 - Math.floor(percent * 255), Math.floor(255 * percent)]
        this.bar.setColor(undefined, r * 256 * 256 + g * 256)
    }
}