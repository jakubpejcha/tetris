import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class SquareBlock extends Block {
    constructor() {
        super('block--square');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
