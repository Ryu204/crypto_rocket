import Phaser from 'phaser'
import assets from './asset/import'
import { GameScene } from './gameScene'

export default class FullscreenButton extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, fullscreen: boolean) {
        super(scene, 0, 0, fullscreen
            ? assets.fullscreen2.id
            : assets.fullscreen.id
        )
        this.setDisplaySize(20, 20)
            .setOrigin(0, 0)
            .setDepth(2)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, (ptr: any, x: any, y: any, ip: Phaser.Types.Input.EventData) => {
                ip.stopPropagation()
                this.scene.scale.toggleFullscreen()
            })
            .resetPosition()
    }

    private resetPosition() {
        this.setPosition(
            (this.scene as GameScene).leftLimit(-10),
            (this.scene as GameScene).topLimit(-10)
        )
        return this
    }
}