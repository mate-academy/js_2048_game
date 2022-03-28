'use strict';

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const fieldOfGame = document.querySelectorAll('td');
const fieldRows = document.querySelector('.game-field').rows;
const scoreboard = document.querySelector('.game-score');

for (let i = 0; i < fieldOfGame.length; i++) {
  fieldOfGame[i].setAttribute('id', i + 1);
}

let movable = false;
let moved = 0;
let countMergeableCells = 0;
let currentScore = 0;

startButton.addEventListener('click', () => startGame());

function createCell() {
  const cellId = parseInt(Math.random() * 16) + 1;
  const findCell = document.getElementById(cellId);

  if (!findCell.innerHTML) {
    const isFour = parseInt(Math.random() * 10) + 1;

    if (isFour === 4) {
      findCell.innerHTML = 4;
      findCell.classList.add(`field-cell--4`);
    } else {
      findCell.innerHTML = 2;
      findCell.classList.add(`field-cell--2`);
    }
  } else {
    createCell();
  }
}

function startGame() {
  moved = 0;
  currentScore = 0;
  scoreboard.innerHTML = 0;

  startButton.className = 'restart';
  startButton.innerHTML = 'Restart';
  startMessage.classList.add('hidden');
  createCell();
  createCell();

  document.addEventListener('keydown', handleArrowPress);

  const restartButton = document.querySelector('.restart');

  restartButton.addEventListener('click', () => {
    for (const cell of fieldOfGame) {
      if (cell.innerHTML) {
        cell.classList.remove(`field-cell--${cell.innerHTML}`);
      }
      cell.innerHTML = '';
    }
    restartGame();
  });
}

function restartGame() {
  currentScore = 0;
  scoreboard.innerHTML = currentScore;
  moved = 0;

  loseMessage.classList.add('hidden');

  createCell();
  createCell();
}

function moveCell(targetCell, cellToMove) {
  if (!targetCell.innerHTML) {
    cellToMove.classList.remove(`field-cell--${cellToMove.innerHTML}`);
    targetCell.innerHTML = cellToMove.innerHTML;
    cellToMove.innerHTML = '';

    if (targetCell.innerHTML) {
      targetCell.classList.add(`field-cell--${targetCell.innerHTML}`);
      moved++;
    }
  }
}

function stepVertical(targetRow, rowToMove) {
  for (let i = 0; i < fieldRows[0].cells.length; i++) {
    const aimCell = fieldRows[targetRow].cells[i];
    const donorCell = fieldRows[rowToMove].cells[i];

    moveCell(aimCell, donorCell);
  }
}

function stepHorizontal(targetColumn, columnToMove) {
  for (let i = 0; i < fieldRows.length; i++) {
    const aimCell = fieldRows[i].cells[targetColumn];
    const donorCell = fieldRows[i].cells[columnToMove];

    moveCell(aimCell, donorCell);
  }
}

function moveUp() {
  for (let i = 1; i > 0; i--) {
    stepVertical(i - 1, i);
  }

  for (let i = 2; i > 0; i--) {
    stepVertical(i - 1, i);
  }

  for (let i = 3; i > 0; i--) {
    stepVertical(i - 1, i);
  }
}

function moveDown() {
  for (let i = 2; i < 3; i++) {
    stepVertical(i + 1, i);
  }

  for (let i = 1; i < 3; i++) {
    stepVertical(i + 1, i);
  }

  for (let i = 0; i < 3; i++) {
    stepVertical(i + 1, i);
  }
}

function moveRight() {
  for (let i = 2; i < 3; i++) {
    stepHorizontal(i + 1, i);
  }

  for (let i = 1; i < 3; i++) {
    stepHorizontal(i + 1, i);
  }

  for (let i = 0; i < 3; i++) {
    stepHorizontal(i + 1, i);
  }
}

function moveLeft() {
  for (let i = 1; i > 0; i--) {
    stepHorizontal(i - 1, i);
  }

  for (let i = 2; i > 0; i--) {
    stepHorizontal(i - 1, i);
  }

  for (let i = 3; i > 0; i--) {
    stepHorizontal(i - 1, i);
  }
}

function compareCells(engulfingCell, engulfedCell) {
  if (engulfingCell.innerHTML && engulfedCell.innerHTML) {
    if (engulfingCell.innerHTML === engulfedCell.innerHTML
      && !engulfingCell.classList.contains('engulfed')) {
      engulfingCell.classList.add('engulfing');
      engulfedCell.classList.add('engulfed');
    }
  }
}

function checkMergeableCellsInRows(engulfingRow, engulfedRow) {
  for (let i = 0; i < fieldRows[0].cells.length; i++) {
    compareCells(fieldRows[engulfingRow].cells[i],
      fieldRows[engulfedRow].cells[i]);
  }
}

function checkMergeableCellsInColumns(engulfingColumn, engulfedColumn) {
  for (let i = 0; i < fieldRows.length; i++) {
    compareCells(fieldRows[i].cells[engulfingColumn],
      fieldRows[i].cells[engulfedColumn]);
  }
}

function mergeCells(engulfingCell, engulfedCell) {
  engulfingCell.classList.remove(`field-cell--${engulfingCell.innerHTML}`);
  engulfedCell.classList.remove(`field-cell--${engulfedCell.innerHTML}`);
  engulfingCell.innerHTML = parseInt(engulfingCell.innerHTML) * 2;
  engulfedCell.innerHTML = '';
  engulfingCell.classList.add(`field-cell--${engulfingCell.innerHTML}`);
  currentScore += parseInt(engulfingCell.innerHTML);
  scoreboard.innerHTML = currentScore;
  moved++;
}

