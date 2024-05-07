import Phaser from 'phaser'
import theme from './theme'
import Button from './button'
import FullscreenButton from './fullscreen'
import { BaseScene } from './baseScene'
import config from './config'
import provider from './api/provider'

export default class HighScoreScene extends BaseScene {
    private loading: Phaser.GameObjects.Text | undefined
    private loadingDots: string

    constructor() {
        super({key: 'highscores'})
        this.loadingDots = ''
    }

    override create() {
        super.create()
        this.cameras.main.setBackgroundColor(theme.background)
            .centerOn(0, 0)

        this.add.text(0, -200, '< High scores >', theme.scoreText)
            .setOrigin(0.5, 0.5)

        this.loading = this.add.text(0, 0, '', theme.baseText)
            .setOrigin(0.5, 0.5)
        const updateLoading = () => {
            if (this.loadingDots.length >= 3)
                this.loadingDots = ''
            else 
                this.loadingDots += '.'
            this.loading?.setText('Loading' + this.loadingDots)
            this.time.delayedCall(1000, updateLoading)
        }
        updateLoading()

        this.add.existing(new Button(this, 'Back', () => {
            this.scene.start('game')
        }, 0, 200))

        this.add.existing(new FullscreenButton(this, this.scale.isFullscreen))

        this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
            this.resize(screen.width * config.game.height / screen.height, config.game.height)
            this.scene.restart()
        })
        this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
            this.resize(config.game.width, config.game.height)
            this.scene.restart()
        })

        this.createList()
    }

    async createList() {
        console.log(await provider.getTopRankings())
    }
}