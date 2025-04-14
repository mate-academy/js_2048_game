'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const buttonStart = document.querySelector('.start');
const score = document.querySelector('.game-score');
const tbody = document.querySelector('tbody');
// const messages = document.querySelectorAll('.message');
const mWin = document.querySelector('.message-win');
const mStart = document.querySelector('.message-start');
const mLose = document.querySelector('.message-lose');
const buttonRestart = document.createElement('button');
const controls = document.querySelector('.controls');

buttonRestart.classList.add('restart');
buttonRestart.classList.add('button');
buttonRestart.textContent = 'Restart';

buttonStart.addEventListener('click', () => {
  game.start();
  bild();
  mStart.classList.add('hidden');
});

buttonRestart.addEventListener('click', () => {
  mStart.classList.remove('hidden');
  controls.append(buttonStart);
  buttonRestart.remove();

  if (game.status === 'win') {
    mWin.classList.add('hidden');
  }

  if (game.status === 'lose') {
    mLose.classList.add('hidden');
  }

  game.restart();
  bild();
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

    bild();

    if (buttonStart) {
      buttonStart.remove();

      controls.append(buttonRestart);
    }

    if (game.status === 'win') {
      mWin.classList.remove('hidden');
    }

    if (game.status === 'lose') {
      mLose.classList.remove('hidden');
    }
  }
});

function bild() {
  score.textContent = game.getScore();

  const rows = [...tbody.querySelectorAll('.field-row')];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cells = [...rows[row].querySelectorAll('.field-cell')];

      if (game.getState()[row][col] === 0) {
        cells[col].textContent = null;

        const cl = 'field-cell';

        cells[col].className = cl;
      }

      if (game.getState()[row][col] !== 0) {
        cells[col].textContent = game.getState()[row][col];

        const cl = 'field-cell--' + game.getState()[row][col];

        cells[col].className = 'field-cell';
        cells[col].classList.add(cl);
      }
    }
  }
}
