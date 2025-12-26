'use strict';

const startButton = document.querySelector('.start');
const scoreEl = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = [...document.querySelectorAll('.field-cell')];

const Game = require('../modules/Game.class');
const game = new Game();

game.onChange((board, score, gameStatus) => {
  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const val = board[r][c];

    cell.textContent = val || '';
    cell.className = 'field-cell';

    if (val) {
      cell.classList.add(`field-cell--${val}`);
    }
  });

  scoreEl.textContent = score;

  startMessage.classList.add('hidden');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  }

  if (gameStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }

  if (gameStatus === 'win' || gameStatus === 'lose') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  if (map[e.key]) {
    game.move(map[e.key]);
  }
});
