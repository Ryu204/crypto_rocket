import Phaser from 'phaser'
import Button from './button'
import FullscreenButton from './fullscreen'
import { BaseScene } from './baseScene'
import config from './config'
import provider from './api/provider'
import Textfield from './textfield'

export default class SaveScoreScene extends BaseScene {
    constructor() {
        super({key: 'savescore'})
    }

    override create() {
        super.create()
        this.cameras.main.setBackgroundColor(0x221133)
            .centerOn(0, 0)

        this.add.existing(new FullscreenButton(this, this.scale.isFullscreen))

        this.scale.removeAllListeners()
        this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
            this.resize(screen.width * config.game.height / screen.height, config.game.height)
            this.scene.restart()
        })
        this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
            this.resize(config.game.width, config.game.height)
            this.scene.restart()
        })

        this.saveScore()

        this.add.existing(new Button(this, 'Back', () => {
            this.scene.start('game')
        }, 0, 200))
    }

    private async saveScore() {
        const saveWithName = async (name: string) => {
            await provider.saveNewEntry(name, this.scene.get('game').data.get('score'))
            this.scene.start('highscores')
        }
        const textfield = this.add.existing(new Textfield(this as BaseScene, (text: string) => {
            saveWithName(text)
        }, 'Your name'))
            .setOrigin(0.5, 0.5)
    }
}