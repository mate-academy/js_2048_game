'use strict';

const controls = document.querySelector('.controls');
const gameFieldDOM = document.querySelector('.game-field');
const rows = gameFieldDOM.rows;
const arrayRows = [...rows];
const startMessage = document.querySelector('.message-start');
const victoryMessage = document.querySelector('.message-win');
const defeatMessage = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const fieldCell = 'field-cell';
const fieldSize = 4;
const delayTime = 200;
const gameField = createGameField();
let gameFieldBeforeMoving;
let gameFieldAfterMoving;
let score = 0;
let stepPossible = true;
let cellsHaveChanged = false;
let victory = false;

controls.addEventListener('click', e => {
  const start = e.target.closest('.start');
  const restart = e.target.closest('.restart');

  if (start) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerHTML = 'Restart';

    manageMessage();
    addNumberToCell(2);
    setTimeout(() => renderGameField(), delayTime);
  }

  if (restart) {
    stepPossible = true;
    cellsHaveChanged = false;
    victory = false;
    score = 0;
    gameScore.innerHTML = score;
    gameField.map(row => row.fill(''));

    manageMessage();
    renderGameField();
    addNumberToCell(2);
    setTimeout(() => renderGameField(), delayTime);
  }
});

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowUp':
      e.preventDefault();
      gameFieldBeforeMoving = createGameField();
      moveCellsUp();
      renderGameField();
      gameFieldAfterMoving = createGameField();
      checkCellChange();
      addNumberToCell();
      checkTheNextStep();

      setTimeout(() => {
        renderGameField();
        manageMessage();
      }, delayTime);
      break;
    case 'ArrowRight':
      e.preventDefault();
      gameFieldBeforeMoving = createGameField();
      moveCellsRight();
      renderGameField();
      gameFieldAfterMoving = createGameField();
      checkCellChange();
      addNumberToCell();
      checkTheNextStep();

      setTimeout(() => {
        renderGameField();
        manageMessage();
      }, delayTime);
      break;
    case 'ArrowDown':
      e.preventDefault();
      gameFieldBeforeMoving = createGameField();
      moveCellsDown();
      renderGameField();
      gameFieldAfterMoving = createGameField();
      checkCellChange();
      addNumberToCell();
      checkTheNextStep();

      setTimeout(() => {
        renderGameField();
        manageMessage();
      }, delayTime);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      gameFieldBeforeMoving = createGameField();
      moveCellsLeft();
      renderGameField();
      gameFieldAfterMoving = createGameField();
      checkCellChange();
      addNumberToCell();
      checkTheNextStep();

      setTimeout(() => {
        renderGameField();
        manageMessage();
      }, delayTime);
      break;
  }
});

function createGameField() {
  return arrayRows
    .map(({ cells }) => [...cells]
      .map(({ innerHTML }) => innerHTML));
}

function getPosisionCell() {
  return Math.floor(Math.random() * fieldSize);
}

function addNumberToCell(repeatCount = 1) {
  if (repeatCount) {
    if (!cellsHaveChanged && stepPossible && !victory) {
      const chance = Math.random();
      let number;

      chance < 0.9 ? number = 2 : number = 4;

      let indexRow;
      let indexColl;

      do {
        indexRow = getPosisionCell();
        indexColl = getPosisionCell();
      } while (gameField[indexRow][indexColl] !== '');

      gameField[indexRow][indexColl] = number;
    }

    return addNumberToCell(repeatCount - 1);
  }
}

