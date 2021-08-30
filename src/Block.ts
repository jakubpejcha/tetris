import { gameContainer } from './baseElements';
import Board from './Board';

export default class Block {
    private readonly _gameContainer = gameContainer;
    protected readonly className: string;

    // initial blank div, will be rewritten in render
    private _element = document.createElement('div');
    private _moveAmount = 40;
    private _prevRafTimestamp = 0;
    private _currRotationAngle = 0;
    private _distanceFromObj = 0;

    // in px per frame
    // must divide cell size
    private _fallingSpeed = 2;

    constructor(className: string) {
        this.className = className;
        //Board.initializeXCoords();
    }

    set moveAmount(amount: number) {
        this._moveAmount = amount;
    }

    private _getUnitXCoord(unit: HTMLDivElement) {
        return this.left() + unit.offsetLeft;
    }

    private _getUnitBottom(unit: HTMLDivElement) {
        return (
            parseFloat(getComputedStyle(this._element).bottom) +
            (this._element.offsetHeight - unit.offsetHeight - unit.offsetTop)
        );
    }

    private _calculateDistancePerUnit() {
        const distances: number[] = [];
        this._element.querySelectorAll('div').forEach((unit) => {
            const unitXCoord = this._getUnitXCoord(unit);
            const unitBottom = this._getUnitBottom(unit);

            distances.push(unitBottom - Board.getXHeight(unitXCoord));
        });

        return distances;
    }

    private _calculateDistanceFromObj() {
        const distances = this._calculateDistancePerUnit();
        this._distanceFromObj = Math.min(...distances);
    }

    left() {
        //return this._element.offsetLeft;
        return parseFloat(getComputedStyle(this._element).left);
    }

    right() {
        return parseFloat(getComputedStyle(this._element).right);
    }

    protected startFalling() {
        // TODO: move outside
        this._calculateDistanceFromObj();

        window.requestAnimationFrame(this.fall.bind(this));
    }

    private _buildTemplate(child: string, numChildren: number) {
        const blockElem = document.createElement('div');
        blockElem.className = `block ${this.className}`;

        for (let i = 0; i < numChildren; i++) {
            blockElem.insertAdjacentHTML('beforeend', child);
        }

        return blockElem;
    }

    protected render(child: string, numChildren: number) {
        this._element = this._buildTemplate(child, numChildren);
        this._gameContainer?.append(this._element);
    }

    moveDown() {
        const top = parseFloat(getComputedStyle(this._element).top);
        const bottom = parseFloat(getComputedStyle(this._element).bottom);
        if (this._moveAmount > this._distanceFromObj) {
            this._element.style.top = `${top + this._distanceFromObj}px`;
            this._distanceFromObj = 0;
        } else {
            this._element.style.top = `${top + this._moveAmount}px`;
            this._calculateDistanceFromObj();
        }
    }

    moveLeft() {
        if (!this.canMoveLeft()) return null;
        const left = this.left();
        this._element.style.left = `${left - this._moveAmount}px`;
        // recalculate distance
        this._calculateDistanceFromObj();
    }

    moveRight() {
        if (!this.canMoveRight()) return null;
        const left = this.left();
        this._element.style.left = `${left + this._moveAmount}px`;
        // recalculate distance
        this._calculateDistanceFromObj();
    }

    rotateClockWise() {
        this._element.style.transform = `rotate(${
            this._currRotationAngle + 90
        }deg)`;

        this._currRotationAngle += 90;

        this._fixCellViewOnBlockRotation();

        // recalculate distance
        this._calculateDistanceFromObj();
    }

    rotateAntiClockWise() {
        this._element.style.transform = `rotate(${
            this._currRotationAngle - 90
        }deg)`;

        this._currRotationAngle -= 90;

        this._fixCellViewOnBlockRotation();

        // recalculate distance
        this._calculateDistanceFromObj();
    }

    // becouse of outset border
    private _fixCellViewOnBlockRotation() {
        this._element.querySelectorAll('div').forEach((unit) => {
            unit.style.transform = `rotate(${-this._currRotationAngle}deg)`;
        });
    }

    notifyOnStop() {
        const event = new Event('block-stopped', { bubbles: true });
        this._element.dispatchEvent(event);
    }

