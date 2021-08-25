import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class Line2Block extends Block {
    constructor() {
        super('block--line block--line--2');
        this.create();
    }

    create() {
        this.render(templateCell, 2);
        this.startFalling();
    }
}
