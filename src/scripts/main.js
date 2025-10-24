'use strict';
// src/scripts/main.js
import { Game } from '../modules/Game.class.js';

const startBtn = document.querySelector('.button.start');
const restartBtn = document.querySelector('.button.restart');
const scoreEl = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');
void messageContainer; // zapobiega błędowi 'assigned but never used'

const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const game = new Game();

let firstMoveDone = false; // flaga do zmiany przycisku po pierwszym ruchu

// Funkcja do aktualizacji UI
function render() {
  const board = game.getState();

  // Aktualizacja komórek
  const cells = document.querySelectorAll('.field-cell');
  cells.forEach((cellEl, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    // ustawienie wartości w komórce
    cellEl.textContent = value === 0 ? '' : value;

    // reset klas i dodanie dynamicznej klasy dla wartości
    cellEl.className = 'field-cell';
    if (value !== 0) {
      cellEl.classList.add(`field-cell--${value}`);
    }
  });

  // Aktualizacja wyniku
  scoreEl.textContent = game.getScore();

  // Aktualizacja statusu gry
  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else {
    winMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }

  startMessage.classList.add('hidden');

  // po pierwszym ruchu pokazujemy Restart
  if (firstMoveDone) {
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }
}

// Obsługa przycisku Start
startBtn.addEventListener('click', () => {
  game.start();
  render();
});

// Obsługa przycisku Restart
restartBtn.addEventListener('click', () => {
  game.restart();
  firstMoveDone = false;
  startBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  render();
});

// Obsługa klawiszy strzałek
document.addEventListener('keydown', (evt) => {
  let moved = false;

  switch (evt.key) {
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
    default:
      return;
  }

  if (moved && !firstMoveDone) {
    firstMoveDone = true; // ustawiamy flagę po pierwszym udanym ruchu
  }

  render();
});
