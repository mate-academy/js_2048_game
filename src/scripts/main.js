'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const message = [...document.querySelectorAll('.message')];

button.addEventListener('click', () => {
  const cells = [...document.querySelectorAll('.field-cell')];

  if (button.classList.contains('restart')) {
    game.restart(cells, score);
  } else {
    game.start(cells, message);

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
});

document.addEventListener('keydown', (e) => {
  const rows = [...document.querySelectorAll('.field-row')];

  const keyPressed = e.key;

  switch (keyPressed) {
    case 'ArrowLeft': {
      game.moveLeft(rows, score);
      break;
    }

    case 'ArrowDown': {
      game.moveDown(rows, score);
      break;
    }

    case 'ArrowUp': {
      game.moveUp(rows, score);
      break;
    }

    case 'ArrowRight': {
      game.moveRight(rows, score);
      break;
    }
  }
});
