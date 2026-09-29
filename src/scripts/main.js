'use strict';

// // Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// console.log(game);
// console.log(game.getStatus());

// const board = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

const score = document.querySelector('.game-score');
const start = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const index = rowIndex * 4 + columnIndex;

      cells[index].textContent = value;
      cells[index].className = 'field-cell';

      if (value !== 0) {
        cells[index].classList.add(`field-cell--${value}`);
      }
    });
  });

  score.textContent = game.getScore();
}

render();

start.addEventListener('click', () => {
  game.start();
  render();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else {
    return;
  }

  event.preventDefault();
  render();
});
