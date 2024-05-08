import Phaser from 'phaser'
import assets from './asset/import'
import Rocket from './rocket'
import Spawner from './spawner'
import Control, { Events } from './control'
import Score from './score'
import GameOverOverlay from './gameOverOverlay'
import FullscreenButton from './fullscreen'
import config from './config'
import FuelBar from './fuelBar'
import theme from './theme'
import { BaseScene } from './baseScene'

enum State {
    idle, game, gameOver
}

export class GameScene extends BaseScene {

    private mState: State = State.idle
    private mRocket: Rocket | undefined
    private mSpawner: Spawner | undefined
    private mScore: Score | undefined

    control: Control | undefined

    constructor() {
        super({ key: 'game' })
    }

    override create() {
        super.create()
        const camera = this.cameras.main
            .setBackgroundColor(theme.background)
            .centerOn(0, 0)

        this.physics.world.bounds
            .setPosition(camera.scrollX, camera.scrollY)
            .setSize(camera.displayWidth, camera.displayHeight)

        this.control = new Control(this)

        this.mRocket = this.makeRocket()
        const { score, fs, fuelBar, clickImg} = this.makeUi()
        this.mSpawner = this.add.existing(new Spawner(this, this.mRocket, score)) as Spawner
        this.mState = State.idle
        this.mScore = score

        this.control.inGame.events.on(Events.keyUp, () => { 
            if (this.mState != State.idle)
                return
            this.startGame()
            score.setAlpha(1)
            clickImg.destroy()
        })
    }

    startGame() {
        this.mRocket!.play()
        this.mSpawner!.startSpawning()
        this.mState = State.game
    }

    gameOver(mute: boolean) {
        if (this.mState == State.gameOver)
        this.mState = State.gameOver
        this.mSpawner!.stop()
        this.mRocket!.die(mute)
        this.add.existing(new GameOverOverlay(this, this.mScore!.mScore))
        this.cameras.main.shake(100, 0.01)
    }

    restart() {
        this.gameOver(true) // Stop all sounds
        this.scene.restart()
    }

    override update() {
        this.control!.update()
    }

    private makeRocket() {
        const rocket = this.add.existing(new Rocket(this, this.control!.inGame)) as Rocket
        return rocket
    }

    private makeUi() {
        const score = this.add.existing(new Score(this))
        const fs = this.add.existing(new FullscreenButton(this, this.scale.isFullscreen))
        const fuelBar = this.add.existing(new FuelBar(this, this.mRocket!))
        const clickImg = this.add.image(0, 0, assets.click.id)

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
        return { score, fs, fuelBar, clickImg }
    }
}