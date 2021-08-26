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
        console.log('distances:', distances);

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
        console.log(this._distanceFromObj);

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
        const left = parseFloat(getComputedStyle(this._element).left);
        this._element.style.left = `${left - this._moveAmount}px`;
        // recalculate distance
        this._calculateDistanceFromObj();
    }

    moveRight() {
        const left = parseFloat(getComputedStyle(this._element).left);
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

            // TODO: wrong height, does not count for empty cells
            //Board.setXHeight(xCoord, unit.offsetHeight);
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

    fall(timestamp: DOMHighResTimeStamp) {
        const top = parseFloat(getComputedStyle(this._element).top);

        if (this._distanceFromObj <= 0) {
            //this._element.style.bottom = '0px';
            // calc new bottom coords
            this._updateBoardXCoordsHeights();

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
}
