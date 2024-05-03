import Phaser, { Physics } from 'phaser'
import assets from './asset/import'
import Bird from './bird'
import config from './config'
import Score from './score'
import { GameScene } from './gameScene'

class Theonite extends Phaser.GameObjects.Container {
    constructor(scene: GameScene, bird: Bird, score: Score, sfx: Phaser.Sound.BaseSound) {
        super(scene)        
        const theonite = scene.add.sprite(0, 0, assets.theonite.id)
            .play('idle')
        theonite.setScale(config.spawner.sizePerBird * config.bird.width * config.bird.scale / theonite.height)
        scene.physics.add.existing(theonite)
        ;(theonite.body as Phaser.Physics.Arcade.Body)
            .setImmovable(true)
            .setAllowGravity(false)
            .setVelocityX(- this.scene.scale.gameSize.width / config.spawner.timePerScreenWidth)
        scene.physics.add.overlap(bird, theonite, (b, m) => { 
            score.increase() 
            this.destroy()
            bird.recharge(config.spawner.fuel)
            sfx.play(undefined, {
                detune: bird.arcadeBody.speed * 3,
                seek: 0.1
            })
        })
        this.add(theonite)
    }

    get positionX() {
        return this.x + (this.getAt(0).body! as Physics.Arcade.Body).x
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
    mSfx: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene, bird: Bird, score: Score) {
        super(scene)
        this.mBird = bird
        this.mRnd = new Phaser.Math.RandomDataGenerator(['Hello, world', '1', '2', Date.now().toString()])
        this.runChildUpdate = false
        this.mScore = score
        this.mSfx = scene.sound.add(assets.theoniteSfx.id)
    }

    override preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)
        const toDestroy: Phaser.GameObjects.GameObject[] = []
        this.children.entries.forEach((v, i, a) => {
            if (!(v instanceof Theonite))
                return
            const theo = v as Theonite
            if (theo.positionX < (this.scene as GameScene).leftLimit())
                toDestroy.push(theo)
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
            ;(i as Theonite).stop()
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
        const pipes = this.scene.add.existing(new Theonite(this.scene as GameScene, this.mBird, this.mScore, this.mSfx))
        pipes.x = (this.scene as GameScene).rightLimit(0)
        pipes.y = (this.mRnd.frac() * 2 - 1) * config.spawner.maxAmplitude
        this.add(pipes)
    }
}