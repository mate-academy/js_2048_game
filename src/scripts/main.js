'use strict';

const Game = require('../modules/Game.class.js'); // dostosuj ścieżkę
const game = new Game();

// Pobranie elementów
const boardRows = document.querySelectorAll('.field-row');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  // Aktualizacja planszy
  state.forEach((row, r) => {
    row.forEach((cell, c) => {
      const td = boardRows[r].children[c];
      td.textContent = cell === 0 ? '' : cell;

      // Reset klas
      td.className = 'field-cell';
      if (cell !== 0) td.classList.add(`field-cell--${cell}`);
    });
  });

  // Wynik
  scoreEl.textContent = game.getScore();

  // Komunikaty
  if (game.getStatus() === 'win') {
    msgWin.classList.remove('hidden');
    msgLose.classList.add('hidden');
    msgStart.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    msgLose.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgStart.classList.add('hidden');
  } else if (game.getStatus() === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else {
    // playing
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    msgStart.classList.add('hidden');
  }
}

// Obsługa Start / Restart
startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
  } else {
    game.restart();
  }
  render();
});

// Obsługa strzałek
document.addEventListener('keydown', e => {
  let moved = false;
  switch (e.key) {
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
  if (moved) render();
});

// Render początkowy
render();
