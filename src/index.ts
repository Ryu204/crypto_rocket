import './css/style.css';
import Phaser from 'phaser';
import { GameScene } from './scene';

try {

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    height: 500, 
    width: 500,
    canvas: document.getElementById('gameCanvas') as HTMLCanvasElement,
    physics: {
        default: 'arcade',
    },
    scene: [GameScene],
}

const game = new Phaser.Game(config)

} catch (e) {
    console.log(`error happened: ${e}`)
}