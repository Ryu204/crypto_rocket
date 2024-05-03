import Phaser from 'phaser';
import assets, { loadAssetsTo, finishLoading } from './asset/import';
import Bird from './bird';
import Spawner from './spawner';
import Control, { Events } from './control';
import Score from './score';
import GameOverOverlay from './gameOverOverlay';
import FullscreenButton from './fullscreen';
import config from './config'
import FuelBar from './fuelBar';

enum State {
    idle, game, gameOver
}

export class GameScene extends Phaser.Scene {

    private mState: State = State.idle
    private mBird: Bird | undefined
    private mSpawner: Spawner | undefined

    control: Control | undefined
    confirmSfx: Phaser.Sound.BaseSound | undefined
    hoverSfx: Phaser.Sound.BaseSound | undefined

    constructor() {
        super({ key: 'game' })
    }

    preload() {
        loadAssetsTo(this)
    }

    create() {
        finishLoading()
        const camera = this.cameras.main
            .setBackgroundColor(0x443355)
            .centerOn(0, 0)

        this.physics.world.bounds
            .setPosition(camera.scrollX, camera.scrollY)
            .setSize(camera.displayWidth, camera.displayHeight)

        this.control = new Control(this)

        this.mBird = this.makeBird()
        const { score, fs, fuelBar, clickImg, cf, hv } = this.makeUi()
        this.mSpawner = this.add.existing(new Spawner(this, this.mBird, score)) as Spawner
        this.mState = State.idle
        this.confirmSfx = cf
        this.hoverSfx = hv

        this.control.inGame.events.on(Events.keyUp, () => { 
            if (this.mState != State.idle)
                return
            this.startGame()
            score.setAlpha(1)
            clickImg.destroy()
        })
    }

    startGame() {
        this.mBird!.play()
        this.mSpawner!.startSpawning()
        this.mState = State.game
    }

    gameOver(mute: boolean) {
        if (this.mState == State.gameOver)
        this.mState = State.gameOver
        this.mSpawner!.stop()
        this.mBird!.die(mute)
        this.add.existing(new GameOverOverlay(this))
        this.cameras.main.shake(100, 0.01)
    }

    restart() {
        this.gameOver(true) // Stop all sounds
        this.scene.restart()
    }

    override update() {
        this.control!.update()
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

    private makeBird() {
        const bird = this.add.existing(new Bird(this, this.control!.inGame)) as Bird
        return bird
    }

    private makeUi() {
        const score = this.add.existing(new Score(this))
        const fs = this.add.existing(new FullscreenButton(this, this.scale.isFullscreen))
        const fuelBar = this.add.existing(new FuelBar(this, this.mBird!))
        const clickImg = this.add.image(0, 0, assets.click.id)
        const cf = this.sound.add(assets.confirm.id)
        const hv = this.sound.add(assets.hover.id)

        score.setAlpha(0)
        clickImg.setScale(2).setY(100)
        this.scale.removeAllListeners()
        this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
            this.resize(screen.width * config.game.height / screen.height, config.game.height)
            this.restart()
        })
        this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
            this.resize(config.game.width, config.game.height)
            this.restart()
        })
        return { score, fs, fuelBar, clickImg, cf, hv }
    }

    private resize(width: number, height: number) {
        this.scale.resize(width, height)
        if (this.game.config.renderType == Phaser.WEBGL) {
            this.game.renderer.resize(width, height)
        }
    }
}