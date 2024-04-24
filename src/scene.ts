import Phaser from 'phaser';
import { Assets } from './asset/import';

export class GameScene extends Phaser.Scene {
    preload() {
        const x = this.load.image(Assets.bgr.id, Assets.bgr.path);
    }

    create() {
        this.add.image(0, 0, Assets.bgr.id)
    }
}