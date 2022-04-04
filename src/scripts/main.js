'use strict';

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const fieldRows = document.querySelector('.game-field').rows;
const scoreboard = document.querySelector('.game-score');

// class Game () {

// }

const fieldOfGame = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// if field is not square we should use two variables for its sizes
const fieldSize = fieldOfGame.length;
let movable = false;
let countMovedCells = 0;
let numberOfMergeableCells = 0;
let currentScore = 0;

render('prepareForStart', 'prepareForStart');

function findEmptyCells() {
  const cellsArray = [];

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame[i][j] === 0) {
        cellsArray.push(`${i}${j}`);
      }
    }
  }

  if (cellsArray.length === 0) {
    movable = false;
  } else {
    movable = true;
  }

  return cellsArray;
}

function defineCreatingCellValue() {
  const isFour = parseInt(Math.random() * 10) + 1;

  if (isFour === 4) {
    return 4;
  } else {
    return 2;
  }
}

function findCoordsForNewCell() {
  const emptyCellsArray = findEmptyCells();

  const cellForCreationNumber
    = parseInt(Math.random() * emptyCellsArray.length);

  return emptyCellsArray[cellForCreationNumber].split('');
}

function createCell() {
  const cellCoords = findCoordsForNewCell();

  fieldOfGame[+cellCoords[0]][+cellCoords[1]] = defineCreatingCellValue();
}

function startGame() {
  countMovedCells = 0;
  currentScore = 0;

  clearCells();
  createCell();
  createCell();

  render('start', 'start');

  document.addEventListener('keydown', handleArrowPress);
}

function clearCells() {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      fieldOfGame[i][j] = 0;
    }
  }
}

function changeCellClass(cell, cellNewValue) {
  if (cell.classList.contains(`field-cell--${cell.innerText}`)) {
    cell.classList.remove(`field-cell--${cell.innerText}`);
  }

  if (cellNewValue !== 0) {
    cell.classList.add(`field-cell--${cellNewValue}`);
  }
}

function renderfieldOfGame() {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame[i][j] !== 0) {
        changeCellClass(fieldRows[i].cells[j], fieldOfGame[i][j]);
        fieldRows[i].cells[j].innerText = fieldOfGame[i][j];
      } else {
        changeCellClass(fieldRows[i].cells[j], fieldOfGame[i][j]);
        fieldRows[i].cells[j].innerText = '';
      }
    }
  }
}

function renderMesage(currentMesage) {
  switch (currentMesage) {
    case 'win':
      winMessage.classList.remove('hidden');
      break;

    case 'lose':
      loseMessage.classList.remove('hidden');
      break;

    case 'prepareForStart':
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.remove('hidden');
      break;

    case 'start':
      startMessage.classList.add('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
  }
}

function renderButton(buttonType) {
  const startButton = document.querySelector('.start');

  switch (buttonType) {
    case 'prepareForStart':
      startButton.addEventListener('click', () => startGame());

      startButton.classList.add('start');
      startButton.innerText = 'Start';

      break;

    case 'start':
      if (startButton) {
        startButton.classList.add('restart');
        startButton.innerText = 'Restart';
      }

      break;
  }
}

function render(message, button) {
  renderfieldOfGame();
  scoreboard.innerText = currentScore;
  renderMesage(message);
  renderButton(button);
}

function createMatrixClone() {
  const matrixClone = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      matrixClone[i][j] = fieldOfGame[i][j];
    }
  }

  return matrixClone;
}

function getTargetValue(fieldTemp, rotationDirection, row, column) {
  let targetValue;

  switch (rotationDirection) {
    case 'left':
      targetValue = fieldTemp[column][fieldSize - row - 1];
      break;

    case 'right':
      targetValue = fieldTemp[fieldSize - column - 1][row];
      break;

    case 'down':
      targetValue = fieldTemp[fieldSize - row - 1][column];
      break;
  }

  return targetValue;
}

function rotateMatrix(direction) {
  const tempField = createMatrixClone(fieldOfGame);

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      fieldOfGame[i][j] = getTargetValue(tempField, direction, i, j);
    }
  }
}

function moveCells() {
  for (let i = fieldSize - 1; i > 0; i--) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame[i - 1][j] === 0 && fieldOfGame[i][j] !== 0) {
        fieldOfGame[i - 1][j] = fieldOfGame[i][j];
        fieldOfGame[i][j] = 0;
        countMovedCells++;
      }
    }
  }
}

function mergeCells() {
  for (let i = 0; i < fieldSize - 1; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame[i][j] === fieldOfGame[i + 1][j]
          && fieldOfGame[i][j] !== 0) {
        fieldOfGame[i][j] = fieldOfGame[i + 1][j] * 2;
        fieldOfGame[i + 1][j] = 0;
        currentScore += fieldOfGame[i][j];
        countMovedCells++;
      }
    }
  }
}

function makeChanges() {
  for (let i = 0; i < fieldSize - 1; i++) {
    moveCells();
  }

  mergeCells();

  for (let i = 0; i < fieldSize - 1; i++) {
    moveCells();
  }
}

function findCellsForMerge() {
  for (let i = 0; i < fieldSize - 1; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame !== 0) {
        if (fieldOfGame[i][j] === fieldOfGame[i + 1][j]) {
          numberOfMergeableCells++;

          return;
        }
      }
    }
  }

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize - 1; j++) {
      if (fieldOfGame !== 0) {
        if (fieldOfGame[i][j] === fieldOfGame[i][j + 1]) {
          numberOfMergeableCells++;

          return;
        }
      }
    }
  }
}

function checkWinScenario() {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (fieldOfGame[i][j] === 2048) {
        return true;
      }
    }
  }
}

function checkLoseScenario() {
  if (!movable && numberOfMergeableCells === 0) {
    return true;
  }
}

function prepareForNewRound() {
  document.addEventListener('keydown', handleArrowPress);
  countMovedCells = 0;
  movable = false;
  numberOfMergeableCells = 0;

  render('start', 'start');
}

function finishRound() {
  if (countMovedCells === 0) {
    return;
  }

  document.removeEventListener('keydown', handleArrowPress);

  if (checkWinScenario()) {
    render('start', 'start');

    setTimeout(() => {
      finishGame('win');
    }, 1000);

    return;
  }

  setTimeout(createCell, 200);

  setTimeout(() => {
    findEmptyCells();
    findCellsForMerge();

    if (checkLoseScenario()) {
      render('start', 'start');
      finishGame('lose');

      return;
    }

    prepareForNewRound();
  }, 300);
}

function finishGame(gameResult) {
  document.removeEventListener('keydown', handleArrowPress);

  clearCells();

  currentScore = 0;

  if (gameResult === 'win') {
    render('win', 'start');
  } else {
    loseMessage.classList.remove('hidden');
  }
}

function handleArrowPress(e) {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      makeChanges();
      finishRound();
      break;

    case 'ArrowDown':
      rotateMatrix('down');
      makeChanges();
      rotateMatrix('down');
      finishRound();
      break;

    case 'ArrowLeft':
      rotateMatrix('right');
      makeChanges();
      rotateMatrix('left');
      finishRound();
      break;

    case 'ArrowRight':
      rotateMatrix('left');
      makeChanges();
      rotateMatrix('right');
      finishRound();
      break;
  }
}
