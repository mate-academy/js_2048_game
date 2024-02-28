/* eslint-disable object-curly-newline */
'use strict';

const SIZE_BOARD = 4;
let board = [...Array(SIZE_BOARD)].map(() => Array(SIZE_BOARD).fill(0));
let score = 0;
let isWin = false;
const cells = document.querySelectorAll('.field-cell');
const startButton = document.getElementById('start-button');
const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
const message = {
  Start: document.getElementById('message-start'),
  Lose: document.getElementById('message-lose'),
  Win: document.getElementById('message-win'),
};

startButton.addEventListener('click', startGame);

function startGame() {
  resetGame();
  changeButton();
  addRandomField(board);
  addRandomField(board);
  drawBoard(board, cells);
}

const resetGame = () => {
  score = 0;
  isWin = false;
  document.querySelector('.game-score').innerText = score;
  board = [...Array(SIZE_BOARD)].map(() => Array(SIZE_BOARD).fill(0));
  message.Win.classList.add('hidden');
  message.Lose.classList.add('hidden');
};

function addRandomField(boardArray) {
  const emptyCells = [];

  boardArray.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      value === 0 && emptyCells.push({ rowIndex, colIndex });
    });
  });

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    boardArray[randomCell.rowIndex][randomCell.colIndex]
      = Math.random() < 0.9 ? 2 : 4;
  }
}

const drawBoard = (boardArray, curCells) => {
  boardArray.forEach((row, rowInd) => {
    row.forEach((value, colInd) => {
      const cell = curCells[rowInd * boardArray.length + colInd];

      if (value > 0) {
        cell.textContent = value;
        cell.classList = 'field-cell' + ` field-cell--${value}`;
      } else {
        cell.textContent = null;
        cell.classList = 'field-cell';
      }
    });
  });
};

const changeButton = () => {
  startButton.classList += ' restart';
  startButton.innerText = 'Restart';
  startButton.style = 'border: 2px solid red; color: #776e65; outline: none;';
  message.Start.classList.add('hidden');
};

document.addEventListener('keyup', e => {
  if (!allowedKeys.includes(e.key) || isWin) {
    return;
  }

  const prevBoard = JSON.parse(JSON.stringify(board));

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      getWinMessage(board);
      getLoseMessage(board);
      break;

    case 'ArrowRight':
      slideRight();
      getWinMessage(board);
      getLoseMessage(board);
      break;

    case 'ArrowUp':
      slideUp();
      getWinMessage(board);
      getLoseMessage(board);
      break;

    case 'ArrowDown':
      slideDown();
      getWinMessage(board);
      getLoseMessage(board);
      break;

    default:
      break;
  }

  document.querySelector('.game-score').innerText = score;

  if (isMoved(prevBoard)) {
    addRandomField(board);
    drawBoard(board, cells);
  }
});

const isMoved = (prevBoard) => {
  for (let r = 0; r < SIZE_BOARD; r++) {
    for (let c = 0; c < SIZE_BOARD; c++) {
      if (prevBoard[r][c] !== board[r][c]) {
        return true;
      }
    }
  }

  return false;
};

const slideLeft = () => {
  board = board.map(row => slide(row));
};

const slideRight = () => {
  board = board.map(row => slide(row.reverse()).reverse());
};

function slideUp() {
  const columns = prepareColumns(board);

  board = prepareColumns(columns.map(col => slide(col)));
}

function slideDown() {
  let columns = prepareColumns(board);

  columns = columns.map(col => slide(col.reverse()).reverse());

  board = prepareColumns(columns);
};

const deleteZeros = row => row.filter(Boolean);

const slide = row => {
  const rowClear = deleteZeros(row);
  let newRow = rowClear;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }
  newRow = deleteZeros(newRow);

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return newRow;
};

function prepareColumns(boardArr) {
  return boardArr.map((row, rowInd, rowArr) => {
    return row.map((_, colInd) => {
      return rowArr[colInd][rowInd];
    });
  });
}

const getWinMessage = (boardArray) => {
  boardArray.forEach(row => {
    row.forEach(cell => {
      if (cell >= 2048) {
        isWin = true;
        message.Start.classList.remove('hidden');
      }
    });
  });
};

function getLoseMessage() {
  if (isBoardFull() && !canMakeMove()) {
    message.Lose.classList.remove('hidden');
  }
};

function isBoardFull() {
  return board.every(row => row.every(tile => tile !== 0));
}

function canMakeMove() {
  for (let r = 0; r < SIZE_BOARD; r++) {
    for (let c = 0; c < SIZE_BOARD; c++) {
      const value = board[r][c];

      if (value !== 0) {
        if (r < 3 && value === board[r + 1][c]) {
          return true;
        };

        if (c < 3 && value === board[r][c + 1]) {
          return true;
        };
      }
    }
  }

  return false;
}
