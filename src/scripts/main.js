'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const size = 4;
let score = 0;
let isWin = false;
let newBoard;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', e => {
  document.addEventListener('keydown', move);

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    isWin = false;
    restartGame();
  }

  addNumber();
  addNumber();
  render();
});

function move(e) {
  newBoard = board;

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowDown':
      slideDown();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    default:
      return;
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (newBoard[row][col] !== board[row][col]) {
        board = newBoard;
        addNumber();
        render();
      }
    }
  }

  if (isWin) {
    messageWin.classList.remove('hidden');
  }

  if (!isPosibleToMove()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
}

function restartGame() {
  score = 0;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  }
};

function addNumber() {
  const [randomY, randomX] = findEmptyCell();

  board[randomY][randomX] = Math.random() < 0.9 ? 2 : 4;
};

function findEmptyCell() {
  const emptyCells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function render() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const elem = fieldRows[row].children[col];
      const cell = board[row][col];

      if (cell === 0) {
        elem.textContent = '';
        elem.className = 'field-cell';
      } else {
        elem.textContent = cell;
        elem.className = `field-cell field-cell--${cell}`;
      }
    };
  };

  gameScore.textContent = score;
};

function slideLeft() {
  if (!checkRows()) {
    return;
  }

  newBoard = newBoard.map(row => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, index) => {
      if (cell === newRow[index + 1]) {
        newRow[index] *= 2;
        newRow.splice(index + 1, 1);
        score += newRow[index];

        if (newRow[index] === 2048) {
          isWin = true;
        }
      }
    });

    return newRow.concat(Array(size - newRow.length).fill(0));
  });
}

function slideRight() {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  slideLeft();
  reverseRows();
}

function reverseRows() {
  newBoard.forEach(row => row.reverse());
}

function slideDown() {
  transposeGameField();
  slideRight();
  transposeGameField();
}

function slideUp() {
  transposeGameField();
  slideLeft();
  transposeGameField();
}

function transposeGameField() {
  newBoard = newBoard[0]
    .map((_, colIndex) => newBoard.map(row => row[colIndex]));
}

function isPosibleToMove() {
  if (checkRows()) {
    return true;
  }

  transposeGameField();

  return checkColumns();
}

function checkRows() {
  for (let i = 0; i < size; i++) {
    if (newBoard[i].some(cell => cell === 0)
      || newBoard[i].some((cell, j) => cell === newBoard[i][j + 1])) {
      return true;
    }
  }

  return false;
}

function checkColumns() {
  for (let i = 0; i < size; i++) {
    if (newBoard[i].some((cell, j) => cell === newBoard[i][j + 1])) {
      return true;
    }
  }

  return false;
}
