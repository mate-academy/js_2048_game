'use strict';

const start = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const fieldRowAll = document.querySelectorAll('.field-row');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');

const defaultBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let board = [];
let probabilityCount = 0;
let score = 0;
let started = false;

function createNewCell() {
  if (!freeCell()) {
    if (checkIfPlayerLose()) {
      messageLose.classList.remove('hidden');
    }

    return;
  }

  const [row, cell] = getRandomEmptyCell();
  const value = Math.random() < 0.9 ? 2 : 4;

  board[row][cell] = value;
}

function getRandomEmptyCell() {
  const emptyCells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, cellIndex]);
      }
    });
  });

  const randomIndex = getRandomInt(emptyCells.length);

  return emptyCells[randomIndex];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shiftRowLeft(row) {
  const newRow = row.filter(element => element !== 0);

  while (newRow.length < row.length) {
    newRow.push(0);
  }

  return newRow;
}

function mergeCells(row) {
  for (let j = row.length - 1; j >= 1; j--) {
    if (row[j] === row[j - 1]) {
      row[j] *= 2;
      row[j - 1] = 0;
      score += row[j];
    }
  }
}

function shiftBoardLeft() {
  board.forEach((row, i) => {
    board[i] = shiftRowLeft(row);
    mergeCells(board[i]);
    board[i] = shiftRowLeft(board[i]);
  });
}

function shiftBoardRight() {
  board.forEach((row, i) => {
    row.reverse();
    shiftBoardLeft();
    row.reverse();
  });
}

function shiftBoardUp() {
  const tempBoard = board[0].map((col, i) => board.map(row => row[i]));

  shiftBoardLeft();
  board = tempBoard[0].map((col, i) => board.map(row => row[i]));
}

function shiftBoardDown() {
  const tempBoard = board[0].map((col, i) => board.map(row => row[i]));

  shiftBoardRight();
  board = tempBoard[0].map((col, i) => board.map(row => row[i]));
}

function checkAndAction(check) {
  if (!check) {
    createNewCell();
    showDisplay();

    if (checkIfPlayerWon()) {
      handleVictory();
    }
  }
}

function moveRight(check) {
  shiftBoardRight();
  checkAndAction(check);
}

function moveLeft(check) {
  shiftBoardLeft();
  checkAndAction(check);
}

function moveUp(check) {
  shiftBoardUp();
  checkAndAction(check);
}

function moveDown(check) {
  shiftBoardDown();
  checkAndAction(check);
}

function changeClassCell(element, addClass) {
  element.classList = '';
  element.classList.add('field-cell');

  if (addClass) {
    element.classList.add(addClass);
  }
}

function checkIfPlayerWon() {
  const pointForVictory = 2048;

  return board.some(row => row.some(cell => cell === pointForVictory));
}

function handleVictory() {
  messageWin.classList.remove('hidden');
  start.textContent = 'Start';
  start.classList.remove('restart');
  start.classList.add('start');
  started = false;
  messageStart.classList.remove('hidden');
}

function freeCell() {
  return board.some(row => row.some(cell => cell === 0));
}

function goToOldBoard(oldBoard, oldProbabilityCount, oldScore) {
  board = oldBoard.map(row => [...row]);
  probabilityCount = oldProbabilityCount;
  score = oldScore;
}

function checkIfPlayerLose() {
  let lose = true;
  const temp = board.map(row => [...row]);
  const tepmProbabilityCount = probabilityCount;
  const tempScore = score;

  moveLeft('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }

  moveUp('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }

  goToOldBoard(temp, tepmProbabilityCount, tempScore);

  return lose;
}

function showDisplay() {
  board.forEach((row, i) => {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    row.forEach((boardCell, j) => {
      const cell = cells[j];

      if (boardCell !== 0) {
        cell.textContent = boardCell;

        const addClass = `field-cell--${boardCell}`;

        changeClassCell(cell, addClass);
      } else {
        cell.textContent = '';
        changeClassCell(cell);
      }
    });
  });

  scoreDisplay.textContent = score;
}

function startGame() {
  board = defaultBoard.map(row => [...row]);
  probabilityCount = 0;
  score = 0;
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  createNewCell();
  createNewCell();
  showDisplay();
}

start.addEventListener('click', ({ target }) => {
  startGame();
  started = true;

  if (target.matches('.start')) {
    start.textContent = 'Restart';
    start.classList.remove('start');
    start.classList.add('restart');
  }
});

document.addEventListener('keyup', ({ key }) => {
  if (!started) {
    return;
  }

  switch (key) {
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
    default:
      break;
  }
});
