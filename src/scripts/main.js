'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const controls = document.querySelector('.controls');
const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.start');
const tbody = document.querySelector('tbody');
const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
const start = document.querySelector('.message-start');
const buttonRestart = document.createElement('button');

buttonRestart.classList.add('restart');
buttonRestart.classList.add('button');
buttonRestart.textContent = 'Restart';

buttonStart.addEventListener('click', () => {
  game.start();
  start.classList.add('hidden');
  updateBoard();
  buttonStart.remove();
  controls.append(buttonRestart);
});

buttonRestart.addEventListener('click', () => {
  game.restart();
  game.start();
  updateBoard();
  win.classList.add('hidden');
  lose.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing') {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    if (buttonStart) {
      buttonStart.remove();

      controls.append(buttonRestart);
    }

    if (game.status === 'win') {
      win.classList.remove('hidden');
    }

    if (game.status === 'lose') {
      lose.classList.remove('hidden');
    }

    updateBoard();
  }
});

function updateBoard() {
  score.textContent = game.getScore();

  const rows = [...tbody.querySelectorAll('.field-row')];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cells = [...rows[i].querySelectorAll('.field-cell')];

      if (game.getState()[i][j] === 0) {
        cells[j].textContent = null;
        cells[j].className = 'field-cell';
      }

      if (game.getState()[i][j] !== 0) {
        cells[j].textContent = game.getState()[i][j];
        cells[j].className = 'field-cell';
        cells[j].classList.add('field-cell--' + game.getState()[i][j]);
      }
    }
  }
}
