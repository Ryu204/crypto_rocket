import Phaser from 'phaser'
import assets from './asset/import'
import Bird from './bird'
import config from './config.json'
import Score from './score'
import { GameScene } from './gameScene'

class DoublePipe extends Phaser.GameObjects.Container {
    constructor(scene: GameScene, gap: number, bird: Bird, score: Score) {
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
        scene.physics.add.collider(bird, [up, down], (b, p) => { 
            scene.gameOver()
        })
        scene.physics.add.overlap(bird, mid, (b, m) => { 
            score.increase() 
            mid.destroy()
        })
    }

    get pipeX() {
        return this.x + (this.getAll()[0] as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).x
    }

    stop() {
        for (const i of this.getAll('body')) {
            ;(i.body! as Phaser.Physics.Arcade.Body).setVelocity(0)
        }
    }
}

export default class Spawner extends Phaser.GameObjects.Group {

    mRnd: Phaser.Math.RandomDataGenerator
    mBird: Bird
    mScore: Score
    mPause: boolean = false

    constructor(scene: Phaser.Scene, bird: Bird, score: Score) {
        super(scene)
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
            if (ps.pipeX < (this.scene as GameScene).leftLimit())
                toDestroy.push(ps)
        })
        toDestroy.forEach((e, i, a) => { e.destroy() })
    }

    startSpawning() {
        this.setUpSpawn()
    }

    stop() {
        if (this.mPause)
            return
        this.mPause = true
        for (const i of this.getChildren()) {
            ;(i as DoublePipe).stop()
        }
    }

    private setUpSpawn() {
        const millisPerSec = 1000
        const interval = config.spawner.interval * millisPerSec
        const f: Function = () => {
            if (this.mPause)
                return
            this.spawn()
            this.scene.time.delayedCall(interval, f)
        }
        f()
    }

    private spawn() {
        const gap = config.spawner.gapPerBird * config.bird.width * config.bird.scale
        const pipes = this.scene.add.existing(new DoublePipe(this.scene as GameScene, gap, this.mBird, this.mScore))
        pipes.x = (this.scene as GameScene).rightLimit()
        pipes.y = (this.mRnd.frac() * 2 - 1) * config.spawner.maxAmplitude
        this.add(pipes)
    }
}