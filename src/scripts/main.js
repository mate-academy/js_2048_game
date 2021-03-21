
'use strict';

const tableRows = document.querySelectorAll('tr');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let isWinner;

button.addEventListener('click', (btn) => {
  messageStart.classList.toggle('hidden');
  messageLose.classList.add('hidden');

  button.innerText = button.innerText === 'Start'
    ? 'Restart' : 'Start';

  button.classList.toggle('start', !button.classList.contains('start'));
  button.classList.toggle('restart', !button.classList.contains('restart'));

  if (button.innerText !== 'Restart') {
    isWinner = false;
    gameScore.innerText = 0;
    messageWin.classList.remove('hidden');
    switchStyles();
    clearBoard();

    return;
  };

  setNuberToEmptyCell(tableRows);
  setNuberToEmptyCell(tableRows);

  switchStyles();
});

document.addEventListener('keydown', e => {
  const matrix = getValuesFromBoard(tableRows);

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
    return;
  }

  switchStyles();
  moveCells(matrix);
  sumSameCells(matrix, gameScore);
  moveCells(matrix);

  if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
    horizontallyReverse(matrix);
  };

  if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
    groupMatrix(matrix);
  };
  setValuesToBoard(matrix);
  setNuberToEmptyCell(tableRows);
  switchStyles();

  if (gameOver(tableRows)) {
    messageLose.classList.remove('hidden');
  }

  if (chekcForValue2048(tableRows)) {
    messageWin.classList.toggle('hidden');
    isWinner = true;
  }
});

function chekcForValue2048(table) {
  return [...table].some(row => {
    return [...row.children].some(cell => {
      return cell.innerText === '2048';
    });
  });
};

function clearBoard() {
  tableRows.forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.innerText = '';
    });
  });
};

function gameOver(nodeList) {
  for (let x = 0; x < nodeList.length; x++) {
    for (let y = 0; y < nodeList.length; y++) {
      const currentCell = nodeList[x].children[y].innerText;

      if (!currentCell) {
        return false;
      };

      if (x !== nodeList.length - 1
        && nodeList[x + 1].children[y].innerText === currentCell) {
        return false;
      };

      if (y !== nodeList.length - 1
        && nodeList[x].children[y + 1].innerText === currentCell) {
        return false;
      };
    };
  };

  return true;
};

function checkChoseDirection(board) {
  for (let x = 0; x < 4; x++) {
    for (let y = 2; y >= 0; y--) {
      const currentCell = board[x][y];
      const nextCell = board[x][y + 1];
      const withSameValue = currentCell === nextCell;

      if ((currentCell && !nextCell) || (currentCell && withSameValue)) {
        return true;
      };
    };
  };

  return false;
};

function getValuesFromBoard(nodeList) {
  return [...nodeList].map(row => {
    return [...row.children].map(cell => {
      return cell.innerText || false;
    });
  });
};

function setValuesToBoard(board) {
  [...tableRows].forEach((row, x) => {
    [...row.children].forEach((cell, y) => {
      cell.innerText = board[x][y] || '';
    });
  });
};

function horizontallyReverse(board) {
  board.forEach((row) => row.reverse());
};

function groupMatrix(board) {
  const tmpBoard = board.map((row, x) => {
    return row.map((_, y) => board[y][x]);
  });

  tmpBoard.forEach((_, i, arr) => {
    board[i] = tmpBoard[i];
  });
};

function switchStyles() {
  tableRows.forEach(row => {
    [...row.children].forEach(cell => {
      if (cell.innerText) {
        cell.classList.toggle(`field-cell--${cell.innerText}`);
      };
    });
  });
};

function sumSameCells(board, score) {
  for (let x = 0; x < 4; x++) {
    for (let y = 2; y >= 0; y--) {
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

function moveCells(board) {
  for (let x = 0; x < board.length; x++) {
    let emptyCellsCount = 0;

    for (let y = 3; y >= 0; y--) {
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

function setNuberToEmptyCell(board) {
  const randomNumber = Math.random() > 0.9 ? 4 : 2;

  while (true) {
    const x = parseInt(Math.random() * 4);
    const y = parseInt(Math.random() * 4);
    const emptyCell = board[x].children[y];

    if (!emptyCell.innerText) {
      emptyCell.innerText = randomNumber;
      break;
    };
  };
};
