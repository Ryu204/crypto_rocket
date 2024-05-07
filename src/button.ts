import Phaser from 'phaser'
import theme from './theme'
import { GameScene } from './gameScene'
import assets from './asset/import'

export default class Button extends Phaser.GameObjects.Rectangle {
    private hover: Phaser.Sound.BaseSound
    private confirm: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene, label: string, callback: Function | undefined = undefined, x: number = 0, y: number = 0, width: number = 180, height: number = 40) {
        super(scene, x, y, width, height, 0x00ff00)
        this.hover = scene.sound.add(assets.hover.id)
        this.confirm = scene.sound.add(assets.confirm.id)

        const realCallback = () => {
            this.confirm.play()
            if (callback)
                callback()
        }
        this.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, realCallback)

        const text = this.scene.add.text(x, y, label, theme.baseText)
            .setOrigin(0.5, 0.5)
            .setFontSize(20)
            .setColor('#000000')
            .setStroke('#00', 0)
            .setInteractive()
            .setDepth(1)
        text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            text.setColor('#fff')
            this.hover.play()
        })
        text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            text.setColor('#000')
        })
        text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, realCallback)
    }
}