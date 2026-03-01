'use strict';
import { Game } from './game2048.js';
import { isArrowButton } from './utils.js';
import {
  startBtn,
  applyCollorChip,
  winMessage,
  loseMessage,
  deleteMessagesAll,
  startMessage,
  board,
} from './utils-html.js';

const game = new Game();

const dateState = game.getState();

if (dateState) {
  game.applyState(dateState);
  game.renderHtmlChip();
  game.updateStatus();

  if (game.getStatus() === 'lose') {
    loseMessage();
  }

  if (game.getStatus() === 'win') {
    winMessage();
  }

  startBtn.textContent = 'Restart';
  startBtn.classList.replace('start-mode', 'restart');
}

document.addEventListener('keydown', (ev) => {
  const direction = ev.key; // direction arrow.

  startedGame(direction);
});

function startedGame(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (!isArrowButton(direction)) {
    return;
  } // checking direction

  if (!game.moveMap[direction]()) {
    return;
  } // get moving

  game.resetMergeFlags();
  game.renderMoveHtmlChip();
  game.createChip();
  applyCollorChip(game.arrChip);
  game.updateStatus();
  game.saveState();

  if (game.getStatus() === 'win') {
    winMessage();
  }

  if (game.getStatus() === 'lose') {
    loseMessage();
  }
}

let startX = 0;
let startY = 0;

board.addEventListener('touchstart', (e) => {
  const touch = e.changedTouches[0];

  startX = touch.clientX;
  startY = touch.clientY;
});

board.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];

  const endX = touch.clientX;
  const endY = touch.clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  let directionFromAEL = '';

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      directionFromAEL = 'ArrowRight';
    } else {
      directionFromAEL = 'ArrowLeft';
    }
  } else {
    if (deltaY > 0) {
      directionFromAEL = 'ArrowDown';
    } else {
      directionFromAEL = 'ArrowUp';
    }
  }
  startedGame(directionFromAEL);
});

// click start button
startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start-mode')) {
    game.start();
    deleteMessagesAll();

    startBtn.textContent = 'Restart';
    startBtn.classList.replace('start-mode', 'restart');
  } else if (startBtn.classList.contains('restart')) {
    game.restart();
    deleteMessagesAll();
    startMessage();

    startBtn.textContent = 'Start';
    startBtn.classList.replace('restart', 'start-mode');
  }
});

//! Какой то комент
// TODO Какой то комент
// ? Какой то комент
// Обычная заметка (дополнительная)

// ? - Оператор a ||= b 👉 Логическое присваивание OR Логика:
/* если a truthy → ничего не происходит
если a falsy → в a запишется b
Важно:
b НЕ выполнится, если a === true (короткое замыкание)
 */
// ? Метод some()
/*
Array.prototype.some()
👉 возвращает true, если ХОТЯ БЫ ОДИН элемент дал true
arr.some(item => item > 5);
остановится сразу, как найдёт true
если все false → вернёт false */
// ? Метод every()
/*
Array.prototype.every()
👉 возвращает true, если ВСЕ элементы дали true
arr.every(item => item > 0);
остановится на первом false
если массив пуст → true (важно!)
*/
