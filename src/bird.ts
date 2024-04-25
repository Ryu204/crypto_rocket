import Phaser from 'phaser'
import assets from './asset/import'
import { InGame } from './control'
import config from './config.json'

export default class Bird extends Phaser.GameObjects.Container {
    mInGame: InGame

    constructor(scene : Phaser.Scene, inGameControl: InGame) {
        super(scene)
        this.buildVisual()
        this.buildPhysics()
        this.mInGame = inGameControl
    }

    preUpdate() {
        if (this.mInGame.holding) {
            this.arcadeBody.setAccelerationY(-config.bird.pushStrength)
        } else {
            this.arcadeBody.setAccelerationY(0)
        }
    }

    private buildVisual() {
        this.add(this.scene.add.image(0, 0, assets.bird.id))
    }

    private buildPhysics() {
        this.scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        
        body.setCollideWorldBounds(true)
        body.setSize(config.bird.width, config.bird.width).setOffset(-config.bird.width / 2, -config.bird.width / 2)
        body.setMaxVelocityY(config.bird.maxVelocityY)
    }

    get arcadeBody() {
        return this.body as Phaser.Physics.Arcade.Body
    }
}