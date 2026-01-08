'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
let clicked = false;
let bestScoreValue = 0;
const allCells = document.querySelectorAll('.field-cell');
const scoreField = document.querySelector('.game-score');
const bestScoreField = document.querySelector('.best-score');

function drawBoard() {
  const gameField = game.getState();

  gameField.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;

      const cellElement = allCells[cellIndex];

      cellElement.textContent = '';
      cellElement.className = 'field-cell';

      if (cellValue > 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      }
    });
  });
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  removeMessage();

  if (game.getStatus() === 'idle') {
    game.start();

    if (!clicked) {
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart'; // З великої літери виглядає краще ;)
      clicked = true;
    }
  } else {
    if (game.getScore() > bestScoreValue) {
      bestScoreValue = game.getScore();

      bestScoreField.textContent = bestScoreValue;
    }
    game.restart();
  } // Запускаємо логіку (з'являться перші дві цифри)
  drawBoard(); // Малюємо їх на екрані!
  updateScore();
});

document.addEventListener('keydown', keydownEv);

function keydownEv(ev) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let madeMove = false;

  switch (ev.key) {
    case 'ArrowLeft':
      game.moveLeft();
      madeMove = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      madeMove = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      madeMove = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      madeMove = true;
      break;
    default:
      // Якщо натиснули "Enter" або "Space", нічого не робимо
      return;
  }

  if (madeMove) {
    drawBoard();
    updateScore(); // Оновлюємо рахунок (напишемо цю функцію нижче)
    checkStatus();
  }
}

function updateScore() {
  const score = game.getScore();

  scoreField.textContent = score;
}

function checkStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing' || gameStatus === 'idle') {
    return;
  }

  removeMessage();

  const messageElem = document.querySelector(`.message-${gameStatus}`);

  messageElem.classList.remove('hidden');
}

function removeMessage() {
  const allMesseges = document.querySelectorAll('.message');

  allMesseges.forEach((message) => message.classList.add('hidden'));
}

// Write your code here
