import Phaser from 'phaser'
import assets from './asset/import'
import { InGame } from './control'
import config from './config.json'
import { GameScene } from './gameScene'

enum State {
    idle,
    game,
    dead
}

export default class Bird extends Phaser.GameObjects.Container {
    mInGame: InGame
    mState: State

    constructor(scene : Phaser.Scene, inGameControl: InGame) {
        super(scene)
        this.buildVisual()
        this.buildPhysics()
        this.mInGame = inGameControl
        this.mState = State.idle
    }

    preUpdate(time: number, delta: number) {
        switch (this.mState) {
            case State.idle:
                const amp = config.bird.beginAmplitudePerWidth * config.bird.width
                this.setY(amp * Math.sin(time * config.bird.beginAnimationSpeed))
                break
            case State.game:
                if (this.mInGame.holding) {
                    this.arcadeBody.setVelocityY(Phaser.Math.Clamp(this.arcadeBody.velocity.y, -config.bird.maxVelocityY, 0))
                    this.arcadeBody.setAccelerationY(-config.bird.pushStrength)
                } else {
                    this.arcadeBody.setAccelerationY(0)
                }
                if (this.arcadeBody.onFloor())
                    (this.scene as GameScene).gameOver()
                break
            case State.dead:
                break
        }
    }

    play() {
        this.mState = State.game 
        this.arcadeBody.setAllowGravity(true).setVelocityY(-100000)
    }

    die() {
        const body = this.body! as Phaser.Physics.Arcade.Body
        body.setVelocity(0)
        body.setAcceleration(0)
        body.setCollidesWith([])
        this.removeFromUpdateList()
        this.mState = State.dead
    }

    private buildVisual() {
        const img = this.add(this.scene.add.image(0, 0, assets.bird.id))
        img.setScale(config.bird.scale).setDepth(1)
    }

    private buildPhysics() {
        this.scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        
        body.setSize(config.bird.width, config.bird.width)
            .setOffset(-config.bird.width / 2, -config.bird.width / 2)
            .setAllowGravity(false)
            .setCollideWorldBounds(true)
    }

    get arcadeBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}