import { gameContainer } from './baseElements';

interface XCoordsHeights {
    [index: number]: number;
}

interface Row {
    [index: number]: HTMLDivElement | null;
}

interface Rows {
    [index: number]: Row;
}

class Board {
    private _xCoordHeights: XCoordsHeights = {};
    private _rows: Rows = {};

    constructor() {
        //this._initializeXCoords();
    }

    init() {
        this._initializeXCoordsHeights();
        this._initializeRows();
    }

    get rows() {
        return this._rows;
    }

    get lastRowNumber() {
        return Math.max(
            ...Object.keys(this._rows).map((keyString) => parseInt(keyString))
        );
    }

    private _initializeXCoordsHeights() {
        const range = gameContainer?.offsetWidth as number;
        for (let i = 0; i < range; i += 40) {
            this._xCoordHeights[i] = 0;
        }
        //console.log(this._xCoordHeights);
    }

    private _initializeRows() {
        const xRange = gameContainer?.offsetWidth as number;
        const yRange = gameContainer?.offsetHeight as number;

        for (let i = 0; i < yRange; i += 40) {
            this._rows[i] = {};
            for (let j = 0; j < xRange; j += 40) {
                this._rows[i][j] = null;
            }
        }
    }

    decreaseXCoordsHeight(numRows: number) {
        const decreaseBy = numRows * 40;
        for (let xCoord in this._xCoordHeights) {
            this._xCoordHeights[xCoord] -= decreaseBy;
        }
    }

    getXHeight(x: number) {
        return this._xCoordHeights[x];
    }

    setXHeight(x: number, newHeight: number) {
        this._xCoordHeights[x] = newHeight;
    }

    updateRows(xCoord: number, yCoord: number, element: HTMLDivElement) {
        this._rows[yCoord][xCoord] = element;
    }

    updateRowsAfterRowDelete(firstToMove: number, moveBy: number) {
        let moveFrom = firstToMove;
        let moveTo = firstToMove - moveBy;
        console.log(moveFrom, moveTo);

        // TODO: infinite loop?
        while (typeof this._rows[moveFrom] !== 'undefined') {
            this._rows[moveTo] = this._rows[moveFrom];
            moveTo += 40;
            moveFrom += 40;
        }
    }

    findFullRows() {
        const fullRowNumbers: number[] = [];
        for (const rowNumber in this._rows) {
            let isFull = true;

            for (const xCoord in this._rows[rowNumber]) {
                if (this._rows[rowNumber][xCoord] === null) {
                    isFull = false;
                    break;
                }
            }

            if (isFull) {
                fullRowNumbers.push(parseInt(rowNumber));
            }
        }

        return fullRowNumbers;
    }

    deleteFullRows(fullRows: number[]) {
        fullRows.forEach((rowNumber) => {
            for (const [xCoord, unit] of Object.entries(
                this._rows[rowNumber]
            )) {
                unit.remove();
                this._rows[rowNumber][parseInt(xCoord)] = null;
            }
        });
    }
}

export default new Board();
