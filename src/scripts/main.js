'use strict';

const button = document.querySelector('button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const size = 4;
let score = 0;
let isWin = false;
let newMatrix;
let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startGame = () => {
  const messageStart = document.querySelector('.message-start');

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    isWin = false;
    resetGame();
  }

  addTileToScreen();
  addTileToScreen();
};

const addTileToScreen = () => {
  addNumber();
  renderTile();
};

const resetGame = () => {
  document.addEventListener('keydown', move);

  score = 0;

  const hasMessageLose = messageLose.classList.contains('hidden');
  const hasMessageWin = messageLose.classList.contains('hidden');

  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (!hasMessageLose) {
    messageLose.classList.add('hidden');
  }

  if (!hasMessageWin) {
    messageWin.classList.add('hidden');
  }
};

const addNumber = () => {
  const [randomY, randomX] = findEmptyTile();

  matrix[randomY][randomX] = Math.random() < 0.9 ? 2 : 4;
};

const move = (e) => {
  newMatrix = matrix;

  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    default:
      return;
  }

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (newMatrix[row][column] !== matrix[row][column]) {
        matrix = newMatrix;
        addTileToScreen();
      }
    }
  }

  if (isWin) {
    messageWin.classList.remove('hidden');
  }

  const isMove = canMove();

  if (!isMove) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
};

const reverseRows = () => {
  newMatrix.forEach(row => row.reverse());
};

const moveLeft = () => {
  if (!checkRows()) {
    return;
  }

  newMatrix = newMatrix.map(row => {
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
};

const moveRight = () => {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  moveLeft();
  reverseRows();
};

const moveDown = () => {
  transposeMatrix();
  moveRight();
  transposeMatrix();
};

const moveUp = () => {
  transposeMatrix();
  moveLeft();
  transposeMatrix();
};

const findEmptyTile = () => {
  const emptyTiles = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyTiles.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
};

const renderTile = () => {
  const gameScore = document.querySelector('.game-score');
  const fieldRows = document.querySelectorAll('.field-row');

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const element = fieldRows[row].children[column];
      const cell = matrix[row][column];

      if (cell === 0) {
        element.textContent = '';
        element.className = 'field-cell';
      } else {
        element.textContent = cell;
        element.className = `field-cell field-cell--${cell}`;
      }
    };
  };

  gameScore.textContent = score;
};

const transposeMatrix = () => {
  newMatrix = newMatrix[0]
    .map((_, colIndex) => newMatrix.map(row => row[colIndex]));
};

const canMove = () => {
  if (checkRows()) {
    return true;
  }

  transposeMatrix();

  return checkColumns();
};

const checkRows = () => {
  for (let i = 0; i < size; i++) {
    if (newMatrix[i].some(cell => cell === 0)
      || newMatrix[i].some((cell, j) => cell === newMatrix[i][j + 1])) {
      return true;
    }
  }

  return false;
};

const checkColumns = () => {
  for (let i = 0; i < size; i++) {
    if (newMatrix[i].some((cell, j) => cell === newMatrix[i][j + 1])) {
      return true;
    }
  }

  return false;
};

button.addEventListener('click', startGame);

document.addEventListener('keydown', move);
