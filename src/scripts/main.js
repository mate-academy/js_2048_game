'use strict';

const Game = require('../modules/Game.class.js');
const game = new Game();

const boardRows = document.querySelectorAll('.field-row');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

let firstMoveDone = false;

function render() {
  const state = game.getState();

  state.forEach((row, r) => {
    row.forEach((cell, c) => {
      const td = boardRows[r].children[c];
      td.textContent = cell === 0 ? '' : cell;

      // Usuń tylko poprzednie field-cell--* klasy
      td.classList.forEach(cls => {
        if (cls.startsWith('field-cell--')) td.classList.remove(cls);
      });

      if (cell !== 0) td.classList.add(`field-cell--${cell}`);
    });
  });

  scoreEl.textContent = game.getScore();

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
  } else if (game.getStatus() === 'playing') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }
}

// Start tylko inicjalizuje planszę, bez zmiany labelu
startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();
  } else {
    game.restart();
    firstMoveDone = false;
    startBtn.textContent = 'Start';
    startBtn.classList.add('start');
    startBtn.classList.remove('restart');
    render();
  }
});

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

  if (moved) {
    render();

    // Po pierwszym ruchu zmień przycisk
    if (!firstMoveDone) {
      startBtn.textContent = 'Restart';
      startBtn.classList.remove('start');
      startBtn.classList.add('restart');
      firstMoveDone = true;
    }
  }
});

render();
