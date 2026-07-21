'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const cells = [...document.querySelectorAll('.field-cell')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const directions = {
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

  score.textContent = game.getScore();
  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');
  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');

  const hasStarted = game.getStatus() !== 'idle';

  button.textContent = hasStarted ? 'Restart' : 'Start';
  button.classList.toggle('start', !hasStarted);
  button.classList.toggle('restart', hasStarted);
}

function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
}

button.addEventListener('click', startGame);

document.addEventListener('keydown', (keyEvent) => {
  const moveMethod = directions[keyEvent.key];

  if (!moveMethod || game.getStatus() !== 'playing') {
    return;
  }

  keyEvent.preventDefault();
  game[moveMethod]();
  render();
});

render();
