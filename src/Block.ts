import { gameContainer } from './baseElements';

export default class Block {
    private readonly _gameContainer = gameContainer;
    protected readonly className: string;
    // initial blank div, will be rewritten in render
    private _element = document.createElement('div');
    private _moveAmount = 40;

    constructor(className: string) {
        this.className = className;
    }

    set moveAmount(amount: number) {
        this._moveAmount = amount;
    }

    left() {
        //return this._element.offsetLeft;
        return parseFloat(getComputedStyle(this._element).left);
    }

    right() {
        return parseFloat(getComputedStyle(this._element).right);
    }

    protected startFalling() {
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
        if (this._moveAmount > bottom) {
            this._element.style.top = `${top + bottom}px`;
        } else {
            this._element.style.top = `${top + this._moveAmount}px`;
        }
    }

    moveLeft() {
        const left = parseFloat(getComputedStyle(this._element).left);
        this._element.style.left = `${left - this._moveAmount}px`;
    }

    moveRight() {
        const left = parseFloat(getComputedStyle(this._element).left);
        this._element.style.left = `${left + this._moveAmount}px`;
    }

    notifyOnStop() {
        const event = new Event('block-stopped', { bubbles: true });
        this._element.dispatchEvent(event);
    }

    fall() {
        const top = parseFloat(getComputedStyle(this._element).top);

        if (parseFloat(getComputedStyle(this._element).bottom) <= 0) {
            this._element.style.bottom = '0px';
            this.notifyOnStop();
            return null;
        }

        this._element.style.top = `${top + 3}px`;

        window.requestAnimationFrame(this.fall.bind(this));
    }
}
