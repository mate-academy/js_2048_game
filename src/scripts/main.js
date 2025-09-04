'use strict';

// import klasy Game z modułu
import { Game } from '../modules/Game.class.js';

// tworzysz instancję gry
const game = new Game();

// pobranie elementów HTML
const cells = document.querySelectorAll('.game-field .field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// funkcja aktualizująca planszę i wyświetlająca kafelki
function renderBoard() {
  const state = game.getState();

  state.forEach((row, r) => {
    row.forEach((cellValue, c) => {
      const cellEl = cells[r * 4 + c];

      cellEl.textContent = cellValue === 0 ? '' : cellValue;
      cellEl.className = 'field-cell';

      if (cellValue !== 0) {
        cellEl.classList.add(`field-cell--${cellValue}`);
      }
    });
  });

  // aktualizacja wyniku
  scoreEl.textContent = game.getScore();

  // komunikaty
  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'won');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'over');

  // aktualizacja przycisku Start/Restart
  startBtn.textContent = game.getStatus() === 'idle' ? 'Start' : 'Restart';
  startBtn.classList.toggle('start', game.getStatus() === 'idle');
  startBtn.classList.toggle('restart', game.getStatus() !== 'idle');
}

// Start / Restart gry
startBtn.addEventListener('click', () => {
  game.start();
  renderBoard();
});

// obsługa strzałek klawiatury
document.addEventListener('keydown', (e) => {
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
    default:
      return; // ignoruj inne klawisze
  }

  // po ruchu renderujemy planszę
  renderBoard();
});
