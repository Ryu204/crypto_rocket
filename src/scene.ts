import Phaser from 'phaser';
import { loadAssetsTo } from './asset/import';
import Bird from './bird';
import Spawner from './spawner';
import Control from './control';

export class GameScene extends Phaser.Scene {

    public control: Control | undefined

    preload() {
        loadAssetsTo(this)
    }

    create() {
        this.control = new Control(this)

        const bird = this.makeBird()

        this.add.existing(new Spawner(this, bird))

        const camera = this.cameras.main
            .setBackgroundColor(0x443300)
            .centerOn(0, 0)

        this.physics.world.bounds
            .setPosition(camera.scrollX, camera.scrollY)
            .setSize(camera.displayWidth, camera.displayHeight)
    }

    override update() {
        this.control!.update()
    }

    private makeBird() {
        const bird = this.add.existing(new Bird(this, this.control!.inGame)) as Bird
        return bird
    }
}