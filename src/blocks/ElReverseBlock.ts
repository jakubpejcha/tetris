import Block from '../Block';
import templateCell from '../templates/blocks/block-cell.html';

export default class ElReverseBlock extends Block {
    constructor() {
        super('block--el-reverse');
        this.create();
    }

    create() {
        this.render(templateCell, 4);
        this.startFalling();
    }
}
