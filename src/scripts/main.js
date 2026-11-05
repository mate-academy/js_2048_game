'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const moves = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowUp: 'moveUp',
  ArrowDown: 'moveDown',
};

function render() {
  game
    .getState()
    .flat()
    .forEach((value, index) => {
      const cell = cells[index];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });

  const gameStatus = game.getStatus();
  const idle = gameStatus === 'idle';

  score.textContent = game.getScore();
  button.textContent = idle ? 'Start' : 'Restart';
  button.classList.toggle('start', idle);
  button.classList.toggle('restart', !idle);
  startMessage.classList.toggle('hidden', !idle);
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
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
  const move = moves[keyboardEvent.key];

  if (
    !move ||
    keyboardEvent.altKey ||
    keyboardEvent.ctrlKey ||
    keyboardEvent.metaKey
  ) {
    return;
  }

  keyboardEvent.preventDefault();
  game[move]();
  render();
});

render();
