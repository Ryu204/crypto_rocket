import Phaser from 'phaser'
import assets from './asset/import'

export enum Visual {
    fire, smoke
}

const rng = new Phaser.Math.RandomDataGenerator(Date.now().toString())
let minAngle: number = -180
let maxAngle: number = -180

export default class Smoke extends Phaser.GameObjects.Particles.ParticleEmitter {
    private mOffset : Phaser.Math.Vector2
    private spreadAngle : number
    
    constructor(
        follow: Phaser.Types.Math.Vector2Like & Phaser.GameObjects.Container, 
        offset: Phaser.Math.Vector2, angle: number
    ) {
        super(follow.scene, 0, 0, assets.particle.id, {
            color: [ 0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f ],
            colorEase: 'quad.out',
            scale: { start: 0.5, end: 0, ease: 'sine.out' },
            speed: 100,
            angle: {
                onEmit: (particle?: Phaser.GameObjects.Particles.Particle, key?: string, value?: number) => {
                    return rng.realInRange(minAngle, maxAngle)
                }
            },

        })
        this.mOffset = offset
        this.follow = follow
        this.spreadAngle = angle
    }

    setVisual(state: Visual) {
        if (state == Visual.smoke) {
            this.setParticleLifespan(100)
        } else {
            this.setParticleLifespan(2400)
            this.setParticleTint(0x000000)
        }
    }

    updateAngle(angle: number) {
        minAngle = angle - this.spreadAngle / 2
        maxAngle = angle + this.spreadAngle / 2
        this.followOffset.copy(this.mOffset).setAngle(angle * Phaser.Math.DEG_TO_RAD)
    }
}
