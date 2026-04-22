'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const butt = document.querySelector('button');
const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  if (game.loseCheck() === true) {
    game.status = 'lost';
    messageLose.classList.remove('hidden');
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    render();
    game.loseCheck();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    render();
    game.loseCheck();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    render();
    game.loseCheck();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    render();
    game.loseCheck();
  }
});

butt.addEventListener('click', () => {
  if (butt.classList.contains('start')) {
    game.status = 'playing';
    game.start();
    butt.textContent = 'Restart';
    butt.classList.remove('start');
    butt.classList.add('restart');
    messageStart.classList.add('hidden');
    render();
  } else if (butt.classList.contains('restart')) {
    game.status = 'idle';
    messageStart.classList.remove('hidden');
    butt.classList.remove('restart');
    messageWin.classList.add('hidden');
    butt.classList.add('start');
    butt.textContent = 'Start';
    messageLose.classList.add('hidden');
    game.score = 0;
    game.restart();
    render();
  }
});

const render = () => {
  const rows = table.querySelectorAll('tr');

  score.textContent = game.score;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      const value = game.board[i][j];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        game.status = 'won';
        messageWin.classList.remove('hidden');
      }
    }
  }
};
