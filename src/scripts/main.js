'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let hasMoved = false;

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  if (hasMoved) {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addKeyborardEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();

    return;
  }

  if (hasMoved) {
    game.restart();
    hasMoved = false;

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    startMessage.classList.remove('hidden');

    render();
  }
});

document.addKeyborardEventListener('keydown', (KeyborardEvent) => {
  const moves = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  const move = moves[KeyborardEvent.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  KeyborardEvent.prKeyborardEventDefault();

  const previousState = JSON.stringify(game.getState());

  game[move]();

  const currentState = JSON.stringify(game.getState());

  if (previousState !== currentState) {
    hasMoved = true;
    render();
  }
});

render();
