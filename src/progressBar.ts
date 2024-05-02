import Phaser from 'phaser'

export interface options {
    width?: number,
    height?: number,
    background?: number,
    foreground?: number,
    x?: number,
    y?: number,
    margin?: number,
}

export default class ProgressBar extends Phaser.GameObjects.Rectangle {
    bar: Phaser.GameObjects.Rectangle
    margin: number
    
    constructor(scene: Phaser.Scene, {
        width = 100,
        height = 30,
        background = 0x000000,
        foreground = 0xffffff,
        x = 0,
        y = 0,
        margin = 2,
    }: options) {
        super(scene, x, y, width, height, background)
        this.setOrigin(0, 0).setDepth(1)
        this.bar = scene.add.rectangle(
            x + margin, 
            y + margin, 
            width - 2 * margin, 
            height - 2 * margin, 
            foreground
        )
        this.bar.setOrigin(0, 0).setDepth(this.depth + 1)
        this.margin = margin
    }

    setProgress(percent: number) {
        percent = Phaser.Math.Clamp(percent, 0, 1)
        this.bar.setSize((this.width - 2 * this.margin) * percent, this.bar.height)
    }
}