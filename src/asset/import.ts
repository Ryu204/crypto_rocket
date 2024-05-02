import _bgr from './bgr.jpg'
import _bird from './bird.png'
import _pipe from './pipe.png'
import _fullscreen from './fullscreen.png'
import _fullscreen2 from './fullscreen_2.png'
import Phaser from 'phaser'

export enum Type {
    image
}

export class Asset {
    private mPath: string
    private mType: Type
    
    constructor(path: string, type: Type) {
        this.mPath = path
        this.mType = type
    }

    get id() : string {
        // TODO: hash or something instead of this
        return this.mPath + '__' + String(this.mType)
    }
    get type() : Type { return this.mType }
    get path() : string { return this.mPath }
}

const assets = {
    bgr: new Asset(_bgr, Type.image),
    bird: new Asset(_bird, Type.image),
    pipe: new Asset(_pipe, Type.image),
    fullscreen: new Asset(_fullscreen, Type.image),
    fullscreen2: new Asset(_fullscreen2, Type.image)
}

export default assets

export function loadAssetsTo(scene: Phaser.Scene) {
    let k : keyof typeof assets;
    for (k in assets) {
        const v = assets[k];
        switch (v.type) {
            case Type.image:
                scene.load.image(v.id, v.path)
                break;
            default:
                reportError('Unhandled switch case')
        }
    }
}