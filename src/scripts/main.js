'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let previousBoard = game.getState().map((row) => [...row]);
let lastMoveDirection = null;

function updateBoard() {
  const gameStatus = game.getStatus();
  const currentBoard = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const oldValue = previousBoard[row][col];
    const newValue = currentBoard[row][col];

    cell.style.transition = 'none';
    cell.style.transform = 'translate(0, 0) scale(1)';
    cell.className = 'field-cell';

    if (oldValue !== newValue) {
      if (oldValue === 0 && newValue !== 0) {
        cell.textContent = newValue;
        cell.classList.add(`field-cell--${newValue}`, 'field-cell--new');

        setTimeout(() => {
          cell.classList.remove('field-cell--new');
        }, 200);
      } else if (newValue !== 0 && oldValue !== 0) {
        const oldPos = findOldPosition(
          newValue,
          row,
          col,
          previousBoard,
          lastMoveDirection,
        );

        if (oldPos && (oldPos.row !== row || oldPos.col !== col)) {
          const dx = (col - oldPos.col) * 85;
          const dy = (row - oldPos.row) * 85;

          cell.style.transform = `translate(${dx}px, ${dy}px)`;
          cell.textContent = newValue;
          cell.classList.add(`field-cell--${newValue}`);

          setTimeout(() => {
            cell.style.transition = 'transform 0.1s ease';
            cell.style.transform = 'translate(0, 0) scale(1)';
          }, 20);
        } else if (oldValue !== newValue) {
          cell.textContent = newValue;
          cell.classList.add(`field-cell--${newValue}`, 'field-cell--merge');

          setTimeout(() => {
            cell.classList.remove('field-cell--merge');
          }, 200);
        }
      } else if (newValue === 0) {
        cell.textContent = '';
      }
    } else {
      cell.textContent = newValue === 0 ? '' : newValue;

      if (newValue !== 0) {
        cell.classList.add(`field-cell--${newValue}`);
      }
    }
  });

  scoreElement.textContent = game.getScore();

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  previousBoard = currentBoard.map((row) => [...row]);
}

function findOldPosition(value, newRow, newCol, oldBoard, direction) {
  if (direction === 'left') {
    for (let j = newCol + 1; j < 4; j++) {
      if (oldBoard[newRow][j] === value) {
        return { row: newRow, col: j };
      }
    }
  } else if (direction === 'right') {
    for (let j = newCol - 1; j >= 0; j--) {
      if (oldBoard[newRow][j] === value) {
        return { row: newRow, col: j };
      }
    }
  } else if (direction === 'up') {
    for (let i = newRow + 1; i < 4; i++) {
      if (oldBoard[i][newCol] === value) {
        return { row: i, col: newCol };
      }
    }
  } else if (direction === 'down') {
    for (let i = newRow - 1; i >= 0; i--) {
      if (oldBoard[i][newCol] === value) {
        return { row: i, col: newCol };
      }
    }
  }

  return null;
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    previousBoard = game.getState().map((row) => [...row]);
  } else {
    game.start();
    startMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  lastMoveDirection = null;
  updateBoard();
});

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() === 'playing') {
    switch (evt.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        game.moveLeft();
        lastMoveDirection = 'left';
        break;
      case 'arrowright':
      case 'd':
        game.moveRight();
        lastMoveDirection = 'right';
        break;
      case 'arrowup':
      case 'w':
        game.moveUp();
        lastMoveDirection = 'up';
        break;
      case 'arrowdown':
      case 's':
        game.moveDown();
        lastMoveDirection = 'down';
        break;
      default:
        return;
    }
    updateBoard();
  }
});
