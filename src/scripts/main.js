/* eslint-disable max-len */
'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const board = document.querySelector('.game-field tbody');
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function renderBoard() {
  const state = game.getState();

  state.forEach((line, index) => {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    line.forEach((item) => {
      const td = document.createElement('td');

      td.classList.add('field-cell');

      if (item) {
        td.classList.add(`field-cell--${item}`);
      }

      td.textContent = item || '';

      tr.appendChild(td);
    });

    board.replaceChild(tr, board.rows[index]);
  });
  scoreElement.textContent = game.getScore().toString();
}

const handleStart = () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    startMessage.classList.add('hidden');
    renderBoard();
  }

  if (currentStatus === 'playing') {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'Start';
    startMessage.classList.toggle('hidden');
    renderBoard();
  }
};

function updateMessages() {
  const newStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (newStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (newStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', handleStart);

document.addEventListener('keydown', (evt) => {
  // слухати подію keydown перевіряти event.key і викликати відповідний метод екземпляра
  switch (evt.key) {
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
    default:
      return;
  }
  renderBoard();
  updateMessages();
});

export default Game;
