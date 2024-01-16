'use strict';

const SIZE_BOARD = 4;

const board = [...Array(4)].map(() => Array(4).fill(0));
// const board = [
//   [0, 0, 0, 2],
//   [0, 0, 0, 2],
//   [0, 0, 0, 2],
//   [0, 0, 0, 2]
// ]
let score = 0;
const cells = document.querySelectorAll('.field-cell');

const message = {
  start: document.getElementById('message-start'),
  lose: document.getElementById('message-lose'),
  messageWin: document.getElementById('message-win'),
};

const gameBoard = document.getElementById('game-field');
const button = document.getElementById('start-button');

button.addEventListener('click', setGame);

function setGame() {
  changeButton();
  addRandomField(board);
  addRandomField(board);
  drawTile(board, cells);
  // console.log(board)
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      // slideDown();
      break;

    default:
      break;
  }

  // addRandomField(board);
  // drawTile(board, cells);
});

function deleteZero(row) {
  return row.filter(item => item !== 0);
}

function slide(row) {
  // console.log('row', row)
  const rowClear = deleteZero(row);
  // console.log('rowClear', rowClear)

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
  for (let i = 0; i < board.length; i++) {
    board[i] = slide(board[i]);
  }
}

function slideRight() {
  for (let i = 0; i < board.length; i++) {
    board[i].reverse();
    board[i] = slide(board[i]);
    board[i].reverse();
  }
}

function getItemsColumsBoard() {
  const columsItems = [];

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      columsItems.push(board[c][r]);
    }
  }
  console.log(columsItems);
  return columsItems;
}

function getColumsBoard(arr, siceCut) {
  const columsArr = [];
  console.log('columsArr before', columsArr);

  for (let i = 0; i < arr.length; i += siceCut) {
    const subarray = arr.slice(i, i + siceCut);

    columsArr.push(subarray);
  }
  console.log('columsArr after', columsArr);
  return columsArr;
}

function slideUp() {
  const colums = getColumsBoard(getItemsColumsBoard(), SIZE_BOARD);
  console.log('coluns before', colums);

  for (let r = 0; r < board.length; r++) {
    colums[r] = slide(colums[r]);
    board[r] = colums[r];
  }
  // console.log('coluns after', colums);
}

function changeButton() {
  button.classList += ' restart';
  button.innerText = 'Restart';
  button.style = 'border: 2px solid red; color: #776e65;';
  message['start'].classList.add('hidden');
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
      = Math.random() < 0.5 ? 2 : 4;
    // Удаляем использованную ячейку из списка пустых ячеек
    emptyCells.splice(randomIndex, 1);
  }
}

function drawTile(tiles, cells) {
  tiles.forEach((row, rowInd) => {
    row.forEach((value, colInd) => {
      const cellIndex = rowInd * tiles.length + colInd;
      const cell = cells[cellIndex];

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

