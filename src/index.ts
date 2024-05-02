import './css/style.css'
import Phaser from 'phaser'
import { GameScene } from './gameScene'
import config from './config.json'

try {

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: config.game.gravity
            },
            debug: true
        }
    },
    scene: [GameScene],
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.NONE,
        fullscreenTarget: 'gameCanvas',  
        width: config.game.width,
        height: config.game.height,
    },
    pixelArt: true,
    parent: document.getElementById('gameContainer')!,
    autoMobilePipeline: true,
}

const game = new Phaser.Game(gameConfig)

} catch (e) {
    console.log(`error happened: ${e}`)
}