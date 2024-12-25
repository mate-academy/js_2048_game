'use strict';

const Game = require('../modules/Game.class');
// const game = new Game();

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

// // Write your code here

const startButton = document.querySelector('.start');
const scoreScreen = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message.message-start');

startButton.addEventListener('click', () => {
  if (!game.gameStarted) {
    game.start();
    drawCells();
    startMessage.hidden = true;
    startButton.textContent = 'restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    loseMessage.style.display = 'none';
    winMessage.style.display = 'none';
  } else {
    game.restart();
    scoreScreen.textContent = game.getScore();
    loseMessage.style.display = 'none';
    winMessage.style.display = 'none';
    drawCells();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.gameStarted === false) {
    e.preventDefault();

    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    drawCells();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    drawCells();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    drawCells();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    drawCells();
  }

  if (game.getStatus() === 'win') {
    e.preventDefault();
    winMessage.style.display = 'block';
  }

  if (game.getStatus() === 'idle') {
    e.preventDefault();
  }

  if (game.getStatus() === 'lose') {
    e.preventDefault();
    loseMessage.style.display = 'block';
  }

  scoreScreen.textContent = game.getScore();
});

function drawCells() {
  const table = document.querySelector('.game-field tbody');
  const rows = table.getElementsByClassName('field-row');

  Array.from(rows).forEach((row, rowIndex) => {
    const cells = row.getElementsByClassName('field-cell');

    Array.from(cells).forEach((cell) => {
      cell.textContent = '';
    });

    const currentState = game.getState();

    Array.from(cells).forEach((cell, cellIndex) => {
      if (currentState[rowIndex][cellIndex] !== 0) {
        cell.textContent = currentState[rowIndex][cellIndex];

        for (const classItem of cell.classList) {
          if (classItem !== 'field-cell') {
            cell.classList.remove(classItem);
          }
        }

        cell.classList.add(`field-cell--${currentState[rowIndex][cellIndex]}`);
      } else {
        for (const classItem of cell.classList) {
          if (classItem !== 'field-cell') {
            cell.classList.remove(classItem);
          }
        }
      }
    });
  });
}
