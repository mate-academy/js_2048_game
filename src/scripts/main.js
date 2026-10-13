'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let hasMoved = false;

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = state[row][column];

    cell.textContent = value || '';

    [...cell.classList].forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function setButtonForRestart() {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

function setButtonForStart() {
  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');
}

function handleMove(move) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const stateBeforeMove = game.getState();

  move();

  const stateAfterMove = game.getState();
  let changed = false;

  for (let row = 0; row < stateAfterMove.length && !changed; row++) {
    for (let column = 0; column < stateAfterMove[row].length; column++) {
      if (stateAfterMove[row][column] !== stateBeforeMove[row][column]) {
        changed = true;
        break;
      }
    }
  }

  if (changed) {
    hasMoved = true;
    setButtonForRestart();
  }

  render();
}

startButton.addEventListener('click', () => {
  if (hasMoved) {
    game.restart();
    hasMoved = false;
    setButtonForStart();
  } else if (game.getStatus() === 'idle') {
    game.start();
  }

  render();
});

const movesByKey = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (keyboardEvent) => {
  const move = movesByKey[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();
  handleMove(move);
});

render();
