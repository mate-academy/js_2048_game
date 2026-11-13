'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  let game;

  try {
    game = new Game();
  } catch {
    return;
  }

  const score = document.querySelector('.game-score');
  const cells = document.querySelectorAll('.field-cell');
  const startButton = document.querySelector('.button.start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  function updateView() {
    if (!game) {
      return;
    }

    if (score) {
      score.textContent = game.getScore();
    }

    const board = game.getState();

    if (!board) {
      return;
    }

    let index = 0;

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const value = board[r][c];
        const cell = cells[index];

        if (cell) {
          cell.textContent = value === 0 ? '' : value;
          cell.className = 'field-cell';

          if (value > 0) {
            cell.classList.add(`field-cell--${value}`);
          }
        }
        index++;
      }
    }

    const gameStatus = game.getStatus();

    if (messageLose && messageWin && messageStart) {
      if (gameStatus === 'playing') {
        messageStart.classList.add('hidden');
        messageLose.classList.add('hidden');
        messageWin.classList.add('hidden');
      } else if (gameStatus === 'win') {
        messageWin.classList.remove('hidden');
      } else if (gameStatus === 'lose') {
        messageLose.classList.remove('hidden');
      } else if (gameStatus === 'idle') {
        messageStart.classList.remove('hidden');
        messageLose.classList.add('hidden');
        messageWin.classList.add('hidden');
      }
    }

    if (startButton) {
      const started = gameStatus !== 'idle';

      startButton.textContent = started ? 'Restart' : 'Start';
      startButton.classList.toggle('start', !started);
      startButton.classList.toggle('restart', started);
    }
  }

  if (startButton) {
    startButton.addEventListener('click', () => {
      const currentStatus = game.getStatus();

      if (currentStatus === 'idle') {
        game.start();
      } else {
        game.restart();
        game.start();
      }
      updateView();
    });
  }

  updateView();

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moved = game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moved = game.moveRight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moved = game.moveUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moved = game.moveDown();
    }

    if (moved) {
      updateView();
    }
  });
});
