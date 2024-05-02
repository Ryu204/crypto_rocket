import Phaser from 'phaser'
import assets from './asset/import'
import { InGame } from './control'
import config from './config.json'
import { GameScene } from './gameScene'

enum State {
    idle,
    boost,
    fall,
    dead
}

enum AnimTags {
    boost = 'boost',
    ignite = 'ignite',
    die = 'boom',
    fall = 'still'
}

export default class Bird extends Phaser.GameObjects.Container {
    mInGame: InGame
    mState: State
    mSprite: Phaser.GameObjects.Sprite
    private fuelCapacity: number
    private fuelCurrent: number

    constructor(scene : Phaser.Scene, inGameControl: InGame) {
        super(scene)
        this.mSprite = this.buildVisual().sprite
        this.buildPhysics()
        this.mInGame = inGameControl
        this.mState = State.idle
        this.fuelCurrent = this.fuelCapacity = config.bird.fuel
    }

    preUpdate(time: number, delta: number) {
        switch (this.mState) {
            case State.idle:
                const amp = config.bird.beginAmplitudePerWidth * config.bird.width
                this.setY(amp * Math.sin(time * config.bird.beginAnimationSpeed))
                break
            case State.boost:
                this.fuelCurrent -= delta / 1000 * config.bird.fuelSpeed
                this.limitUpVelocity() // Cannot go up too fast
                this.arcadeBody.velocity.y = Math.min(this.arcadeBody.velocity.y, 0) // Immediately change velocity when pressed
                this.mSprite.rotation = Math.min(this.mSprite.rotation, Math.PI / 2)
                this.arcadeBody.setAccelerationY(-config.bird.pushStrength)
                if (this.fuel < 0 || !this.mInGame.holding) {
                    this.mSprite.play(AnimTags.fall)
                    this.arcadeBody.setAccelerationY(0)
                    this.mState = State.fall
                }
                if (this.arcadeBody.onFloor())
                    (this.scene as GameScene).gameOver()
                break
            case State.fall:
                this.fuelCurrent -= delta / 1000 * config.bird.fuelSpeed * config.bird.fallFuelSpeedScale
                if (this.mInGame.holding && this.fuel > 0) {
                    this.mSprite.play(AnimTags.boost)
                    this.mState = State.boost
                }
                if (this.arcadeBody.onFloor())
                    (this.scene as GameScene).gameOver()
                break
            case State.dead:
                if (this.mSprite.anims.getProgress() >= 1) {
                    this.mSprite.alpha = 0
                }
        }
        this.updateRotation(delta)
        this.fuelCurrent = Phaser.Math.Clamp(this.fuelCurrent, 0, this.fuelCapacity)
    }

    play() {
        this.mState = State.boost
        this.arcadeBody.setAllowGravity(true).setVelocityY(-999999999)
        this.mSprite.play(AnimTags.boost)
    }

    get fuel() {
        return this.fuelCurrent / this.fuelCapacity
    }

    recharge(fuel: number) {
        this.fuelCurrent = Math.min(this.fuelCapacity, this.fuelCurrent + fuel)
    }

    die() {
        this.arcadeBody.destroy()
        this.mState = State.dead
        this.mSprite.play(AnimTags.die).setRotation(Math.PI / 2)
    }

    private buildVisual() {
        const sprite = this.scene.add.sprite(0, 0, assets.missile.id)
        this.add(sprite).setDepth(1)
        sprite.setScale(config.bird.scale).setRotation(Math.PI / 2)
        sprite.anims.play(AnimTags.boost)
        return { sprite }
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

    private limitUpVelocity() {
        this.arcadeBody.velocity.y = Math.max(this.arcadeBody.velocity.y, -config.bird.maxVelocityY)
    }

    private updateRotation(dt: number) {
        if (this.mState == State.dead)
            return
        const omega = config.bird.omegaPerVelY * this.arcadeBody.velocity.y
        this.mSprite.rotation += omega * dt / 1000
        this.mSprite.setRotation(Phaser.Math.Clamp(this.mSprite.rotation, Math.PI / 4, 3 * Math.PI / 4))
    }
}