import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class CakeBlock extends Block {
    constructor() {
        super('block--cake');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
