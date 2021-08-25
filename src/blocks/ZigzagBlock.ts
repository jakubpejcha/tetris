import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class ZigzagBlock extends Block {
    constructor() {
        super('block--zigzag');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
