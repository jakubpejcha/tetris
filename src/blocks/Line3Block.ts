import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class Line3Block extends Block {
    constructor() {
        super('block--line block--line--3');
        this.create();
    }

    create() {
        this.render(templateCell, 3);
        this.startFalling();
    }
}
