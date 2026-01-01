'use strict';

import Game from '../modules/Game.class.js';

// ------------------------------
// ELEMENTY DOM
// ------------------------------
const game = new Game();

const startButton = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// ------------------------------
// RENDER PLANSZY
// ------------------------------
function render() {
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    // Usuń stare klasy wartości, zachowując field-cell
    cell.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        cell.classList.remove(cls);
      }
    });

    // Dodaj klasę dla aktualnej wartości, jeśli nie jest 0
    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }

    // Wyświetl wartość
    cell.textContent = value || '';
  });

  scoreEl.textContent = game.getScore();
}

// ------------------------------
// START / RESTART GRY
// ------------------------------
function toggleGame() {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }

  render();
}

startButton.addEventListener('click', toggleGame);

// ------------------------------
// OBSŁUGA RUCHÓW STRZAŁKAMI
// ------------------------------
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault(); // zapobiega przewijaniu strony
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

  render();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
});

// ------------------------------
// POCZĄTKOWE RENDEROWANIE
// ------------------------------
render();
