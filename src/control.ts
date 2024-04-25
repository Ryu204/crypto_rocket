import Phaser from 'phaser'

export type InGame = {
    holding: boolean
}

export default class Control {
    public inGame : InGame
    mScene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.mScene = scene
        this.inGame = {
            holding: false
        }
    }

    update() {
        this.inGame.holding = 
            this.mScene.input.pointer1.isDown 
            || this.mScene.input.mousePointer.isDown
    }
}