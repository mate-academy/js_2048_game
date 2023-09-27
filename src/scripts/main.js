'use strict';

// window variables:
const page = document.documentElement;
const score = document.querySelector('.game_score');
const best = document.querySelector('.game_best');
const info = document.querySelector('.info');
const startBtn = document.querySelector('.button, .start');
const startMassage = document.querySelector('.message_start');
const winMessage = document.querySelector('.message_win');
const loseMessage = document.querySelector('.message_lose');
const cells = document.querySelectorAll('.field_cell');

// JS variables:
let scoreValue = 0;
let bestValue = 0;
let movingValuePossition = null;
let newValuePlace = null;
let canMove = null;
const fieldLength = 3;

let values = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// compile values to cells.
function valuesTocells(row, column = 0) {
  return cells[(row) * 4 + column];
}

// adding random element(2/4) on random empty cell if there enought move.
function addElement() {
  const hasEmptyCell = values.some(row => row.includes(0));
  let isRowWithSameValue = null;
  let isColumnWithSameValue = null;

  for (let row = 1; row <= fieldLength; row++) {
    for (let column = 0; column <= fieldLength; column++) {
      if (values[row][column] === values[row - 1][column]) {
        isRowWithSameValue = true;
      }
    }
  }

  for (let row = 0; row <= fieldLength; row++) {
    for (let column = 1; column <= fieldLength; column++) {
      if (values[row][column] === values[row][column - 1]) {
        isColumnWithSameValue = true;
      }
    }
  }

  if (hasEmptyCell
  || isRowWithSameValue || isColumnWithSameValue) {
    canMove = true;
  }

  if (canMove) {
    let randomNum = Math.random();
    let random2VS4 = null;
    let randomRow = Math.round(Math.random() * (3 - 0) + 0);
    let randomColumn = Math.round(Math.random() * (3 - 0) + 0);

    for (let i = 0; i <= 100; i++) {
      if (values[randomRow][randomColumn] === 0) {
        if (randomNum > 0.1) {
          random2VS4 = 2;
        } else {
          random2VS4 = 4;
        }
        values[randomRow][randomColumn] = random2VS4;
        valuesTocells(randomRow, randomColumn).textContent = random2VS4;

        valuesTocells(randomRow, randomColumn)
          .classList.add(`field_cell--${random2VS4}`);
        break;
      } else {
        randomNum = Math.random();
        randomRow = Math.round(Math.random() * (3 - 0) + 0);
        randomColumn = Math.round(Math.random() * (3 - 0) + 0);
        continue;
      }
    }
  } else {
    return loseMessage.classList.remove('hidden');
  }

  canMove = null;
}

function delayedAddElement() {
  window.setTimeout(addElement, 300);
  canMove = null;
}

// addind new modifier to cell.
function addModifier(row, column) {
  if (values[row][column] > 0) {
    for (let modifier = 2; modifier <= 2048; modifier *= 2) {
      if (modifier === values[row][column]) {
        valuesTocells(row, column)
          .classList.add(`field_cell--${modifier}`);
        break;
      }
    }
  }

  return cells;
}

// remove modifier from cell.
function removeModifier(row, column) {
  if (values[row][column] > 0) {
    const allModifier = [];

    for (let modifier = 2; modifier <= 2048; modifier *= 2) {
      if (valuesTocells(row, column).classList
        .contains(`field_cell--${modifier}`)) {
        allModifier.push(`field_cell--${modifier}`);
      }
    }

    allModifier.map(modifier => valuesTocells(row, column)
      .classList.remove(modifier));
  }

  return cells;
}

// set new value, modifier for current cell position.
function updateCurCell(word, row, column, adding) {
  if (adding) {
    values[row][column] = movingValuePossition + adding;
    scoreValue += values[row][column];
    score.textContent = scoreValue;

    if (bestValue < scoreValue) {
      bestValue = scoreValue;
    }
    best.textContent = bestValue;

    if (values[row][column] >= 2048) {
      winMessage.classList.remove('hidden');
    }
  } else {
    values[row][column] = movingValuePossition;
  }

  if (word === 'r') {
    valuesTocells(row, column).textContent = values[newValuePlace][column];
    addModifier((row), column);
  } else {
    valuesTocells(row, column).textContent = values[row][newValuePlace];
    addModifier((row), column);
  }
}

// remove value, modifier from old cell position.
function updatePrevCell(row, column) {
  removeModifier(row, column);
  values[row][column] = 0;
  valuesTocells(row, column).textContent = '';
}