function mergeCellsDown() {
  for (let i = 1; i < fieldRows.length; i++) {
    for (let j = 0; j < fieldRows[0].cells.length; j++) {
      if (fieldRows[i].cells[j].classList.contains('engulfing')) {
        mergeCells(fieldRows[i].cells[j], fieldRows[i - 1].cells[j]);
      }
    }
  }
}

function mergeCellsUp() {
  for (let i = 0; i < fieldRows.length - 1; i++) {
    for (let j = 0; j < fieldRows[0].cells.length; j++) {
      if (fieldRows[i].cells[j].classList.contains('engulfing')) {
        mergeCells(fieldRows[i].cells[j], fieldRows[i + 1].cells[j]);
      }
    }
  }
}

function mergeCellsRight() {
  for (let i = 0; i < fieldRows.length; i++) {
    for (let j = 1; j < fieldRows[0].cells.length; j++) {
      if (fieldRows[i].cells[j].classList.contains('engulfing')) {
        mergeCells(fieldRows[i].cells[j], fieldRows[i].cells[j - 1]);
      }
    }
  }
}

function mergeCellsLeft() {
  for (let i = 0; i < fieldRows.length; i++) {
    for (let j = 0; j < fieldRows[0].cells.length - 1; j++) {
      if (fieldRows[i].cells[j].classList.contains('engulfing')) {
        mergeCells(fieldRows[i].cells[j], fieldRows[i].cells[j + 1]);
      }
    }
  }
}

function motionUp() {
  moveUp();

  for (let i = 0; i < fieldRows.length - 1; i++) {
    checkMergeableCellsInRows(i, i + 1);
  }

  mergeCellsUp();

  moveUp();
}

function motionDown() {
  moveDown();

  for (let i = 3; i > 0; i--) {
    checkMergeableCellsInRows(i, i - 1);
  }

  mergeCellsDown();

  moveDown();
}

function motionLeft() {
  moveLeft();

  for (let i = 0; i < fieldRows[0].cells.length - 1; i++) {
    checkMergeableCellsInColumns(i, i + 1);
  }

  mergeCellsLeft();

  moveLeft();
}

function motionRight() {
  moveRight();

  for (let i = 3; i > 0; i--) {
    checkMergeableCellsInColumns(i, i - 1);
  }

  mergeCellsRight();

  moveRight();
}

function checkEmptyCells() {
  for (const cell of fieldOfGame) {
    if (!cell.innerHTML) {
      movable = true;
    }
  }
}

function clearMergeClasses() {
  for (const cell of fieldOfGame) {
    if (cell.classList.contains('engulfing')) {
      cell.classList.remove('engulfing');
    }

    if (cell.classList.contains('engulfed')) {
      cell.classList.remove('engulfed');
    }
  }
}

function countCellsForMerge() {
  for (let i = 0; i < fieldRows.length - 1; i++) {
    for (let j = 0; j < fieldRows[0].cells.length; j++) {
      if (fieldRows[i].cells[j].innerHTML) {
        if (fieldRows[i].cells[j].innerHTML
          === fieldRows[i + 1].cells[j].innerHTML) {
          countMergeableCells++;

          return;
        }
      }
    }
  }

  for (let i = 0; i < fieldRows.length; i++) {
    for (let j = 0; j < fieldRows[0].cells.length - 1; j++) {
      if (fieldRows[i].cells[j].innerHTML) {
        if (fieldRows[i].cells[j].innerHTML
          === fieldRows[i].cells[j + 1].innerHTML) {
          countMergeableCells++;

          return;
        }
      }
    }
  }
}

function finishRound() {
  if (moved === 0) {
    return;
  }

  document.removeEventListener('keydown', handleArrowPress);

  for (const cell of fieldOfGame) {
    if (parseInt(cell.innerHTML) === 2048) {
      finishGame('win');

      return;
    }
  }

  setTimeout(() => {
    clearMergeClasses();
    createCell();

    checkEmptyCells();
    countCellsForMerge();

    if (!movable && countMergeableCells === 0) {
      setTimeout(() => {
        finishGame('lose');
      }, 2000);

      return;
    }

    document.addEventListener('keydown', handleArrowPress);
    moved = 0;
    movable = false;
    countMergeableCells = 0;
  }, 200);
}

function finishGame(gameResult) {
  document.removeEventListener('keydown', handleArrowPress);

  for (const cell of fieldOfGame) {
    cell.innerHTML = '';
  }

  for (const cell of fieldOfGame) {
    cell.className = 'field-cell';
  }

  currentScore = 0;

  if (gameResult === 'win') {
    const restartButton = document.querySelector('.restart');

    if (restartButton) {
      restartButton.className = 'start';
      restartButton.innerHTML = 'Start';
    }

    winMessage.classList.remove('hidden');

    setTimeout(() => {
      winMessage.classList.add('hidden');
      startMessage.classList.remove('hidden');
    }, 5000);
  } else {
    loseMessage.classList.remove('hidden');
  }
}

function handleArrowPress(e) {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      motionUp();
      finishRound();
      break;

    case 'ArrowDown':
      motionDown();
      finishRound();
      break;

    case 'ArrowLeft':
      motionLeft();
      finishRound();
      break;

    case 'ArrowRight':
      motionRight();
      finishRound();
      break;
  }
}
