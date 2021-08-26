import { gameContainer } from './baseElements';

interface XCoordsHeights {
    [index: number]: number;
}

class Board {
    private _xCoordHeights: XCoordsHeights = {};

    constructor() {
        //this._initializeXCoords();
    }

    initializeXCoordsHeights() {
        const range = gameContainer?.offsetWidth as number;
        console.log(range);
        for (let i = 0; i < range; i += 40) {
            this._xCoordHeights[i] = 0;
        }
        //console.log(this._xCoordHeights);
    }

    getXHeight(x: number) {
        console.log(x);

        return this._xCoordHeights[x];
    }

    setXHeight(x: number, newHeight: number) {
        this._xCoordHeights[x] = newHeight;
    }
}

export default new Board();
