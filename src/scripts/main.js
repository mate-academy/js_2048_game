import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('keydown', (eve) => {
  if (game.status !== 'running') {
    return;
  }

  if (eve.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (eve.key === 'ArrowRight') {
    game.moveRight();
  } else if (eve.key === 'ArrowUp') {
    game.moveUp();
  } else if (eve.key === 'ArrowDown') {
    game.moveDown();
  }
});

document.querySelector('.start').addEventListener('click', () => {
  game.start();
});

document.querySelector('.restart').addEventListener('click', () => {
  game.restart();
});
