'use strict';

import Game from '../modules/Game.class';
import { BOARD_SIZE } from '../modules/constants';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const btn = document.querySelector('.button');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function hide(el) {
  el.classList.add('hidden');
}

function show(el) {
  el.classList.remove('hidden');
}

function clearCellClasses(td) {
  // оставляем базовый field-cell, убираем field-cell--число
  td.className = 'field-cell';
}

function render() {
  const state = game.getState();

  // score
  scoreEl.textContent = String(game.getScore());

  // board
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const value = state[r][c];
      const td = cells[r * BOARD_SIZE + c];

      clearCellClasses(td);

      if (value) {
        td.textContent = String(value);
        td.classList.add(`field-cell--${value}`);
        td.classList.add('tile-appear');

        setTimeout(() => {
          td.classList.remove('tile-appear');
        }, 150);
      } else {
        td.textContent = '';
      }
    }
  }

  // messages
  hide(msgStart);
  hide(msgWin);
  hide(msgLose);

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    show(msgStart);
  }

  if (gameStatus === 'win') {
    show(msgWin);
  }

  if (gameStatus === 'lose') {
    show(msgLose);
  }
}

function setButtonToRestart() {
  btn.classList.remove('start');
  btn.classList.add('restart');
  btn.textContent = 'Restart';
}

function setButtonToStart() {
  btn.classList.remove('restart');
  btn.classList.add('start');
  btn.textContent = 'Start';
}

btn.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
    setButtonToRestart();
    render();

    return;
  }

  game.restart();
  setButtonToRestart();
  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  let moved = false;

  if (key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    setButtonToRestart();
    render();
  }
});

setButtonToStart();
render();
