'use strict';

const Game = require('../modules/Game.class.js');
// import Game from '../modules/Game.class';

const game = new Game();

const tab = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const btnStart = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  score.textContent = game.getScore();

  const board = game.getState();
  const statusGame = game.getStatus();

  board.forEach((row, r) => {
    row.forEach((col, c) => {
      const cell = tab.rows[r].cells[c];

      // 1. Сбрасываем классы ячейки к базовому, чтобы убрать предыдущие цвета
      cell.className = 'field-cell';

      // 2. Если в ячейке есть число — ставим текст и класс цвета
      if (col === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = col;
        cell.classList.add(`field-cell--${col}`);
      }
    });
  });

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  switch (statusGame) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'playing':
      break;
  }

  btnStart.classList.toggle('restart', statusGame !== 'idle');
  btnStart.classList.toggle('start', statusGame === 'idle');

  btnStart.textContent = statusGame === 'idle' ? 'Start' : 'Restart';
}

render();

btnStart.addEventListener('click', (e) => {
  game.start();
  render();
});

window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
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
});
