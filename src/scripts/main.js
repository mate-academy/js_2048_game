
'use strict';

const tableRows = document.querySelectorAll('tr');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let isWinner;

const matrix = createTable();

button.addEventListener('click', () => {
  messageStart.classList.toggle('hidden');
  messageLose.classList.add('hidden');

  button.innerText = button.innerText === 'Start'
    ? 'Restart' : 'Start';

  button.classList.toggle('start', !button.classList.contains('start'));
  button.classList.toggle('restart', !button.classList.contains('restart'));

  if (button.innerText !== 'Restart') {
    gameScore.innerText = 0;

    if (isWinner) {
      messageWin.classList.add('hidden');
    };

    clearBoard(tableRows);
    clearMatrix();
    isWinner = false;

    return;
  };

  setNuberToEmptyCell(matrix);
  setNuberToEmptyCell(matrix);

  setValuesToBoard(matrix);
});

document.addEventListener('keydown', e => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    || isWinner) {
    return;
  };

  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    groupMatrix(matrix);
  };

  if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
    horizontallyReverse(matrix);
  };

  if (!checkChoseDirection(matrix)) {
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
      horizontallyReverse(matrix);
    };

    if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
      groupMatrix(matrix);
    };

    return;
  }

  clearBoard(tableRows);
  moveCells(matrix);
  sumSameCells(matrix, gameScore);
  moveCells(matrix);

  if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
    horizontallyReverse(matrix);
  };

  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    groupMatrix(matrix);
  };
  setNuberToEmptyCell(matrix);
  setValuesToBoard(matrix);

  addStyles();

  if (gameOver(matrix)) {
    messageLose.classList.remove('hidden');
  }

  if (checkForValue2048(matrix)) {
    messageWin.classList.toggle('hidden');
    isWinner = true;
  }
});

function createTable() {
  return [...tableRows].reduce((arr, v,) => {
    arr.push(new Array(v.children.length).fill(false));

    return arr;
  }, []);
};

function setNuberToEmptyCell(board) {
  const randomNumber = Math.random() > 0.9 ? 4 : 2;

  while (true) {
    const x = parseInt(Math.random() * board.length);
    const y = parseInt(Math.random() * board.length);

    if (!board[x][y]) {
      board[x][y] = randomNumber;
      break;
    };
  };
};

function setValuesToBoard(board) {
  [...tableRows].forEach((row, x) => {
    [...row.children].forEach((cell, y) => {
      cell.innerText = board[x][y] || '';
      cell.classList.add(`field-cell--${cell.innerText}`);
    });
  });
};

function checkChoseDirection(board) {
  for (let x = 0; x < board.length; x++) {
    for (let y = board.length - 2; y >= 0; y--) {
      const currentCell = board[x][y];
      const nextCell = board[x][y + 1];
      const withSameValue = currentCell === nextCell;

      if ((currentCell && !nextCell) || (currentCell && withSameValue)) {
        return true;
      };
    };
  };
};

function horizontallyReverse(board) {
  board.forEach((row) => row.reverse());
};

function groupMatrix(board) {
  for (let x = 0; x < board.length - 1; x++) {
    for (let y = x + 1; y < board.length; y++) {
      [board[x][y], board[y][x]] = [board[y][x], board[x][y]];
    }
  }
}

function clearBoard(nodeList) {
  nodeList.forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.classList.remove(`field-cell--${cell.innerText}`);
      cell.innerText = '';
    });
  });
};

function clearMatrix() {
  matrix.forEach(row => {
    row.forEach((_, index) => {
      row[index] = false;
    });
  });
};

function moveCells(board) {
  for (let x = 0; x < board.length; x++) {
    let emptyCellsCount = 0;

    for (let y = board.length - 1; y >= 0; y--) {
      if (!board[x][y]) {
        emptyCellsCount++;
        continue;
      };

      if (emptyCellsCount) {
        board[x][y + emptyCellsCount] = board[x][y];
        board[x][y] = false;
      };
    };
  };
};

function sumSameCells(board, score) {
  for (let x = 0; x < board.length; x++) {
    for (let y = board.length - 2; y >= 0; y--) {
      const curentCell = board[x][y];
      const adjacentCell = board[x][y + 1];
      const isWithSameValue = adjacentCell === curentCell;

      if (adjacentCell && isWithSameValue) {
        const newValue = +adjacentCell + +curentCell;

        score.innerText = +score.innerText + +newValue;

        board[x][y + 1] = newValue;
        board[x][y] = false;
      };
    };
  };
};

function addStyles() {
  tableRows.forEach(row => {
    [...row.children].forEach(cell => {
      if (cell.innerText) {
        cell.classList.add(`field-cell--${cell.innerText}`);
      };
    });
  });
};

function gameOver(board) {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length; y++) {
      const currentCell = board[x][y];

      if (!currentCell) {
        return false;
      };

      if (x !== board.length - 1 && board[x + 1][y] === currentCell) {
        return false;
      };

      if (y !== board.length - 1 && board[x][y + 1] === currentCell) {
        return false;
      };
    };
  };

  return true;
};

function checkForValue2048(table) {
  return [...table].some(row => row.includes(2048));
};