function moveCellsUp() {
  if (stepPossible && !victory) {
    for (let coll = 0; coll < fieldSize; coll++) {
      for (let row = 1; row < fieldSize; row++) {
        if (gameField[row][coll]) {
          let numRow = row;

          while (numRow > 0) {
            if (!gameField[numRow - 1][coll]) {
              gameField[numRow - 1][coll] = gameField[numRow][coll];
              gameField[numRow][coll] = '';
              numRow--;
            } else if (gameField[numRow - 1][coll]
                === gameField[numRow][coll]) {
              gameField[numRow - 1][coll] *= 2;
              score += gameField[numRow - 1][coll];
              gameScore.innerHTML = score;
              gameField[numRow][coll] = '';
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
}

function moveCellsRight() {
  if (stepPossible && !victory) {
    for (let row = 0; row < fieldSize; row++) {
      for (let coll = fieldSize - 2; coll >= 0; coll--) {
        if (gameField[row][coll]) {
          let numColl = coll;

          while (numColl + 1 < fieldSize) {
            if (!gameField[row][numColl + 1]) {
              gameField[row][numColl + 1] = gameField[row][numColl];
              gameField[row][numColl] = '';
              numColl++;
            } else if (gameField[row][numColl]
                === gameField[row][numColl + 1]) {
              gameField[row][numColl + 1] *= 2;
              score += gameField[row][numColl + 1];
              gameScore.innerHTML = score;
              gameField[row][numColl] = '';
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
}

function moveCellsDown() {
  if (stepPossible && !victory) {
    for (let coll = 0; coll < fieldSize; coll++) {
      for (let row = fieldSize - 2; row >= 0; row--) {
        if (gameField[row][coll]) {
          let numRow = row;

          while (numRow + 1 < fieldSize) {
            if (!gameField[numRow + 1][coll]) {
              gameField[numRow + 1][coll] = gameField[numRow][coll];
              gameField[numRow][coll] = '';
              numRow++;
            } else if (gameField[numRow + 1][coll]
                === gameField[numRow][coll]) {
              gameField[numRow + 1][coll] *= 2;
              score += gameField[numRow + 1][coll];
              gameScore.innerHTML = score;
              gameField[numRow][coll] = '';
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
}

function moveCellsLeft() {
  if (stepPossible && !victory) {
    for (let row = 0; row < fieldSize; row++) {
      for (let coll = 1; coll < fieldSize; coll++) {
        if (gameField[row][coll]) {
          let numColl = coll;

          while (numColl - 1 >= 0) {
            if (!gameField[row][numColl - 1]) {
              gameField[row][numColl - 1] = gameField[row][numColl];
              gameField[row][numColl] = '';
              numColl--;
            } else if (gameField[row][numColl]
                === gameField[row][numColl - 1]) {
              gameField[row][numColl - 1] *= 2;
              score += gameField[row][numColl - 1];
              gameScore.innerHTML = score;
              gameField[row][numColl] = '';
              break;
            } else {
              break;
            }
          }
        }
      }
    }
  }
}

function checkCellChange() {
  let count = 0;

  for (let row = 0; row < fieldSize; row++) {
    for (let coll = 0; coll < fieldSize; coll++) {
      if (gameFieldBeforeMoving[row][coll]
          !== gameFieldAfterMoving[row][coll]) {
        count++;
      }
    }
  }

  cellsHaveChanged = !count;
}

function checkTheNextStep() {
  const freeCellsAreAbsent = gameField
    .map(row => row.findIndex(cell => cell === ''))
    .every(value => value === -1);

  if (freeCellsAreAbsent) {
    let count = 0;

    for (let i = 0; i < fieldSize; i++) {
      for (let j = 1; j < fieldSize; j++) {
        if (gameField[i][j] === gameField[i][j - 1]
            || gameField[j][i] === gameField[j - 1][i]) {
          count++;
        }
      }
    }

    stepPossible = count;
  }
}

function renderGameField() {
  gameField.forEach((row, indexRow) => {
    row.forEach((cellValue, indexColl) => {
      rows[indexRow].cells[indexColl].innerHTML = cellValue;
      rows[indexRow].cells[indexColl].className = fieldCell;

      if (cellValue) {
        rows[indexRow]
          .cells[indexColl]
          .classList.add(`${fieldCell}--${cellValue}`);
      }

      if (cellValue === 2048) {
        victory = true;
      }
    });
  });
}

function manageMessage() {
  if (!startMessage.classList.contains('hidden')) {
    startMessage.classList.add('hidden');
  }

  if (!victoryMessage.classList.contains('hidden')) {
    victoryMessage.classList.add('hidden');
  }

  if (!defeatMessage.classList.contains('hidden')) {
    defeatMessage.classList.add('hidden');
  }

  if (victory) {
    victoryMessage.classList.remove('hidden');
  }

  if (!stepPossible) {
    defeatMessage.classList.remove('hidden');
  }
}
