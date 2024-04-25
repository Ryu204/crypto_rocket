import Phaser from 'phaser'
import assets from './asset/import'
import Bird from './bird'
import config from './config.json'

class DoublePipe extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, gap: number, bird: Bird) {
        super(scene)

        const up = scene.physics.add.image(0, -gap / 2, assets.pipe.id)
            .setRotation(Math.PI)
            .setOrigin(0.5, 0)
        up.body
            .setImmovable(true)
            .setAllowGravity(false)
            .setAllowRotation(false)
            .setOffset(0, -up.height)
            .setVelocityX(-config.spawner.pipeSpeed)

        const down = scene.physics.add.image(0, gap / 2, assets.pipe.id)
            .setOrigin(0.5, 0)
        down.body
            .setImmovable(true)
            .setAllowGravity(false)
            .setAllowRotation(false)
            .setVelocityX(-config.spawner.pipeSpeed)

        this.add([up, down])
        scene.physics.add.collider(bird, [up, down], (b, p) => { console.log('collided') })
    }
}

export default class Spawner extends Phaser.GameObjects.Group {
    mBird: Bird

    constructor(scene: Phaser.Scene, bird: Bird) {
        super(scene)
        this.setUp()
        this.mBird = bird
    }

    private setUp() {
        const millisPerSec = 1000
        const interval = config.spawner.interval * millisPerSec
        const f: Function = () => {
            this.spawn()
            this.scene.time.delayedCall(interval, f)
        }
        this.scene.time.delayedCall(interval, f)
    }

    private spawn() {
        const gap = config.spawner.gapPerBird * config.bird.width
        const pipes = this.scene.add.existing(new DoublePipe(this.scene, gap, this.mBird))
        pipes.x = this.rightLimit(100)
        this.add(pipes)
    }

    private rightLimit(offset: number) {
        const cam = this.scene.cameras.main
        return cam.scrollX + cam.displayWidth + offset
    }
}