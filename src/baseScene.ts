import Phaser from 'phaser'
import { finishLoading, loadAssetsTo } from './asset/import'
import config from './config'

export class BaseScene extends Phaser.Scene {
    preload() {
        loadAssetsTo(this)
    }

    create() {
        finishLoading()
        this.scale.removeAllListeners()
    }

    rightLimit(offset: number = 100) {
        const cam = this.cameras.main
        return cam.scrollX + cam.displayWidth + offset
    }

    leftLimit(offset: number = 100) {
        const cam = this.cameras.main
        return cam.scrollX - offset
    }

    topLimit(offset: number = 100) {
        const cam = this.cameras.main
        return cam.scrollY - offset
    }

    bottomLimit(offset: number = 100) {
        const cam = this.cameras.main
        return cam.scrollY + cam.displayHeight + offset
    }

    protected resize(width: number, height: number) {
        this.scale.resize(width, height)
        if (this.game.config.renderType == Phaser.WEBGL) {
            this.game.renderer.resize(width, height)
        }
    }
}