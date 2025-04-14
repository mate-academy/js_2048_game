import Game from './modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  updateUI(game);

  document.addEventListener('keydown', (evt) => {
    switch (evt.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }
    updateUI(game);
  });

  document.querySelector('.start').addEventListener('click', () => {
    game.restart();
    updateUI(game);
  });
});

function updateUI(game) {}
