import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('button');
  const scoreEl = document.querySelector('.game-score');

  const game = new Game();

  function renderScore() {
    scoreEl.textContent = game.getScore();
  }

  btn.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    game.updateDOM();
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowLeft':
        moved = game.moveLeft();
        break;
      case 'ArrowRight':
        moved = game.moveRight();
        break;
      case 'ArrowUp':
        moved = game.moveUp();
        break;
      case 'ArrowDown':
        moved = game.moveDown();
        break;
      default:
        return;
    }

    if (moved) {
      game.updateDOM();
      renderScore();
    }
  });
});
