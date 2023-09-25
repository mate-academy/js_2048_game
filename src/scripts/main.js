'use strict';

const rows = 4;
const columns = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const gameField = document.querySelector('.game-field');
const btnStart = document.querySelector('.button.start');
const scoreField = document.querySelector('.game-score');
const messageStart = document.querySelector('.message.message-start');
const messageWin = document.querySelector('.message.message-win');
const messageLose = document.querySelector('.message.message-lose');

btnStart.addEventListener('click', startGame);

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  addRandomTile();
  addRandomTile();
  btnRestart();
}

function addRandomTile() {
  const num = Math.random() > 0.9 ? 4 : 2;

  const emptyCell = getEmptyCell();

  if (emptyCell) {
    board[emptyCell.row][emptyCell.column] = num;
  };

  updateBoard();
}

function getEmptyCell() {
  const ramdomRow = Math.floor(Math.random() * rows);
  const randomColumn = Math.floor(Math.random() * columns);

  if (board[ramdomRow][randomColumn] === 0) {
    return {
      row: ramdomRow, column: randomColumn,
    };
  }
}

function updateBoard() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = gameField.rows[i].cells[j];
      const num = board[j][i];

      cell.textContent = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (num > 0) {
        cell.textContent = num;

        if (num <= 2048) {
          cell.classList.add(`field-cell--${num}`);
        }
      }
    }
  }

  checkWin();

  if (!canMove()) {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', handleArrows);

function handleArrows(e) {
  const copyBoard = JSON.parse(JSON.stringify(board));

  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    default:
      addRandomTile();

      return;
  }

  if (JSON.stringify(copyBoard) !== JSON.stringify(board)) {
    addRandomTile();
  }

  updateBoard();
}

function move(row) {
  let onlyNums = row.filter(num => num !== 0);

  for (let i = 0; i < rows; i++) {
    if (onlyNums[i] === onlyNums[i + 1] && isFinite(onlyNums[i])) {
      onlyNums[i] *= 2;
      onlyNums[i + 1] = 0;

      updateScore(onlyNums[i]);
    }
  }

  onlyNums = onlyNums.filter(num => num !== 0);

  while (onlyNums.length < rows) {
    onlyNums.push(0);
  }

  return onlyNums;
}

function rotadeBoard(items) {
  const revesedBoard = [];

  for (let i = 0; i < rows; i++) {
    const column = [];

    for (let j = 0; j < columns; j++) {
      column.push(items[i][j]);
    }

    revesedBoard.push(column);
  }

  return revesedBoard;
}

function moveUp() {
  const rotatedBoard = rotadeBoard(board);

  const moved = rotatedBoard.map(item => move(item));

  const rotatedBackBoard = rotadeBoard(moved);

  for (let i = 0; i < rows; i++) {
    board[i] = rotatedBackBoard[i];
  }
}

function moveDown() {
  const rotatedBoard = rotadeBoard(board);
  const reversedBoard = rotatedBoard.map(item => item.reverse());
  const moved = reversedBoard.map(item => move(item));
  const reversedBackBoard = moved.map(item => item.reverse());

  const rotatedBoardBoard = rotadeBoard(reversedBackBoard);

  for (let i = 0; i < rows; i++) {
    board[i] = rotatedBoardBoard[i];
  }
}

function moveLeft() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = move(row);

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];
    }
  }
}

function moveRight() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = move(row.reverse());
    row = row.reverse();

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];
    }
  }
}

function updateScore(num) {
  score += num;
  scoreField.textContent = score;
}

function btnRestart() {
  messageStart.classList.add('hidden');
  btnStart.textContent = 'Restart';
  btnStart.style.fontSize = '18px';
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  score = 0;
  scoreField.textContent = score;
}

function checkWin() {
  const win = board.some(row => row.includes(2048));

  if (win) {
    messageWin.classList.remove('hidden');
  }
}

function canMove() {
  const arr = [];

  for (let i = 0; i < rows; i++) {
    const row = board[i];

    arr.push(...row);
  }

  if (!arr.includes(0)) {
    return false;
  }

  return true;
}
