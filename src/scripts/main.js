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

let gameField = [
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
    reset();
  }

  addNumber();
  addNumber();
  render();
});

function move(e) {
  switch (e.key) {
    case 'ArrowLeft':
      left();
      break;

    case 'ArrowRight':
      right();
      break;

    case 'ArrowDown':
      down();
      break;

    case 'ArrowUp':
      up();
      break;

    default:
      return;
  }

  if (isWin) {
    messageWin.classList.remove('hidden');
  }

  if (!isPosibleToMove()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
}

function reset() {
  score = 0;

  gameField = [
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

  gameField[randomY][randomX] = Math.random() < 0.9 ? 2 : 4;
};

function findEmptyCell() {
  const emptyCells = [];

  gameField.forEach((row, rowIndex) => {
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
      const cell = gameField[row][col];

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

function left() {
  const prevBoard = JSON.parse(JSON.stringify(gameField));

  for (let r = 0; r < size; r++) {
    let row = gameField[r];

    row = slide(row);
    gameField[r] = row;
  };

  if (compareArr(prevBoard, gameField)) {
    addNumber();
  }

  render();
}

function compareArr(prevBoard, boards) {
  return JSON.stringify(prevBoard) !== JSON.stringify(boards);
};

function filterZero(row) {
  return row.filter(num => num);
}

function slide(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }
  newRow = filterZero(newRow);

  while (newRow.length < size) {
    newRow.push(0);
  }

  return newRow;
}

function right() {
  const prevBoard = JSON.parse(JSON.stringify(gameField));

  for (let r = 0; r < size; r++) {
    let row = gameField[r];

    row.reverse();
    row = slide(row);

    row.reverse();
    gameField[r] = row;
  };

  if (compareArr(prevBoard, gameField)) {
    addNumber();
  }

  render();
}

function down() {
  const prevBoard = JSON.parse(JSON.stringify(gameField));

  for (let c = 0; c < size; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < size; r++) {
      gameField[r][c] = row[r];
    };
  };

  if (compareArr(prevBoard, gameField)) {
    addNumber();
  }

  render();
}

function up() {
  const prevBoard = JSON.parse(JSON.stringify(gameField));

  for (let c = 0; c < size; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = slide(row);

    for (let r = 0; r < size; r++) {
      gameField[r][c] = row[r];
    };
  };

  if (compareArr(prevBoard, gameField)) {
    addNumber();
  }

  render();
}

function transposeGameField() {
  gameField = gameField[0]
    .map((_, colIndex) => gameField.map(row => row[colIndex]));
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
    if (gameField[i].some(cell => cell === 0)
      || gameField[i].some((cell, j) => cell === gameField[i][j + 1])) {
      return true;
    }
  }

  return false;
}

function checkColumns() {
  for (let i = 0; i < size; i++) {
    if (gameField[i].some((cell, j) => cell === gameField[i][j + 1])) {
      return true;
    }
  }

  return false;
}
