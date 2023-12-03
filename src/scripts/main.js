'use strict';

const cell11 = document.getElementById('1_1');
const cell12 = document.getElementById('1_2');
const cell13 = document.getElementById('1_3');
const cell14 = document.getElementById('1_4');

const cell21 = document.getElementById('2_1');
const cell22 = document.getElementById('2_2');
const cell23 = document.getElementById('2_3');
const cell24 = document.getElementById('2_4');

const cell31 = document.getElementById('3_1');
const cell32 = document.getElementById('3_2');
const cell33 = document.getElementById('3_3');
const cell34 = document.getElementById('3_4');

const cell41 = document.getElementById('4_1');
const cell42 = document.getElementById('4_2');
const cell43 = document.getElementById('4_3');
const cell44 = document.getElementById('4_4');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const score = document.querySelector('.game-score');
let currentScore = 0;

score.textContent = currentScore;

const board = [
  cell11, cell12, cell13, cell14,
  cell21, cell22, cell23, cell24,
  cell31, cell32, cell33, cell34,
  cell41, cell42, cell43, cell44,
];

document.querySelector('button').addEventListener('click', buttons);
document.addEventListener('keydown', arrow => arrowTracking(arrow));

function buttons() {
  const button = document.querySelector('button');

  if (button.textContent === 'Start') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';

    messageStart.classList.add('hidden');

    addRandomCell();
    addRandomCell();
  } else {
    score.textContent = 0;

    board.forEach(cell => {
      cell.classList = ['field-cell'];
      cell.textContent = '';
    });

    button.classList.remove('restart');
    button.classList.add('start');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
  }
};

function randomCell() {
  let randomIndex = Math.floor(Math.random() * board.length);
  let randomElement = board[randomIndex];

  while (randomElement.classList.length >= 2) {
    randomIndex = Math.floor(Math.random() * board.length);
    randomElement = board[randomIndex];
  };

  return randomElement;
};

function randomNumber() {
  const randomNumb = Math.floor(Math.random() * 100);

  return randomNumb < 90 ? 2 : 4;
};

function addRandomCell() {
  const randomEl = randomCell();
  const randomNum = randomNumber();

  randomEl.classList.add(`field-cell--${randomNum}`);
  randomEl.textContent = randomNum;
};

function arrowTracking(arrow) {
  const key = arrow.code;

  switch (key) {
    case 'ArrowUp':
      processElements('up');
      break;
    case 'ArrowRight':
      processElements('right');
      break;
    case 'ArrowDown':
      processElements('down');
      break;
    case 'ArrowLeft':
      processElements('left');
      break;
    default:
      break;
  }
};

