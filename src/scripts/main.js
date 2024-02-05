'use strict';

const COLUMNS_NUMBER = 4;
const ROWS_NUMBER = 4;
let board;
let score = 0;
let scoreBestItem = localStorage.getItem('scoreBest!!!') || 0;

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const scoreItem = document.querySelector('.game-score');
const bestScoreItem = document.querySelector('.game-score-best');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', resetGame);

function startGame() {
  setGame();
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  messageStart.classList.add('hidden');
  bestScoreItem.innerText = scoreBestItem;
}

function resetGame() {
  resetBoard();
  resetScore();
  startButton.classList.remove('hidden');
  restartButton.classList.add('hidden');
  messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  bestScoreItem.innerText = scoreBestItem;
}

function initializeBoard() {
  return Array.from({ length: ROWS_NUMBER },
    () => Array(COLUMNS_NUMBER).fill(0));
}

function setGame() {
  board = initializeBoard();

  for (let i = 0; i < ROWS_NUMBER; i++) {
    for (let j = 0; j < COLUMNS_NUMBER; j++) {
      const fieldCell = document.createElement('div');

      fieldCell.id = i.toString() + '-' + j.toString();

      const num = board[i][j];

      updateTile(fieldCell, num);

      document.querySelector('.game-field').append(fieldCell);
    }
  }

  setNewElement();
  setNewElement();
}

function updateTile(fieldCell, num) {
  fieldCell.innerText = '';
  fieldCell.classList.value = '';
  fieldCell.classList.add('field-cell');

  if (num > 0) {
    fieldCell.innerText = num.toString();
    fieldCell.classList.add('field-cell--' + num.toString());
  }

  gameWin();
}

function resetScore() {
  score = 0;
  scoreItem.innerText = score;
}

function resetBoard() {
  const currentBoard = document.querySelector('.game-field');

  currentBoard.innerHTML = '';
}

function hasEmptyTile() {
  for (let i = 0; i < ROWS_NUMBER; i++) {
    for (let j = 0; j < COLUMNS_NUMBER; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setNewElement() {
  let found = false;

  if (!hasEmptyTile()) {
    return;
  }

  while (!found) {
    const i = Math.floor(Math.random() * ROWS_NUMBER);
    const j = Math.floor(Math.random() * COLUMNS_NUMBER);

    if (board[i][j] === 0) {
      const randomNum = Math.floor(Math.random() * 10);

      if (randomNum === 0) {
        board[i][j] = 4;
      } else {
        board[i][j] = 2;
      }

      const fieldCell = document.getElementById(
        i.toString() + '-' + j.toString());

      fieldCell.innerText = (board[i][j]).toString();
      fieldCell.classList.add('field-cell--' + board[i][j]);
      found = true;
    }
  }

  if (gameOver()) {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keyup', (e) => {
  let boardChanged = false;

  switch (e.code) {
    case 'ArrowLeft':
      boardChanged = slideLeft();
      break;

    case 'ArrowRight':
      boardChanged = slideRight();
      break;

    case 'ArrowUp':
      boardChanged = slideUp();
      break;

    case 'ArrowDown':
      boardChanged = slideDown();
      break;

    default: {
      alert('Please, use only arrows!');
    }
  }

  if (boardChanged) {
    setNewElement();
    scoreItem.innerText = score;

    if (score >= scoreBestItem) {
      scoreBestItem = score;
      bestScoreItem.innerText = score;
      localStorage.setItem('scoreBest!!!', scoreBestItem);
    }
  }
});

function deleteZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(originalRow) {
  let newRow = [...originalRow];

  newRow = deleteZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = deleteZero(newRow);

  while (newRow.length < COLUMNS_NUMBER) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  let boardChanged = false;

  for (let i = 0; i < ROWS_NUMBER; i++) {
    let row = board[i];
    const originalRow = [...row];

    row = slide(row);
    board[i] = row;

    if (!boardChanged && !originalRow
      .every((val, index) => val === row[index])) {
      boardChanged = true;
    }

    for (let j = 0; j < COLUMNS_NUMBER; j++) {
      const fieldCell = document.getElementById(
        i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(fieldCell, num);
    }
  }

  return boardChanged;
}

function slideRight() {
  let boardChanged = false;

  for (let i = 0; i < ROWS_NUMBER; i++) {
    let row = board[i];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row;

    if (!boardChanged && !originalRow
      .every((val, index) => val === row[index])) {
      boardChanged = true;
    }

    for (let j = 0; j < COLUMNS_NUMBER; j++) {
      const fieldCell = document.getElementById(
        i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(fieldCell, num);
    }
  }

  return boardChanged;
}

function slideUp() {
  let boardChanged = false;

  for (let j = 0; j < COLUMNS_NUMBER; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    const originalRow = [...row];

    row = slide(row);

    if (!boardChanged && !originalRow
      .every((val, index) => val === row[index])) {
      boardChanged = true;
    }

    for (let i = 0; i < ROWS_NUMBER; i++) {
      board[i][j] = row[i];

      const fieldCell = document.getElementById(
        i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(fieldCell, num);
    }
  }

  return boardChanged;
}

function slideDown() {
  let boardChanged = false;

  for (let j = 0; j < COLUMNS_NUMBER; j++) {
    let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    if (!boardChanged && !originalRow
      .every((val, index) => val === row[index])) {
      boardChanged = true;
    }

    for (let i = 0; i < ROWS_NUMBER; i++) {
      board[i][j] = row[i];

      const fieldCell = document.getElementById(
        i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(fieldCell, num);
    }
  }

  return boardChanged;
}

function gameOver() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let i = 0; i < ROWS_NUMBER; i++) {
    for (let j = 0; j < COLUMNS_NUMBER - 1; j++) {
      if (board[i][j] === board[i][j + 1] || board[j][i] === board[j + 1][i]) {
        return false;
      }
    }
  }

  return true;
}

function gameWin() {
  for (let i = 0; i < ROWS_NUMBER; i++) {
    for (let j = 0; j < COLUMNS_NUMBER; j++) {
      if (board[i][j] === 2048) {
        messageWin.classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}
