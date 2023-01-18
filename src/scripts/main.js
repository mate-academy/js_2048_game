'use strict';

// write your code here
const button = document.querySelector('.button');
const board = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
// const table = document.querySelector('.game-field');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
// const messageLose = document.querySelector('.message-lose');
const tableSize = 4;

function changeClass() {
  button.classList.add('restart');

  if (button.classList.contains('restart')) {
    button.textContent = 'Restart';
  }
}

button.addEventListener('click', function() {
  changeClass();
  cleanTable();
  start();
  start();
  draw();

  for (let i = 0; i < board.length; i++) {
    numClass(board[i], board[i].innerText);
  }

  scoreCount();
  message();
});

function numClass(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 4096) {
      tile.classList.add('field-cell--' + num.toString());
    } else {
      tile.classList.add('field-cell--2048');
    }
  }
}

const gameData = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function checkTableFull() {
  for (let i = 0; i < tableSize; i++) {
    if (gameData[i].includes(0)) {
      return false;
    }
  }
}

function start() {
  while (!checkTableFull()) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (gameData[row][col] === 0) {
      gameData[row][col] = (Math.random() <= 0.1) ? 4 : 2;
      break;
    }
  }
}

function draw() {
  const gameDataUnpacked = [];

  gameData.forEach((rows) => {
    rows.forEach((cells) => {
      gameDataUnpacked.push(cells);
    });
  });

  board.forEach((cells) => {
    const text = gameDataUnpacked.shift();

    cells.textContent = !text ? null : text;
    cells.className = 'field-cell';
    cells.classList.add(`field-cell--${cells.textContent}`);
  });
}

function scoreCount() {
  let total = 0;

  [].forEach.call(board, function(s) {
    total += +s.innerText;
  });
  score.innerText = total;
}

function message() {
  messageStart.classList.add('hidden');

  for (let i = 0; i < board.length; i++) {
    if (board[i].innerText === '2048') {
      messageWin.classList.remove('hidden');
    }
  }
}

function cleanTable() {
  [...board].map(el => {
    el.classList.remove(`field-cell--${el.textContent}`);
    el.textContent = '';
  });

  gameData.map(row => row.map((_, ind) => {
    row[ind] = 0;
  }));
}

// function moveUp {
// }
