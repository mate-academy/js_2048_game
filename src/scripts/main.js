'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const moves = new Map([
  ['ArrowLeft', () => game.moveLeft()],
  ['ArrowRight', () => game.moveRight()],
  ['ArrowUp', () => game.moveUp()],
  ['ArrowDown', () => game.moveDown()],
]);

let hasMoved = false;

function render() {
  const gameStatus = game.getStatus();
  const tiles = game.getState().flat();

  tiles.forEach((tile, index) => {
    const cell = cells[index];
    const previousTile = cell.textContent;

    if (previousTile) {
      cell.classList.remove(`field-cell--${previousTile}`);
    }

    cell.textContent = tile || '';

    if (tile) {
      cell.classList.add(`field-cell--${tile}`);
    }
  });

  score.textContent = game.getScore();
  button.classList.toggle('start', !hasMoved);
  button.classList.toggle('restart', hasMoved);
  button.textContent = hasMoved ? 'Restart' : 'Start';
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  if (hasMoved) {
    game.restart();
    hasMoved = false;
  } else {
    game.start();
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const move = moves.get(keyEvent.key);

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  keyEvent.preventDefault();

  if (move()) {
    hasMoved = true;
    render();
  }
});

render();
