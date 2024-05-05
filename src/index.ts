import './asset/style.css'
import './asset/MinecraftRegular-Bmg3.woff2'
import './asset/logo.ico'
import './asset/gh-logo.png'
import './asset/sepolia-logo.png'

import Phaser from 'phaser'
import { GameScene } from './gameScene'
import config from './config'

try {

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: config.game.gravity
            },
            debug: false
        }
    },
    scene: [GameScene],
    dom: {
        createContainer: true
    },
    scale: {
        width: config.game.width,
        height: config.game.height,
    },
    pixelArt: true,
    parent: 'gameContainer',
    autoMobilePipeline: true,
    fullscreenTarget: 'gameCanvas',
    width: config.game.width,
    height: config.game.height,
}

const game = new Phaser.Game(gameConfig)

} catch (e) {
    console.log(`error happened: ${e}`)
}