'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const field = document.querySelectorAll('td');

// Write your code here

// #region push start listner

const pushStart = document.querySelector('.container');
const start = document.querySelector('.start');
const masageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');

pushStart.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('start') ||
    e.target.classList.contains('restart')
  ) {
    game.restart();
    game.start();

    render();
    score();

    start.textContent = 'Restart';
    start.classList.add('restart');
    start.classList.remove('start');
    start.style.fontSize = '17px';
    masageStart.classList.add('hidden');
    win.classList.add('hidden');
    lose.classList.add('hidden');
  }
});

// #endregion

// #region press the move.
function permissionToMove() {
  if (!game.hasMoves()) {
    lose.classList.remove('hidden');
    // lose.classList.add('message-lose');
  }
}

function checkWin() {
  if (game.status === 'win') {
    win.classList.remove('hidden');
  }
}

function makeMove() {
  game.findWin();
  game.generator();
  render();
  score();
  checkWin();
  permissionToMove();
}

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing' || game.status === 'win') {
    if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (game.moveUp()) {
        makeMove();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (game.moveDown()) {
        makeMove();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();

      if (game.moveLeft()) {
        makeMove();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();

      if (game.moveRight()) {
        makeMove();
      }
    }
  }
});

// #endregion

// #region render

function score() {
  gameScore.textContent = game.score;
}

function render() {
  let count = 0;
  const state = game.getState();

  for (let ind = 0; ind < state.length; ind++) {
    for (let inind = 0; inind < state[ind].length; inind++) {
      field[count].className = 'field-cell';

      if (state[ind][inind] !== 0) {
        field[count].textContent = state[ind][inind];

        field[count].classList.add(`field-cell--${state[ind][inind]}`);
      } else {
        field[count].textContent = '';
      }

      count++;
    }
  }
}

// #endregion
