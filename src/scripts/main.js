'use strict';
// Uncomment the next lines to use your game instance in the browser

import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    startGame(game);
    render(game);
  } else {
    if (e.target.classList.contains('restart')) {
      restartGame(game);
      render(game);
    }
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      render(game);

      return;

    case 'ArrowRight':
      game.moveRight();
      render(game);

      return;

    case 'ArrowDown':
      game.moveDown();
      render(game);

      return;

    case 'ArrowUp':
      game.moveUp();
      render(game);
  }
});

function startGame(currentGame) {
  currentGame.start();
  switchButtons(currentGame);
}

function restartGame(currentGame) {
  currentGame.restart();
  switchButtons(currentGame);
}

function visualScore(currentGame) {
  const score = document.querySelector('span.game-score');

  score.textContent = currentGame.getScore();
}

function message(currentGame) {
  const messageWin = document.querySelector('p.message-win');
  const messageLose = document.querySelector('p.message-lose');
  const messageStart = document.querySelector('p.message-start');

  switch (currentGame.getStatus()) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      break;

    case 'idle':
      messageStart.classList.add('hidden');
      break;

    case 'playing':
      if (!messageWin.classList.contains('hidden')) {
        messageWin.classList.add('hidden');
      }

      if (!messageLose.classList.contains('hidden')) {
        messageLose.classList.add('hidden');
      }

      if (!messageStart.classList.contains('hidden')) {
        messageStart.classList.add('hidden');
      }
      break;
  }
}

function switchButtons(currentGame) {
  const button = document.querySelector('button');

  if (currentGame.getStatus() === 'idle') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

function visualisation(currentGame) {
  const board = currentGame.getState();
  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tr');

  for (let i = 0; i < board.length; i++) {
    const cells = rows[i].querySelectorAll('td');

    for (let j = 0; j < board[i].length; j++) {
      const cell = cells[j];
      const value = board[i][j];

      if (value > 0) {
        cell.className = 'field-cell';
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.className = 'field-cell';
        cell.textContent = '';
      }
    }
  }
}

function render(currentGame) {
  visualisation(currentGame);
  visualScore(currentGame);
  message(currentGame);
  switchButtons(currentGame);
}
