import Phaser from 'phaser'
import assets from './asset/import'
import Bird from './bird'
import config from './config.json'
import Score from './score'

class DoublePipe extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, gap: number, bird: Bird, score: Score) {
        super(scene)

        const up = scene.physics.add.image(0, -gap / 2, assets.pipe.id)
            .setRotation(Math.PI)
            .setOrigin(0.5, 0)
        up.body
            .setImmovable(true)
            .setAllowGravity(false)
            .setOffset(0, -up.height)
            .setVelocityX(-config.spawner.pipeSpeed)

        const down = scene.physics.add.image(0, gap / 2, assets.pipe.id)
            .setOrigin(0.5, 0)
        down.body
            .setImmovable(true)
            .setAllowGravity(false)
            .setVelocityX(-config.spawner.pipeSpeed)
        
        const mid = scene.add.container()
        scene.physics.add.existing(mid)
        ;(mid.body as Phaser.Physics.Arcade.Body)
            .setImmovable(true)
            .setAllowGravity(false)
            .setVelocityX(-config.spawner.pipeSpeed)
            .setSize(2, 300)
            .setOffset(30, -150)

        this.add([up, down, mid])
        scene.physics.add.collider(bird, [up, down], (b, p) => { console.log('collided') })
        scene.physics.add.overlap(bird, mid, (b, m) => { 
            score.increase() 
            mid.destroy()
        })
    }

    get pipeX() {
        return this.x + (this.getAll()[0] as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).x
    }
}

export default class Spawner extends Phaser.GameObjects.Group {

    mRnd: Phaser.Math.RandomDataGenerator
    mBird: Bird
    mScore: Score

    constructor(scene: Phaser.Scene, bird: Bird, score: Score) {
        super(scene)
        this.setUpSpawn()
        this.mBird = bird
        this.mRnd = new Phaser.Math.RandomDataGenerator(['Hello, world', '1', '2', Date.now().toString()])
        this.runChildUpdate = false
        this.mScore = score
    }

    override preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        const toDestroy: Phaser.GameObjects.GameObject[] = []
        this.children.entries.forEach((v, i, a) => {
            if (!(v instanceof DoublePipe))
                return
            const ps = v as DoublePipe
            if (ps.pipeX < this.leftLimit())
                toDestroy.push(ps)
        })
        toDestroy.forEach((e, i, a) => { e.destroy(); console.log('bye bye') })
    }

    private setUpSpawn() {
        const millisPerSec = 1000
        const interval = config.spawner.interval * millisPerSec
        const f: Function = () => {
            this.spawn()
            this.scene.time.delayedCall(interval, f)
        }
        this.scene.time.delayedCall(interval, f)
    }

    private spawn() {
        const gap = config.spawner.gapPerBird * config.bird.width * config.bird.scale
        const pipes = this.scene.add.existing(new DoublePipe(this.scene, gap, this.mBird, this.mScore))
        pipes.x = this.rightLimit()
        pipes.y = (this.mRnd.frac() * 2 - 1) * config.spawner.maxAmplitude
        this.add(pipes)
    }

    private rightLimit(offset: number = 100) {
        const cam = this.scene.cameras.main
        return cam.scrollX + cam.displayWidth + offset
    }

    private leftLimit(offset: number = 100) {
        const cam = this.scene.cameras.main
        return cam.scrollX - offset
    }
}