'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

window.game = game;
rerenderGrid();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  const isRestart = game.button.innerHTML === 'Restart';

  if (isRestart) {
    game.restart();
    rerenderGrid();
  } else {
    game.start();
    rerenderGrid();
  }
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

  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.innerText = game.getScore();
  }
  rerenderGrid();
});

function rerenderGrid() {
  game.getState().forEach((row, index) => {
    row.forEach((value, innerIndex) => {
      // eslint-disable-next-line max-len
      const element =
        document.querySelectorAll('.field-row')[index].children[innerIndex];

      if (value !== 0) {
        element.innerText = value;
      } else {
        element.innerText = '';
      }
      element.className = '';
      element.classList.add('field-cell', `field-cell--${value}`);
    });
  });
}
