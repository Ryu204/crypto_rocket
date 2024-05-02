import Phaser from 'phaser'

export type InGame = {
    holding: boolean
    space: Phaser.Input.Keyboard.Key | undefined
    
    events: Phaser.Events.EventEmitter 
}

export enum Events {
    keyDown = 'key-down',
    keyUp = 'key-up'
}

export default class Control {
    public inGame : InGame
    mScene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.mScene = scene
        this.inGame = {
            holding: false,
            space: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            events: new Phaser.Events.EventEmitter()
        }
        
        const listener = (eventName: string) => () => {
            this.inGame.events.emit(eventName)
        }

        this.inGame.space?.on(Phaser.Input.Keyboard.Events.DOWN, listener(Events.keyDown))
        this.mScene.input.on(Phaser.Input.Events.POINTER_DOWN, listener(Events.keyDown))

        this.inGame.space?.on(Phaser.Input.Keyboard.Events.UP, listener(Events.keyUp))
        this.mScene.input.on(Phaser.Input.Events.POINTER_UP, listener(Events.keyUp))
    }

    update() {
        this.inGame.holding = 
            this.mScene.input.pointer1.isDown 
            || this.mScene.input.mousePointer.isDown
            || (this.inGame.space == null ? false : this.mScene.input.keyboard!.checkDown(this.inGame.space!))
    }
}