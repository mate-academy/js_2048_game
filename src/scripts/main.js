'use strict';

const Game = require('../modules/Game.class.js');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const scoreEl = document.querySelector('.game-score');
  const startBtn = document.querySelector('.button.start');
  const startMessageEl = document.querySelector('.message-start');
  const winMessageEl = document.querySelector('.message-win');
  const loseMessageEl = document.querySelector('.message-lose');

  // Assign unique IDs to grid cells
  document.querySelectorAll('.field-row').forEach((row, rowIndex) => {
    row.querySelectorAll('.field-cell').forEach((cell, colIndex) => {
      cell.id = `cell-${rowIndex}-${colIndex}`;
    });
  });

  let hasStarted = false;

  const updateBoard = () => {
    const board = game.getState();

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = document.getElementById(`cell-${r}-${c}`);
        const val = board[r][c];
        const newClass = `field-cell ${val === 0 ? 'empty' : `field-cell--${val}`}`;

        if (
          cell &&
          (cell.className !== newClass ||
            cell.textContent !== String(val || ''))
        ) {
          cell.className = newClass;
          cell.textContent = val || '';
        }
      }
    }
  };

  const updateScore = () => {
    scoreEl.textContent = game.getScore().toString();
  };

  const resetMessages = () => {
    startMessageEl.classList.add('hidden');
    winMessageEl.classList.add('hidden');
    loseMessageEl.classList.add('hidden');
  };

  const updateStartButton = () => {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  };

  const checkEndGame = (gameStatus) => {
    if (gameStatus === 'win') {
      winMessageEl.classList.remove('hidden');
    } else if (gameStatus === 'lose') {
      loseMessageEl.classList.remove('hidden');
    }
  };

  const processMove = (direction) => {
    if (!hasStarted) {
      return;
    }

    const gameStatus = game.getStatus();

    if (gameStatus === 'playing') {
      game.handleMove(direction);
      updateBoard();
      updateScore();
      checkEndGame(game.getStatus());
    }
  };

  const keyToDirection = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  document.addEventListener('keydown', (e) => {
    const direction = keyToDirection[e.code];

    if (direction) {
      e.preventDefault();
      processMove(direction);
    }
  });

  startBtn.addEventListener('click', () => {
    resetMessages();

    if (!hasStarted) {
      game.start();
      hasStarted = true;
      updateStartButton();
    } else {
      game.restart();
      resetMessages();
    }

    updateBoard();
    updateScore();
  });

  updateBoard();
  updateScore();
});
