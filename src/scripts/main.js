'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const gameScore = document.querySelector('.game-score');
  const gameBoard = document.querySelector('.game-field');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  function updateUI() {
    gameScore.textContent = game.getScore();

    const board = game.getState();
    const cells = gameBoard.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const value = board[row][col];

      cells[i].className = 'field-cell';

      if (value !== 0) {
        cells[i].classList.add(`field-cell--${value}`);
        cells[i].textContent = value;
      } else {
        cells[i].textContent = '';
      }
    }

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
      messageStart.classList.add('hidden');
    } else if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
    } else {
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }

  function startGame() {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    messageStart.classList.add('hidden');
    updateUI();
  }

  function restartGame() {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    initializeGame();
  }

  function initializeGame() {
    const cells = gameBoard.getElementsByTagName('td');

    for (const cell of cells) {
      cell.className = 'field-cell';
      cell.textContent = '';
    }

    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    messageStart.classList.remove('hidden');
    updateUI();
  }

  startButton.addEventListener('click', () => {
    if (startButton.textContent === 'Start') {
      startGame();
    } else {
      restartGame();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        moved = true;
        break;
      case 'ArrowRight':
        game.moveRight();
        moved = true;
        break;
      case 'ArrowUp':
        game.moveUp();
        moved = true;
        break;
      case 'ArrowDown':
        game.moveDown();
        moved = true;
        break;
    }

    if (moved) {
      updateUI();

      if (!canMove(game.getState())) {
        game.status = 'lose';
        updateUI();
      }

      if (has2048(game.getState())) {
        game.status = 'win';
        updateUI();
      }
    }
  });

  function canMove(board) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return true;
        }

        if (i !== 3 && board[i][j] === board[i + 1][j]) {
          return true;
        }

        if (j !== 3 && board[i][j] === board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  function has2048(board) {
    for (const row of board) {
      if (row.includes(2048)) {
        return true;
      }
    }

    return false;
  }

  initializeGame();
});
