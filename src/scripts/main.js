'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  game.start();
  rerenderGrid();
});

document.addEventListener('keydown', ({ key }) => {
  if (key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (key === 'ArrowRight') {
    game.moveRight();
  }

  if (key === 'ArrowUp') {
    game.moveUp();
  }

  if (key === 'ArrowDown') {
    game.moveDown();
  }

  rerenderGrid();
});

function rerenderGrid() {
  game.getState().forEach((row, index) => {
    row.forEach((value, innerIndex) => {
      const element
      = document.querySelectorAll('.field-row')[index].children[innerIndex];

      element.innerText = value;

      element.className = '';
      element.classList.add('field-cell', `field-cell--${value}`);
    });
  });
}
