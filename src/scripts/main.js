'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Запуск гри
game.updateBoard();

// Додавання обробників подій
document.addEventListener('keydown', (e) => {
  const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (allowedKeys.includes(event.key)) {
    game.move(e.key);
  }
});

document.querySelector('.start').addEventListener('click', () => {
  game.start();
});
