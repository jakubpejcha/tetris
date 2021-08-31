import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class ZigzagReverseBlock extends Block {
    constructor() {
        super('block--zigzag-reverse');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.createShadow();
        this.startFalling();
    }
}
