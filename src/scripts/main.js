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
  const stat = game.getStatus();

  if (stat === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
  restart();
  message();
});

/// /// KEYS /////

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

  e.preventDefault();

  render();
  message();
  restart();
});

/// ///// MESSAGE //////

const statusStart = document.querySelector('.message-start');
const statusWin = document.querySelector('.message-win');
const statusLose = document.querySelector('.message-lose');

const container = document.querySelector('.message-container');

function message() {
  const stat = game.getStatus();

  if (stat === 'idle') {
  } else if (stat === 'playing') {
    container.classList.add('hidden');
    statusStart.classList.add('hidden');
  } else if (stat === 'win') {
    container.classList.remove('hidden');
    statusWin.classList.remove('hidden');
  } else if (stat === 'lose') {
    container.classList.remove('hidden');
    statusLose.classList.remove('hidden');
  }
}

// `idle` - the game has not started yet (the initial state);
//    * `playing` - the game is in progress;
//    * `win` - the game is won;
//    * `lose` - the game is lost

/// ///// BUTTON start/restart /////

const button = document.querySelector('.button');

function restart() {
  const stat = game.getStatus();

  if (stat === 'playing' || stat === 'win' || stat === 'lose') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}
