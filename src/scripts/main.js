/* eslint-disable prettier/prettier */
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game([
  [2, 0, 0, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const startButton = document.querySelector('.start');

/* ========= RENDER DO TABULEIRO ========= */
function render(board) {
  const cells = document.querySelectorAll('.field-cell');

  board.flat().forEach((value, index) => {
    const cell = cells[index];

    // remove apenas classes de valor
    cell.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        cell.classList.remove(cls);
      }
    });

    cell.textContent = value === 0 ? '' : value;

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();
}

/* ========= RENDER DAS MENSAGENS ========= */
function renderStatus() {
  const stats = game.getStatus();

  const messages = {
    idle: document.querySelector('.message-start'),
    playing: document.querySelector('.message-playing'),
    win: document.querySelector('.message-win'),
    lose: document.querySelector('.message-lose'),
  };

  Object.values(messages).forEach((message) =>
    message.classList.add('hidden'));

  messages[stats].classList.remove('hidden');
}

/* ========= RENDER DO BOTÃO ========= */
function renderButton() {
  const button = document.querySelector('.button');
  const stats = game.getStatus();

  // limpa estados
  button.classList.remove('start', 'restart');

  if (stats === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
  }
}

/* ========= CLICK NO BOTÃO ========= */
startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render(game.getState());
  renderStatus();
  renderButton();
});


/* ========= CONTROLES DO TECLADO ========= */
document.addEventListener('keydown', (thisEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (thisEvent.key) {
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

  render(game.getState());
  renderStatus();
  renderButton();
});

/* ========= ESTADO INICIAL ========= */
render(game.getState());
renderStatus();
renderButton();
