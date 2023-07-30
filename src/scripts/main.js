'use strict';

const table = document.querySelector('tbody');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

const rowsCount = 4;
const colsCount = 4;
let field;
let score;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  gameScore.textContent = score;

  addRandomCell();
  addRandomCell();
});

document.addEventListener('keydown', (e) => {
  const oldField = deepCopyArray(field);

  if (
    !isMoved(moveUp(oldField))
    && !isMoved(moveDown(oldField))
    && !isMoved(moveRight(oldField))
    && !isMoved(moveLeft(oldField))
  ) {
    loseMessage.classList.remove('hidden');

    return false;
  }

  switch (e.key) {
    case 'ArrowUp':
      field = deepCopyArray(moveUp(field));
      break;
    case 'ArrowDown':
      field = deepCopyArray(moveDown(field));
      break;
    case 'ArrowRight':
      field = deepCopyArray(moveRight(field));
      break;
    case 'ArrowLeft':
      field = deepCopyArray(moveLeft(field));
      break;
  }

  if (isMoved(oldField)) {
    addRandomCell();
    gameScore.textContent = `${score}`;
  }

  if (isWin()) {
    winMessage.classList.remove('hidden');
  }
});

function isWin() {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < colsCount; j++) {
      if (field[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function deepCopyArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function isMoved(oldField) {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < colsCount; j++) {
      if (oldField[i][j] !== field[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function moveUp(inputField) {
  const movedField = deepCopyArray(inputField);

  for (let i = 0; i < rowsCount; i++) {
    let newColumn = [
      movedField[0][i],
      movedField[1][i],
      movedField[2][i],
      movedField[3][i],
    ];

    newColumn = move(newColumn.reverse()).reverse();

    for (let j = 0; j < newColumn.length; j++) {
      movedField[j][i] = newColumn[j];
    }
  }

  return movedField;
}

function moveDown(inputField) {
  const movedField = deepCopyArray(inputField);

  for (let i = 0; i < rowsCount; i++) {
    let newColumn = [
      movedField[0][i],
      movedField[1][i],
      movedField[2][i],
      movedField[3][i],
    ];

    newColumn = move(newColumn);

    for (let j = 0; j < newColumn.length; j++) {
      movedField[j][i] = newColumn[j];
    }
  }

  return movedField;
}

function moveRight(inputField) {
  const movedField = deepCopyArray(inputField);

  for (let i = 0; i < rowsCount; i++) {
    let newRow = movedField[i];

    newRow = move(newRow);

    for (let j = 0; j < newRow.length; j++) {
      movedField[i][j] = newRow[j];
    }
  }

  return movedField;
}

function moveLeft(inputField) {
  const movedField = deepCopyArray(inputField);

  for (let i = 0; i < rowsCount; i++) {
    let newRow = movedField[i];

    newRow = move(newRow.reverse()).reverse();

    for (let j = 0; j < newRow.length; j++) {
      movedField[i][j] = newRow[j];
    }
  }

  return movedField;
}

function move(array) {
  const movedArr = zerosInStart(array);

  for (let i = movedArr.length; i > 0; i--) {
    if (movedArr[i] === movedArr[i - 1]) {
      movedArr[i] += movedArr[i];
      score += movedArr[i];
      movedArr[i - 1] = 0;
    }
  }

  return zerosInStart(movedArr);
}

function zerosInStart(array) {
  const movedArr = array.filter((cell) => cell !== 0);
  const startIndex = movedArr.length;

  for (let i = startIndex; i < array.length; i++) {
    movedArr.unshift(0);
  }

  return movedArr;
}

function addRandomCell() {
  while (true) {
    const rowIndex = Math.floor(Math.random() * rowsCount);
    const colIndex = Math.floor(Math.random() * colsCount);

    if (field[rowIndex][colIndex] === 0) {
      field[rowIndex][colIndex] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  }

  renderField();
}

function renderField() {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < colsCount; j++) {
      table.rows[i].cells[j].className = '';
      table.rows[i].cells[j].classList.add('field-cell');
      table.rows[i].cells[j].classList.add(`field-cell--${field[i][j]}`);
      table.rows[i].cells[j].textContent = field[i][j] || '';
    }
  }
}
