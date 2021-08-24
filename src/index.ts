import './sass/main.scss';

const entity = document.querySelector<HTMLElement>('.entity');
const container = document.querySelector<HTMLElement>('.app-container');

console.log('-------------offsets:---------------');
console.log('left:', entity!.offsetLeft);
console.log('top:', entity!.offsetTop);
console.log('width:', entity!.offsetWidth);
console.log('height:', entity!.offsetHeight);
console.log('-------------sides-------------------');
console.log('left', getComputedStyle(entity as HTMLElement).left);
console.log('-------------container-------------------');
console.log('client-width', container!.clientWidth);
console.log('offset-width', container!.offsetWidth);
console.log('width', getComputedStyle(container as HTMLElement).top);

document.addEventListener('keydown', (e) => {
    const top = parseFloat(getComputedStyle(entity as HTMLElement).top);
    const left = parseFloat(getComputedStyle(entity as HTMLElement).left);
    const containerInnerWidth = container!.clientWidth;

    const bottom = parseFloat(getComputedStyle(entity as HTMLElement).bottom);

    console.log(left + entity!.offsetWidth, containerInnerWidth);
    if (bottom <= 0) return;

    if (e.key === 'ArrowDown') {
        entity!.style.top = `${top + 40}px`;
    } else if (e.key === 'ArrowUp') {
        // no up direction
        //entity!.style.top = `${top - 40}px`;
    } else if (e.key === 'ArrowLeft' && left > 0) {
        entity!.style.left = `${left - 40}px`;
    } else if (
        e.key === 'ArrowRight' &&
        left + entity!.offsetWidth < containerInnerWidth
    ) {
        entity!.style.left = `${left + 40}px`;
    }
});
