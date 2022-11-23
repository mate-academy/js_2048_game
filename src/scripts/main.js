'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const fieldRows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const fieldSize = 4;
let gameScore = 0;

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];

button.addEventListener('click', clickEvent => {
  const target = clickEvent.target;

  document.addEventListener('keydown', move);

  if (target.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
    cellFilling();
    render();
    document.addEventListener('keydown', move);
  } else {
    restart();
  }

  cellFilling();
  render();
});

function cellFilling() {
  const [coordX, coordY] = emptyField();

  gameField[coordX][coordY] = Math.random() < 0.9 ? 2 : 4;
}

function emptyField() {
  const emptyCells = [];

  gameField.forEach((row, rowIndex) =>
    row.forEach((cell, columIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columIndex]);
      }
    }
    ));

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function render() {
  gameField.forEach((row, rowIndex) =>
    row.forEach((cell, columIndex) => {
      const element = fieldRows[rowIndex].children[columIndex];

      if (cell === 0) {
        element.textContent = '';
        element.className = 'field-cell';
      } else {
        element.textContent = cell;
        element.className = `field-cell field-cell--${cell}`;
      }
    }));

  score.innerText = gameScore;
}

function restart() {
  gameScore = 0;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]];
};

function move(clickEvent) {
  let changed;

  switch (clickEvent.key) {
    case 'ArrowLeft':
      changed = moveLeft();
      break;

    case 'ArrowRight':
      changed = moveRight();
      break;

    case 'ArrowUp':
      changed = moveUp();
      break;

    case 'ArrowDown':
      changed = moveDown();
      break;
  }

  if (checkWin()) {
    win();
  }

  if (changed) {
    cellFilling();
    render();
  }

  if (check()) {
    lose();
  }
}

function slide(array, size) {
  function filterEmpty(filterArrey) {
    return filterArrey.filter(item => item !== 0);
  }

  let newArray = filterEmpty(array);

  if (newArray.length > 0) {
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i] === newArray[i + 1]) {
        newArray[i] *= 2;
        newArray[i + 1] = 0;
        gameScore += newArray[i];
      }
    }
  }

  newArray = filterEmpty(newArray);

  while (newArray.length < size) {
    newArray.push(0);
  }

  return newArray;
}

function slideLeft(arr) {
  let isChanged = false;

  for (let y = 0; y < fieldSize; y++) {
    const oldArr = [...arr[y]];

    arr[y] = slide(arr[y], fieldSize);
    isChanged = isChanged || arr[y].join(',') !== oldArr.join(',');
  }

  return isChanged;
}

function reverse() {
  gameField.forEach(row => row.reverse());
}

function swap(xCol, yCol, xRow, yRow) {
  const temp = gameField[xCol][yCol];

  gameField[xCol][yCol] = gameField[xRow][yRow];
  gameField[xRow][yRow] = temp;
}

function rotateField() {
  for (let x = 0; x < fieldSize; x++) {
    for (let y = 0; y < x; y++) {
      swap(x, y, y, x);
    }
  }
}

function moveLeft() {
  return slideLeft(gameField);
}

function moveRight() {
  reverse();

  const changed = moveLeft();

  reverse();

  return changed;
}

function moveUp() {
  rotateField();

  const changed = moveLeft();

  rotateField();

  return changed;
}

function moveDown() {
  rotateField();

  const changed = moveRight();

  rotateField();

  return changed;
}

function check() {
  if (!gameField.map(item =>
    item.every(row => row !== 0)).every(item => item)) {
    return false;
  }

  for (let x = 0; x < fieldSize - 1; x++) {
    const lastRow = gameField[3][x];

    if (lastRow !== 0 && lastRow === gameField[3][x + 1]) {
      return false;
    }

    for (let y = 0; y < fieldSize; y++) {
      const element = gameField[x][y];

      if (element !== 0
        && (element === gameField[x][y + 1]
          || element === gameField[x + 1][y])) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  for (const key of gameField) {
    if (key.includes(2048)) {
      return true;
    }
  }

  return false;
}

function lose() {
  messageLose.classList.remove('hidden');
}

function win() {
  messageWin.classList.remove('hidden');
}
