import _bgr from './bgr.jpg'

export module Assets {
    export type Type = {
        id: string,
        path: string,
    }

    export const bgr: Type = {
        id: 'bgr',
        path: _bgr,
    }
}