    private _updateBoardXCoordsHeights() {
        const minUnitTopOffsets: { [index: number]: number } = {};
        this._element.querySelectorAll('div').forEach((unit) => {
            const xCoord = this._getUnitXCoord(unit);
            if (typeof minUnitTopOffsets[xCoord] === 'undefined') {
                minUnitTopOffsets[xCoord] = unit.offsetTop;
            } else if (minUnitTopOffsets[xCoord] > unit.offsetTop) {
                minUnitTopOffsets[xCoord] = unit.offsetTop;
            }
        });

        const blockBottom = parseFloat(getComputedStyle(this._element).bottom);

        for (const xCoordKey in minUnitTopOffsets) {
            const xCoord = parseInt(xCoordKey);
            const newXHeigth =
                blockBottom +
                this._element.offsetHeight -
                minUnitTopOffsets[xCoord];
            Board.setXHeight(xCoord, newXHeigth);
        }
    }

    private _updateBoardRows() {
        this._element.querySelectorAll('div').forEach((unit) => {
            Board.updateRows(
                this._getUnitXCoord(unit),
                this._getUnitBottom(unit),
                unit
            );
        });
    }

    private _deleteFullRows() {
        const fullRows = Board.findFullRows();
        Board.deleteFullRows(fullRows);

        // updatexHeights
        Board.decreaseXCoordsHeight(fullRows.length);

        // move everything down
        this._lowerBlocksAfterRowDelete(fullRows);
    }

    private _lowerBlocksAfterRowDelete(fullRows: number[]) {
        // no delete
        if (fullRows.length === 0) return null;

        //TODO: update Board.rows

        const lowerBy = fullRows.length * 40;
        const highestRowNumber = Math.max(...fullRows);
        const lastRowNumber = Board.lastRowNumber;

        for (let i = highestRowNumber + 40; i <= lastRowNumber; i += 40) {
            for (const xCoord in Board.rows[i]) {
                if (Board.rows[i][xCoord] === null) continue;
                Board.rows[i][
                    xCoord
                ]!.style.transform = `translateY(${lowerBy}px)`;
            }
        }

        Board.updateRowsAfterRowDelete(highestRowNumber + 40, lowerBy);
    }

    fall(timestamp: DOMHighResTimeStamp) {
        const top = parseFloat(getComputedStyle(this._element).top);

        if (this._distanceFromObj <= 0) {
            //this._element.style.bottom = '0px';
            // calc new bottom coords
            this._updateBoardXCoordsHeights();
            this._updateBoardRows();
            this._deleteFullRows();

            this.notifyOnStop();
            return null;
        }

        // only run one callback per frame
        if (this._prevRafTimestamp !== timestamp) {
            this._prevRafTimestamp = timestamp;
            this._element.style.top = `${top + this._fallingSpeed}px`;

            // recalculate distance
            this._calculateDistanceFromObj();
        }

        window.requestAnimationFrame(this.fall.bind(this));
    }

    getLeftmostUnits() {
        const units: HTMLDivElement[] = [];
        this._element.querySelectorAll('div').forEach((unit) => {
            // leftmost units have zero left offset from parent
            if (unit.offsetLeft === 0) units.push(unit);
        });
        return units;
    }

    getRightmostUnits() {
        const units: HTMLDivElement[] = [];
        this._element.querySelectorAll('div').forEach((unit) => {
            if (unit.offsetLeft === this._element.offsetWidth - 40)
                units.push(unit);
        });
        return units;
    }

    private _getContainingRows(unit: HTMLDivElement) {
        const bottom = this._getUnitBottom(unit);
        const overflow = bottom % 40;

        if (overflow === 0) {
            // only single row occuppied
            return {
                top: bottom,
                bottom: bottom,
            };
        } else {
            return {
                top: bottom - overflow + unit.offsetHeight,
                bottom: bottom - overflow,
            };
        }
    }

    canMoveLeft() {
        const leftPosition = this.left() - 40;

        //wall
        if (leftPosition === -40) return false;

        let canMove = true;

        this.getLeftmostUnits().forEach((unit) => {
            if (
                Board.rows[this._getContainingRows(unit).top][leftPosition] !==
                    null ||
                Board.rows[this._getContainingRows(unit).bottom][
                    leftPosition
                ] !== null
            ) {
                canMove = false;
            }
        });

        return canMove;
    }

    canMoveRight() {
        const rightPosition = this.left() + this._element.offsetWidth;

        // wall
        if (rightPosition === this._gameContainer!.offsetWidth) return false;

        let canMove = true;

        this.getRightmostUnits().forEach((unit) => {
            if (
                Board.rows[this._getContainingRows(unit).top][rightPosition] !==
                    null ||
                Board.rows[this._getContainingRows(unit).bottom][
                    rightPosition
                ] !== null
            ) {
                canMove = false;
            }
        });

        return canMove;
    }
}
