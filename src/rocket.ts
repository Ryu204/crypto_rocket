import Phaser from 'phaser'
import assets from './asset/import'
import { InGame } from './control'
import config from './config'
import { GameScene } from './gameScene'
import Smoke, { Visual } from './smoke'

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

export default class Rocket extends Phaser.GameObjects.Container {
    mInGame: InGame
    mState: State
    mSprite: Phaser.GameObjects.Sprite
    mSmoke: Smoke
    private fuelCapacity: number
    private fuelCurrent: number
    mJetSfx: Phaser.Sound.BaseSound

    constructor(scene : Phaser.Scene, inGameControl: InGame) {
        super(scene)

        const {sprite, smoke } = this.buildVisual()
        this.mSprite = sprite
        this.mSmoke = smoke

        this.buildPhysics()

        const {jet} = this.buildSound()
        this.mJetSfx = jet

        this.mInGame = inGameControl
        this.mState = State.idle
        this.fuelCurrent = this.fuelCapacity = config.rocket.fuel
    }

    preUpdate(time: number, delta: number) {
        switch (this.mState) {
            case State.idle:
                const amp = config.rocket.beginAmplitudePerWidth * config.rocket.width
                this.setY(amp * Math.sin(time * config.rocket.beginAnimationSpeed))
                break
            case State.boost:
                if (!this.mJetSfx.isPlaying) {
                    this.mJetSfx.play(undefined, {
                        detune: -10 * this.y,
                    })
                }
                this.fuelCurrent -= delta / 1000 * config.rocket.fuelSpeed
                this.limitUpVelocity() // Cannot go up too fast
                this.arcadeBody.velocity.y = Math.min(this.arcadeBody.velocity.y, 0) // Immediately change velocity when pressed
                this.mSprite.rotation = Math.min(this.mSprite.rotation, Math.PI / 2)
                this.arcadeBody.setAccelerationY(-config.rocket.pushStrength)
                if (this.fuel < 0 || !this.mInGame.holding) {
                    this.mSprite.play(AnimTags.fall)
                    this.arcadeBody.setAccelerationY(0)
                    this.mState = State.fall
                    this.scene.time.delayedCall(200, () => this.mJetSfx.stop())
                }
                if (this.arcadeBody.onFloor())
                    (this.scene as GameScene).gameOver(false)
                break
            case State.fall:
                this.fuelCurrent -= delta / 1000 * config.rocket.fuelSpeed * config.rocket.fallFuelSpeedScale
                if (this.mInGame.holding && this.fuel > 0) {
                    this.mSprite.play(AnimTags.boost)
                    this.mState = State.boost
                }
                if (this.arcadeBody.onFloor())
                    (this.scene as GameScene).gameOver(false)
                break
            case State.dead:
                if (this.mSprite.anims.getProgress() >= 1) {
                    this.mSprite.alpha = 0
                }
        }
        if (this.mState != State.idle && this.mState != State.boost) {
            this.mSmoke.setVisual(Visual.smoke)
        } else {
            this.mSmoke.setVisual(Visual.fire)
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

    die(mute: boolean) {
        this.arcadeBody.destroy()
        this.mState = State.dead
        this.mSprite.play(AnimTags.die).setRotation(Math.PI / 2)
        this.mSmoke.stop()
        this.mJetSfx.stop()
        if (!mute) {
            this.scene.sound.add(assets.explode.id).play()
        }
    }

    private buildVisual() {
        const sprite = this.scene.add.sprite(0, 0, assets.missile.id)
        this.add(sprite).setDepth(1)
        sprite.setScale(config.rocket.scale).setRotation(Math.PI / 2)
        sprite.anims.play(AnimTags.boost)

        const smoke = this.scene.add.existing(new Smoke(this, new Phaser.Math.Vector2(-15, 0), 50))
        return { sprite, smoke }
    }

    private buildPhysics() {
        this.scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        
        body.setSize(config.rocket.width, config.rocket.width)
            .setOffset(-config.rocket.width / 2, -config.rocket.width / 2)
            .setAllowGravity(false)
            .setCollideWorldBounds(true)
    }

    private buildSound() {
        const jet = this.scene.sound.add(assets.jet.id)
        return { jet }
    }

    get arcadeBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }

    private limitUpVelocity() {
        this.arcadeBody.velocity.y = Math.max(this.arcadeBody.velocity.y, -config.rocket.maxVelocityY)
    }

    private updateRotation(dt: number) {
        if (this.mState == State.dead)
            return
        const omega = config.rocket.omegaPerVelY * this.arcadeBody.velocity.y
        this.mSprite.rotation += omega * dt / 1000
        this.mSprite.setRotation(Phaser.Math.Clamp(this.mSprite.rotation, Math.PI / 4, 3 * Math.PI / 4))
        this.mSmoke.updateAngle(this.mSprite.angle + 90)
    }
}