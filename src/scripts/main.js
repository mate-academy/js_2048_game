'use strict';

const SIZE_BOARD = 4;
let board = [...Array(SIZE_BOARD)].map(() => Array(SIZE_BOARD).fill(0));
let score = 0;
let isWin = false;
const cells = document.querySelectorAll('.field-cell');
const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

const message = {
  messageStart: document.getElementById('message-start'),
  messageLose: document.getElementById('message-lose'),
  messageWin: document.getElementById('message-win'),
};

const button = document.getElementById('start-button');

button.addEventListener('click', setGame);

function resetGame() {
  score = 0;
  document.querySelector('.game-score').innerText = score;
  board = [...Array(SIZE_BOARD)].map(() => Array(SIZE_BOARD).fill(0));
}

function setGame() {
  resetGame();
  changeButton();
  addRandomField(board);
  addRandomField(board);
  drawTile(board, cells);
}

document.addEventListener('keyup', (e) => {
  if (!allowedKeys.includes(e.key) || isWin) {
    return;
  }

  const prevBoard = JSON.parse(JSON.stringify(board));

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      loseGameMessage();
      winGameMessage();
      break;

    case 'ArrowRight':
      slideRight();
      loseGameMessage();
      winGameMessage();
      break;

    case 'ArrowUp':
      slideUp();
      loseGameMessage();
      winGameMessage();
      break;

    case 'ArrowDown':
      slideDown();
      loseGameMessage();
      winGameMessage();
      break;

    default:
      break;
  }

  document.querySelector('.game-score').innerText = score;

  const isSameBoard = isMoved(prevBoard);

  if (isSameBoard) {
    addRandomField(board);
    drawTile(board, cells);
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

function deleteZero(row) {
  return row.filter(item => item !== 0);
}

function slide(row) {
  const rowClear = deleteZero(row);

  let newRow = rowClear;

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = deleteZero(newRow);

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let i = 0; i < SIZE_BOARD; i++) {
    board[i] = slide(board[i]);
  }
}

function slideRight() {
  for (let i = 0; i < SIZE_BOARD; i++) {
    board[i].reverse();
    board[i] = slide(board[i]);
    board[i].reverse();
  }
}

function getItemsColumsBoard(matrix) {
  const columsItems = [];

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix.length; c++) {
      columsItems.push(matrix[c][r]);
    }
  }

  return columsItems;
}

function getColumsBoard(arr, siceCut) {
  const columsArr = [];

  for (let i = 0; i < arr.length; i += siceCut) {
    const subarray = arr.slice(i, i + siceCut);

    columsArr.push(subarray);
  }

  return columsArr;
}

function slideUp() {
  const colums = getColumsBoard(getItemsColumsBoard(board), SIZE_BOARD);

  for (let r = 0; r < SIZE_BOARD; r++) {
    colums[r] = slide(colums[r]);
  }

  const rows = getColumsBoard(getItemsColumsBoard(colums), SIZE_BOARD);

  for (let r = 0; r < SIZE_BOARD; r++) {
    board[r] = rows[r];
  }
}

function slideDown() {
  const colums = getColumsBoard(getItemsColumsBoard(board), SIZE_BOARD);

  for (let r = 0; r < SIZE_BOARD; r++) {
    colums[r].reverse();
    colums[r] = slide(colums[r]);
    colums[r].reverse();
  }

  const rows = getColumsBoard(getItemsColumsBoard(colums), SIZE_BOARD);

  for (let r = 0; r < SIZE_BOARD; r++) {
    board[r] = rows[r];
  }
}

function changeButton() {
  button.classList += ' restart';
  button.innerText = 'Restart';
  button.style = 'border: 2px solid red; color: #776e65; outline: none;';
  message['messageStart'].classList.add('hidden');
}

function addRandomField(matrix) {
  // Находим все пустые ячейки в матрице
  const emptyCells = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) {
        emptyCells.push({
          rowIndex, colIndex,
        });
      }
    });
  });

  // Если есть пустые ячейки, выбираем случайную и добавляем 2 или 4
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    matrix[randomCell.rowIndex][randomCell.colIndex]
      = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawTile(tiles, element) {
  tiles.forEach((row, rowInd) => {
    row.forEach((value, colInd) => {
      const cellIndex = rowInd * tiles.length + colInd;
      const cell = element[cellIndex];

      if (value > 0) {
        cell.textContent = value;
        cell.classList = 'field-cell' + ` field-cell--${value}`;
      } else {
        cell.textContent = null;
        cell.classList = `field-cell`;
      }
    });
  });
}

function winGameMessage() {
  board.forEach(row => {
    row.forEach(tile => {
      if (tile >= 2048) {
        isWin = true;
        message.messageWin.classList.remove('hidden');
      }
    });
  });
}

function loseGameMessage() {
  if (isBoardFull() && !canMakeMove()) {
    message.messageLose.classList.remove('hidden');
  }
}

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