function processElements(direction) {
  let moved = false;

  switch (direction) {
    case 'up':
      for (let i = 4; i <= 15; i++) {
        if (board[i].classList.length > 1) {
          let currentIndex = i;

          while (
            currentIndex >= 4
            && board[currentIndex - 4].textContent === ''
          ) {
            currentIndex -= 4;
          }

          if (
            currentIndex >= 4
            && board[currentIndex - 4].textContent === board[i].textContent
          ) {
            board[currentIndex - 4].textContent *= 2;
            board[currentIndex - 4].classList = [`field-cell field-cell--${board[currentIndex - 4].textContent}`];

            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            currentScore = parseInt(board[currentIndex - 4].textContent, 10);

            score.textContent = (parseInt(score.textContent, 10)
              + currentScore).toString();

            moved = true;
          } else if (currentIndex !== i) {
            board[currentIndex].classList = [`field-cell field-cell--${board[i].textContent}`];
            board[currentIndex].textContent = board[i].textContent;
            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            moved = true;
          }
        }
      }
      break;
    case 'down':
      for (let i = 11; i >= 0; i--) {
        if (board[i].classList.length > 1) {
          let currentIndex = i;

          while (
            currentIndex + 4 <= 15
            && board[currentIndex + 4].textContent === ''
          ) {
            currentIndex += 4;
          }

          if (
            currentIndex + 4 <= 15
            && board[currentIndex + 4].textContent === board[i].textContent
          ) {
            board[currentIndex + 4].textContent *= 2;
            board[currentIndex + 4].classList = [`field-cell field-cell--${board[currentIndex + 4].textContent}`];

            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            currentScore = parseInt(board[currentIndex + 4].textContent, 10);

            score.textContent = (parseInt(score.textContent, 10)
              + currentScore).toString();

            moved = true;
          } else if (currentIndex !== i) {
            board[currentIndex].classList = [`field-cell field-cell--${board[i].textContent}`];
            board[currentIndex].textContent = board[i].textContent;
            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            moved = true;
          }
        }
      }
      break;
    case 'right':
      for (let i = 14; i >= 0; i--) {
        if (board[i].classList.length > 1) {
          let currentIndex = i;

          while (
            currentIndex < 15
            && currentIndex !== 3
            && currentIndex !== 7
            && currentIndex !== 11
            && board[currentIndex + 1].textContent === ''
          ) {
            currentIndex++;
          }

          if (
            currentIndex < 15
            && currentIndex !== 3
            && currentIndex !== 7
            && currentIndex !== 11
            && board[currentIndex + 1].textContent === board[i].textContent
          ) {
            board[currentIndex + 1].textContent *= 2;
            board[currentIndex + 1].classList = [`field-cell field-cell--${board[currentIndex + 1].textContent}`];

            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            currentScore = parseInt(board[currentIndex + 1].textContent, 10);

            score.textContent = (parseInt(score.textContent, 10)
              + currentScore).toString();

            moved = true;
          } else if (currentIndex !== i) {
            board[currentIndex].classList = [`field-cell field-cell--${board[i].textContent}`];
            board[currentIndex].textContent = board[i].textContent;
            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            moved = true;
          }
        }
      }
      break;
    case 'left':
      for (let i = 1; i <= 15; i++) {
        if (board[i].classList.length > 1) {
          let currentIndex = i;

          while (
            currentIndex > 0
            && currentIndex !== 4
            && currentIndex !== 8
            && currentIndex !== 12
            && board[currentIndex - 1].textContent === ''
          ) {
            currentIndex--;
          }

          if (
            currentIndex > 0
            && currentIndex !== 4
            && currentIndex !== 8
            && currentIndex !== 12
            && board[currentIndex - 1].textContent === board[i].textContent
          ) {
            board[currentIndex - 1].textContent *= 2;
            board[currentIndex - 1].classList = [`field-cell field-cell--${board[currentIndex - 1].textContent}`];

            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            currentScore = parseInt(board[currentIndex - 1].textContent, 10);

            score.textContent = (parseInt(score.textContent, 10)
              + currentScore).toString();

            moved = true;
          } else if (currentIndex !== i) {
            board[currentIndex].classList = [`field-cell field-cell--${board[i].textContent}`];
            board[currentIndex].textContent = board[i].textContent;
            board[i].classList = ['field-cell'];
            board[i].textContent = '';

            moved = true;
          }
        }
      }
      break;
  }

  if (moved) {
    addRandomCell();
    checkingSituations(moved);
  }
};

function checkingSituations() {
  const checkBoard = [...board];

  checkBoard.forEach(cell => {
    if (cell.textContent === '2048') {
      messageWin.classList.remove('hidden');
    }
  });

  const checkLoss = checkBoard.filter(cell => cell.classList.length > 1);

  if (checkLoss.length === 16) {
    if (!hasAdjacentEqualValue()) {
      messageLose.classList.remove('hidden');
      document.removeEventListener('keydown', arrow => arrowTracking(arrow));
    }
  }
}

function hasAdjacentEqualValue() {
  for (let index = 0; index < board.length; index++) {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const neighbors = [
      { row: row, col: col - 1 }, // слева
      { row: row, col: col + 1 }, // справа
      { row: row - 1, col: col }, // сверху
      { row: row + 1, col: col }, // снизу
    ];

    for (const neighbor of neighbors) {
      const neighborIndex = neighbor.row * 4 + neighbor.col;

      // Проверяем, что сосед находится в той же строке или колонке
      if (
        neighbor.row >= 0
        && neighbor.row < 4
        && neighbor.col >= 0
        && neighbor.col < 4
      ) {
        const neighborValue = board[neighborIndex];

        if (board[index].textContent === neighborValue.textContent) {
          return true;
        }
      }
    }
  }

  return false;
}
