import './css/style.css'
import Phaser from 'phaser'
import { GameScene } from './scene'
import config from './config.json'

try {

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    height: config.game.height, 
    width: config.game.width,
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
}

const game = new Phaser.Game(gameConfig)

} catch (e) {
    console.log(`error happened: ${e}`)
}