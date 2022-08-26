'use strict';

const score = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
const startBtn = document.querySelector('.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let gameScore = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function gameOver() {
  let count = 0;

  board.forEach(row => {
    count += row.indexOf(0);
  });

  if (count === -4) {
    for (let i = 0; i < board.length; i++) {
      for (let k = 0; k < board.length - 1; k++) {
        const current = board[i][k];
        const next = board[i][k + 1];
  
        const rotated = rotateClockWise(board.map(row => [...row]));
        const currentRotated = rotated[i][k];
        const nextRotated = rotated[i][k + 1];
  
        if (current === next) {
          return;
        }
  
        if (currentRotated === nextRotated) {
          return;
        }
      }
    }
    loseMessage.classList.remove('hidden');
  }
}

const rotateClockWise = (matrix) => {
  return matrix.map((row, index) => {
    return row.map((cell, j) => matrix[matrix.length - 1 - j][index]);
  });
};

const rotateAntiClockWise = (matrix) => {
  return matrix.map((row, index) => {
    return row.map((cell, j) => matrix[j][matrix.length - 1 - index]);
  });
};

const tableHtml = [];

function makeHtmlBoard() {  
  rows.forEach(row => {
    tableHtml.push([...row.querySelectorAll('td')]);
  });
};
makeHtmlBoard();

function renderTable() {
  for (let i = 0; i < board.length; i++) {
    for (let k = 0; k < board.length; k++) {
      const currentCell = tableHtml[i][k];
      const currentValue = board[i][k];
  
      currentCell.innerHTML = currentValue === 0 ? '' : currentValue;
      currentCell.className = '';
      currentCell.classList.add('field-cell');
      currentCell.classList.add(`field-cell--${currentValue}`);

      if (currentCell.innerHTML === '2048') {
        winMessage.classList.remove('hidden');
      }
    }
  }
  gameOver();
}
renderTable();

const moveLeft = () => {
  const boardBefore = board.toString();

  moveLeftForBoth();

  renderTable();
  score.innerHTML = gameScore;
};

const moveRight = () => {
  const boardBefore = board.toString();

  board = board.map(row => {
    const noZeroRow = row.filter(cell => cell !== 0);

    for (let i = 0; i < noZeroRow.length; i++) {
      const currentCell = noZeroRow[i];
      const nextCell = noZeroRow[i + 1];

      if (currentCell === nextCell) {
        gameScore += currentCell + nextCell;
        noZeroRow[i] += nextCell;
        noZeroRow.splice(i + 1, 1);
      }
    };

    const amountOfNeededZeros = 4 - noZeroRow.length;

    for (let i = 0; i < amountOfNeededZeros; i++) {
      noZeroRow.unshift(0);
    }

    return noZeroRow;
  });
  score.innerHTML = gameScore;

  renderTable();

  if (board.toString() !== boardBefore) {
    addOne();
  }
};

const moveUp = () => {
  board = rotateAntiClockWise(board);

  moveLeftForBoth();

  board = rotateClockWise(board);
  score.innerHTML = gameScore;
  renderTable();
};

const moveDown = () => {
  board = rotateClockWise(board);

  moveLeftForBoth();

  board = rotateAntiClockWise(board);
  score.innerHTML = gameScore;
  renderTable();
};

function moveLeftForBoth() {
  const boardBefore = board.toString();

  board = board.map(row => {
    const noZeroRow = row.filter(cell => cell !== 0);

    for (let i = 0; i < noZeroRow.length; i++) {
      const currentCell = noZeroRow[i];
      const nextCell = noZeroRow[i + 1];

      if (currentCell === nextCell) {
        gameScore += currentCell + nextCell;
        noZeroRow[i] += nextCell;
        noZeroRow.splice((i + 1), 1);
      }
    };

    const amountOfNeededZeros = 4 - noZeroRow.length;

    for (let i = 0; i < amountOfNeededZeros; i++) {
      noZeroRow.push(0);
    }

    return noZeroRow;
  });

  if (board.toString() !== boardBefore) {
    addOne();
  };
  gameOver();
};

function addOne() {
  const zerosArray = [];

  for (let c = 0; c < board.length; c++) {
    for (let r = 0; r < board.length; r++) {
      if (board[c][r] === 0) {
        const obj = {};

        obj['x'] = r;
        obj['y'] = c;

        zerosArray.push(obj);
      }
    }
  }

  const randomNum = Math.floor(Math.random() * zerosArray.length);
  const randomZeroCoords = zerosArray[randomNum];
  const x = randomZeroCoords['x'];
  const y = randomZeroCoords['y'];

  zerosArray.splice(randomNum, 1);

  const randomForPrecentage = Math.round(Math.random() * 9) + 1;

  let innerHtml;

  if (randomForPrecentage === 1) {
    innerHtml = 4;
  } else {
    innerHtml = 2;
  }

  tableHtml[y][x].innerHTML = innerHtml;
  tableHtml[y][x].className = '';
  tableHtml[y][x].classList.add('field-cell');
  tableHtml[y][x].classList.add(`field-cell--${innerHtml}`);

  board[y][x] = innerHtml;
}

startBtn.addEventListener('click', () => {
  gameScore = 0;
  score.innerHTML = gameScore;

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.innerHTML = 'Restart';

  document.querySelector('.message-start').hidden = true;
  document.querySelector('.message-lose').classList.add('hidden');

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  renderTable();

  addOne();
  addOne();
});

document.addEventListener('keydown', (event) => {
  if (winMessage.classList.contains('hidden')
  && loseMessage.classList.contains('hidden')) {
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft();
        break;

      case 'ArrowRight':
        moveRight();
        break;

      case 'ArrowUp':
        moveUp();
        break;

      case 'ArrowDown':
        moveDown();
        break;
    }
  }
});
