import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class ElBlock extends Block {
    constructor() {
        super('block--el');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
