'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const BOARD_SIZE = 4; // Size of the game board

const game = new Game();
const controls = document.querySelector('.controls');
const gameScore = document.querySelector('.game-score');

const tbody = document.querySelector('tbody');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const buttonRestart = document.createElement('button');
const buttonStart = document.querySelector('.start');

buttonRestart.classList.add('restart');
buttonRestart.classList.add('button');
buttonRestart.textContent = 'Restart';

buttonStart.addEventListener('click', () => {
  game.start();
  messageStart.classList.add('hidden');

  board();

  buttonStart.remove();
  controls.append(buttonRestart);
});

buttonRestart.addEventListener('click', () => {
  game.restart();
  game.start();

  board();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (buttonStart) {
    buttonStart.remove();
    controls.append(buttonRestart);
  }

  board();
});

const board = () => {
  gameScore.textContent = game.getScore();

  const rows = [...tbody.querySelectorAll('.field-row')];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
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
};
