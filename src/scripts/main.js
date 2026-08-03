'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  game
    .getState()
    .flat()
    .forEach((value, index) => {
      cells[index].textContent = value || '';

      cells[index].className = value
        ? `field-cell field-cell--${value}`
        : 'field-cell';
    });

  const gameStatus = game.getStatus();

  score.textContent = game.getScore();
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  button.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
  button.classList.toggle('start', gameStatus === 'idle');
  button.classList.toggle('restart', gameStatus !== 'idle');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (!moves[keyboardEvent.key]) {
    return;
  }

  keyboardEvent.preventDefault();
  moves[keyboardEvent.key]();
  render();
});

render();
