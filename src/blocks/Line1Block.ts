import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class Line1Block extends Block {
    constructor() {
        super('block--line block--line--1');
        this.create();
    }

    create() {
        this.render(templateCell, 1);
        this.startFalling();
    }
}
