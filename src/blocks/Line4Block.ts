import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class Line4Block extends Block {
    constructor() {
        super('block--line block--line--4');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
