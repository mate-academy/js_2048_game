'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// scripts/main.js
import { Game } from '../modules/Game.class.js';

// Selectores
const fieldEl = document.querySelector('.game-field tbody');
const scoreEl = document.querySelector('.game-score');
const actionBtn = document.querySelector('.button.start');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

const game = new Game();

// Convierte el board a HTML
function renderBoard(board) {
  const rows = fieldEl.querySelectorAll('tr');

  for (let r = 0; r < 4; r++) {
    const cells = rows[r].querySelectorAll('td');

    for (let c = 0; c < 4; c++) {
      const val = board[r][c];
      const cell = cells[c];
      // limpiar clases anteriores

      cell.className = 'field-cell';

      if (val) {
        cell.textContent = val;
        cell.classList.add(`field-cell--${val}`);
      } else {
        cell.textContent = '';
      }
    }
  }
}

function render() {
  renderBoard(game.getState());
  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  // Mensajes
  startMsg?.classList.toggle('hidden', gameStatus !== 'idle');
  winMsg?.classList.toggle('hidden', gameStatus !== 'win');
  loseMsg?.classList.toggle('hidden', gameStatus !== 'lose');

  // Botón
  if (gameStatus === 'idle') {
    actionBtn.textContent = 'Start';
    actionBtn.classList.add('start');
    actionBtn.classList.remove('restart');
  } else {
    actionBtn.textContent = 'Restart';
    actionBtn.classList.remove('start');
    actionBtn.classList.add('restart');
  }
}

function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
    render();
  } else {
    game.restart();
    render();
  }
}

// Botón Start/Restart
actionBtn.addEventListener('click', startGame);

// Manejo de flechas
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    render();
  }
});

// Render inicial
render();
