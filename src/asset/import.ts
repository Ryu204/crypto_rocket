import _missile from './missile.png'
import _missileData from './missile.json'
import _theonite from './theonite.png'
import _theoniteData from './theonite.json'
import _fullscreen from './fullscreen.png'
import _fullscreen2 from './fullscreen_2.png'
import _click from './click.png'
import _particle from './particle.png'
import _jet from './jet.mp3'
import _explode from './die.mp3'
import _theoniteSfx from './coin.mp3'
import _confirm from './confirm.flac'
import _hover from './hover.flac'
import Phaser from 'phaser'

enum Type {
    image, spritesheet, audio
}

type Data = undefined | {
    anim: undefined | typeof _missileData
}

export class Asset {
    private mPath: string
    private mType: Type
    data: Data
    
    constructor(path: string, type: Type, data: Data = undefined) {
        this.mPath = path
        this.mType = type
        this.data = data
        if (type == Type.spritesheet) {
            this.data = {
                anim: data!.anim
            }
        }
    }

    get id() : string {
        // TODO: hash or something instead of this
        return this.mPath + '__' + String(this.mType)
    }
    get type() : Type { return this.mType }
    get path() : string { return this.mPath }
}

const assets = {
    missile: new Asset(_missile, Type.spritesheet, { anim: _missileData }),
    theonite: new Asset(_theonite, Type.spritesheet, {anim: _theoniteData}),
    fullscreen: new Asset(_fullscreen, Type.image),
    fullscreen2: new Asset(_fullscreen2, Type.image),
    click: new Asset(_click, Type.image),
    particle: new Asset(_particle, Type.image),
    jet: new Asset(_jet, Type.audio),
    explode: new Asset(_explode, Type.audio),
    theoniteSfx: new Asset(_theoniteSfx, Type.audio),
    confirm: new Asset(_confirm, Type.audio),
    hover: new Asset(_hover, Type.audio),
}
export default assets

const loadedCallback = new Array<Function>()

/**
 * Remember to call `finishLoading` in `create()`
 */
export function loadAssetsTo(scene: Phaser.Scene) {
    loadedCallback.length = 0
    let k : keyof typeof assets;
    for (k in assets) {
        const v = assets[k];
        switch (v.type) {
            case Type.image:
                scene.load.image(v.id, v.path)
                break
            case Type.spritesheet:
                const data = v.data!.anim!
                scene.load.spritesheet(v.id, v.path, {
                    frameWidth: data.width,
                    frameHeight: data.height,
                })
                for (const action of data.actions) {
                    loadedCallback.push(() => scene.anims.create({
                        key: action.name,
                        repeat: action.loop ? -1 : 0,
                        frameRate: action.fps,
                        frames: scene.anims.generateFrameNumbers(v.id, {
                            start: action.from, end: action.to,
                        })
                    }))
                }
                break
            case Type.audio:
                scene.load.audio(v.id, v.path)
                break
            default:
                reportError('Unhandled switch case')
        }
    }
}
let callbackExecuted = false
export function finishLoading() {
    if (callbackExecuted)
        return
    for (const f of loadedCallback)
        f()
    callbackExecuted = true
}