'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = Array.from(document.querySelectorAll('.field-cell'));
const gameScore = document.querySelector('.game-score');

const rows = 4;
const columns = 4;
let score = 0;
let field = Array.from({ length: columns }, () => Array(rows).fill(0));

updateInterface();

button.addEventListener('click', () => {
  field = Array.from({ length: columns }, () => Array(rows).fill(0));

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  updateInterface();
  makeItem(2);
  updateInterface();
});

function removeClassesExceptOne(element, classToKeep = ('field-cell')) {
  const classes = element.classList;
  const classesToRemove = Array.from(classes);

  classesToRemove.forEach(function(className) {
    if (className !== classToKeep) {
      classes.remove(className);
    }
  });
}

function getRandom(countVars) {
  return Math.round(Math.random() * (countVars - 1));
}

function makeItem(countOfItems = 1) {
  updateInterface();

  let randomRow = getRandom(rows);
  let randomCol = getRandom(columns);

  if (messageWin.classList.contains('hidden')) {
    if (messageStart.classList.length === 3) {
      if (field.some(x => x.some(y => y === 0))) {
        for (let i = 0; i < countOfItems; i++) {
          while (field[randomRow][randomCol] !== 0) {
            randomRow = getRandom(rows);
            randomCol = getRandom(columns);
          }

          const value = getRandom(100) < 10 ? 4 : 2;

          field[randomRow][randomCol] = value;
          updateInterface();
        }
      } else {
        messageLose.classList.remove('hidden');
      }
    }
  }
}

function updateInterface() {
  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = fieldCell[rowIndex * 4 + colIndex];

      cell.textContent = '';
      removeClassesExceptOne(cell);
      cell.classList.add('field-cell--0');
      cell.classList.add(`field-cell--${value}`);

      cell.textContent = value === 0 ? '' : value;
    });
  });
}

function isMoved(notMoved, moved) {
  for (let i = 0; i < notMoved.length; i++) {
    for (let j = 0; j < notMoved[0].length; j++) {
      if (notMoved[i][j] !== moved[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function slideRow() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let i = c;

      while (field[r][i] === 0 && i <= 3) {
        i++;

        if (i <= 3) {
          if (field[r][i] !== 0) {
            field[r][c] = field[r][i];
            field[r][i] = 0;
            i = 0;
            updateInterface();
          }
        }
      }
    }

    updateInterface();
  }
}

function canMove() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (field[i][j] === 0) {
        return true;
      }

      if (j < rows - 1 && field[i][j] === field[i][j + 1]) {
        return true;
      }

      if (i < columns - 1 && field[i][j] === field[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function slide() {
  const newMatrix = [];

  for (let i = 0; i < field.length; i++) {
    newMatrix[i] = field[i].slice();
  }

  slideRow();

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (field[row][column] === field[row][column + 1]) {
        field[row][column] *= 2;
        field[row][column + 1] = 0;
        score += field[row][column];
        updateInterface();
      }
    }
  }

  slideRow();

  if (isMoved(newMatrix, field)) {
    makeItem();
  }
}

function rotateField(countOfRotates = 1) {
  for (let k = 0; k < countOfRotates; k++) {
    for (let i = 0; i < fieldCell.length; i++) {
      removeClassesExceptOne(fieldCell[i]);
      fieldCell[i].textContent = '';
      updateInterface();
    }

    field = rotateMatrixClockwise(field);
  }

  updateInterface();
}

function rotateMatrixClockwise(matrix) {
  const result = Array.from({ length: columns }, () => Array(rows).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      result[j][rows - 1 - i] = matrix[i][j];
    }
  }

  return result;
}

document.addEventListener('keyup', function(eventKey) {
  switch (eventKey.code) {
    case 'ArrowLeft':
      rotateField(4);

      slide();
      updateInterface();

      break;

    case 'ArrowRight':
      rotateField(2);
      slide();
      rotateField(2);
      break;

    case 'ArrowUp':
      rotateField(3);
      slide();
      rotateField();
      break;

    case 'ArrowDown':
      rotateField();
      slide();
      rotateField(3);
      break;

    default:
      return;
  }

  if (!canMove()) {
    messageLose.classList.remove('hidden');
  }

  gameScore.textContent = score;

  if (fieldCell.some(x => x.classList.contains('field-cell--2048'))) {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
  }
});
