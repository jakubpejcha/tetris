import './sass/main.scss';
import CakeBlock from './blocks/CakeBlock';
import SquareBlock from './blocks/SquareBlock';
import { blockFactory } from './blockFactory';
import ElBlock from './blocks/ElBlock';
import ElReverseBlock from './blocks/ElReverseBlock';
import ZigzagBlock from './blocks/ZigzagBlock';
import ZigzagReverseBlock from './blocks/ZigzagReverseBlock';
import Line1Block from './blocks/Line1Block';
import Line2Block from './blocks/Line2Block';
import Line3Block from './blocks/Line3Block';
import Line4Block from './blocks/Line4Block';
import Board from './Board';

Board.init();

const blocks = [
    // CakeBlock,
    // SquareBlock,
    // ElBlock,
    // ElReverseBlock,
    // ZigzagBlock,
    // ZigzagReverseBlock,
    // Line1Block,
    Line2Block,
    // Line3Block,
    // Line4Block,
];

const randomBlockPicker = () => {
    const randIndex = Math.round(Math.random() * (blocks.length - 1));
    return blocks[randIndex];
};

let fallingBlock = blockFactory(randomBlockPicker());

document.addEventListener('keydown', (e) => {
    const left = fallingBlock.left();
    const right = fallingBlock.right();

    if (e.key === 'ArrowDown') {
        fallingBlock.moveDown();
    } else if (e.key === 'ArrowLeft' && left > 0) {
        fallingBlock.moveLeft();
    } else if (e.key === 'ArrowRight' && right > 0) {
        fallingBlock.moveRight();
    } else if (e.key === 'a') {
        fallingBlock.rotateAntiClockWise();
    } else if (e.key === 'd') {
        fallingBlock.rotateClockWise();
    }
});

document.addEventListener('block-stopped', () => {
    fallingBlock = blockFactory(randomBlockPicker());
});