function moveUp() {
  for (let row = 0; row < values.length; row++) {
    for (let column = 0; column < values[row].length; column++) {
      if (values[row][column] !== 0 && row !== 0) {
        movingValuePossition = values[row][column];

        for (let prevRow = row - 1; prevRow >= 0;) {
          if (values[prevRow][column] === 0) {
            if (prevRow !== 0) {
              prevRow--;
              continue;
            } else {
              newValuePlace = prevRow;
              canMove = true;
              updateCurCell('r', newValuePlace, column);
              updatePrevCell(row, column);
              break;
            }
          } else if (values[prevRow][column] === movingValuePossition) {
            newValuePlace = prevRow;
            canMove = true;
            updateCurCell('r', newValuePlace, column, movingValuePossition);
            updatePrevCell(row, column);
            break;
          } else if (values[prevRow][column] > 0) {
            newValuePlace = prevRow + 1;

            if (row - prevRow > 1) {
              canMove = true;
              updateCurCell('r', newValuePlace, column);
              updatePrevCell(row, column);
            }
            updateCurCell('r', newValuePlace, column);
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    delayedAddElement();
  }
}

function moveDown() {
  for (let row = values.length - 1; row >= 0; row--) {
    for (let column = 0; column < values.length; column++) {
      if (values[row][column] !== 0 && row !== 3) {
        movingValuePossition = values[row][column];

        for (let nextRow = row + 1; nextRow <= values.length;) {
          if (values[nextRow][column] === 0) {
            if (nextRow !== 3) {
              nextRow++;
              continue;
            } else {
              newValuePlace = nextRow;
              canMove = true;
              updateCurCell('r', newValuePlace, column);
              updatePrevCell(row, column);
              break;
            }
          } else if (values[nextRow][column] === movingValuePossition) {
            newValuePlace = nextRow;
            canMove = true;
            updateCurCell('r', newValuePlace, column, movingValuePossition);
            updatePrevCell(row, column);
            break;
          } else if (values[nextRow][column] > 0) {
            newValuePlace = nextRow - 1;

            if (nextRow - row > 1) {
              canMove = true;
              updateCurCell('r', newValuePlace, column);
              updatePrevCell(row, column);
            }
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    delayedAddElement();
  }
}

function moveRight() {
  for (let row = 0; row < values.length; row++) {
    for (let column = values[row].length - 1; column >= 0; column--) {
      if (values[row][column] !== 0 && column !== 3) {
        movingValuePossition = values[row][column];

        for (let prevColumn = column + 1; prevColumn <= 3;) {
          if (values[row][prevColumn] === 0) {
            if (prevColumn !== 3) {
              prevColumn++;
              continue;
            } else {
              newValuePlace = prevColumn;
              canMove = true;
              updateCurCell('c', row, newValuePlace);
              updatePrevCell(row, column);
              break;
            }
          } else if (values[row][prevColumn] === movingValuePossition) {
            newValuePlace = prevColumn;
            canMove = true;
            updateCurCell('c', row, newValuePlace, movingValuePossition);
            updatePrevCell(row, column);
            break;
          } else if (values[row][prevColumn] > 0) {
            newValuePlace = prevColumn - 1;

            if (prevColumn - column > 1) {
              canMove = true;
              updateCurCell('c', row, newValuePlace);
              updatePrevCell(row, column);
            }
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    delayedAddElement();
  }
}

function moveLeft() {
  for (let row = 0; row < values.length; row++) {
    for (let column = 0; column < values[row].length; column++) {
      if (values[row][column] !== 0 && column !== 0) {
        movingValuePossition = values[row][column];

        for (let nextColumn = column - 1; nextColumn >= 0;) {
          if (values[row][nextColumn] === 0) {
            if (nextColumn !== 0) {
              nextColumn--;
              continue;
            } else {
              newValuePlace = nextColumn;
              canMove = true;
              updateCurCell('c', row, newValuePlace);
              updatePrevCell(row, column);
              break;
            }
          } else if (values[row][nextColumn] === movingValuePossition) {
            newValuePlace = nextColumn;
            canMove = true;
            updateCurCell('c', row, newValuePlace, movingValuePossition);
            updatePrevCell(row, column);
            break;
          } else if (values[row][nextColumn] > 0) {
            newValuePlace = nextColumn + 1;

            if (column - nextColumn > 1) {
              canMove = true;
              updateCurCell('c', row, newValuePlace);
              updatePrevCell(row, column);
            }
            break;
          }
        }
      }
    }
  }

  if (canMove) {
    delayedAddElement();
  }
}

// duties of Start/Restart button.
startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    startMassage.classList.add('hidden');
    addElement();
    addElement();
    info.classList.add('active');
  } else {
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
    score.textContent = 0;
    scoreValue = 0;
    info.classList.remove('active');
    loseMessage.classList.add('hidden');
    startMassage.classList.remove('hidden');

    const allModifier = [];

    for (let modifier = 2; modifier <= 2048; modifier *= 2) {
      allModifier.push(`field_cell--${modifier}`);
    }

    cells.forEach(cell => {
      cell.textContent = '';
      allModifier.map(modifier => cell.classList.remove(modifier));

      return cell;
    });
    values = values.map(row => row.map(() => 0));
  }
});

// duties of arrows.
page.addEventListener('keydown', function(e) {
  e.preventDefault();

  const key = e.key;

  switch (true) {
    case (key === 'ArrowUp'):
      moveUp();
      break;
    case (key === 'ArrowDown'):
      moveDown();
      break;
    case (key === 'ArrowRight'):
      moveRight();
      break;
    case (key === 'ArrowLeft'):
      moveLeft();
      break;
  }
});
