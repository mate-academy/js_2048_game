'use strict';

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const button = document.querySelector('button');
const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const rowsArr = [...document.querySelectorAll('.field-row')];
const cellsArr = [...document.querySelectorAll('.field-cell')];
const gameScore = document.querySelector('.game-score');
const pointsToWin = 2048;
const width = 4;
let result = 0;

function gameBeginning() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  launchingRandom();
  launchingRandom();
}

function empty() {
  for (let row = 0; row < width; row++) {
    for (let cell = 0; cell < width; cell++) {
      if (field[row][cell] === 0) {
        return true;
      }
    }
  }

  return false;
};

function withoutZero(quadrates) {
  return quadrates.filter(item => item > 0);
}

const squareValue = (place, num) => {
  place.classList = `field-cell--${num} field-cell`;
  place.innerText = '';

  if (num > 0) {
    place.innerText = num;
  }

  if (num === pointsToWin) {
    messageWin.classList.remove('hidden');
  }
};

function launchingRandom() {
  if (!empty()) {
    return;
  }

  let noEmptySpaces = false;

  while (noEmptySpaces === false) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * width);

    if (field[x][y] === 0) {
      const place = rowsArr[x].children[y];

      if (Math.random() > 0.9) {
        field[x][y] = 4;
        squareValue(place, 4);
      } else {
        field[x][y] = 2;
        squareValue(place, 2);
      }

      noEmptySpaces = true;
    }
  }
}

function connection(row) {
  let arr = withoutZero(row);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] += arr[i + 1];
      arr[i + 1] = 0;
      result += arr[i];
    }
  }

  gameScore.innerHTML = result;
  arr = withoutZero(arr);

  while (arr.length < width) {
    arr.push(0);
  }

  return arr;
}

function invert(items) {
  return items.map((value, cell) => items.map(row => row[cell]));
}

function checkConnection() {
  const invertField = invert([...field]);

  for (let row = 0; row < width; row++) {
    for (let cell = 0; cell < width - 1; cell++) {
      if (field[row][cell] === field[row][cell + 1]
      || invertField[row][cell] === invertField[row][cell + 1]) {
        return true;
      }
    }
  }

  return false;
}

function moveRight() {
  for (let row = 0; row < width; row++) {
    let el = field[row].reverse();

    el = connection(el).reverse();
    field[row] = el;

    for (let cell = 0; cell < width; cell++) {
      const place = rowsArr[row].children[cell];
      const number = field[row][cell];

      squareValue(place, number);
    }
  }
}

function moveLeft() {
  for (let row = 0; row < width; row++) {
    let el = field[row];

    el = connection(el);
    field[row] = el;

    for (let cell = 0; cell < width; cell++) {
      const place = rowsArr[row].children[cell];
      const number = field[row][cell];

      squareValue(place, number);
    }
  }
}

function moveUp() {
  for (let cell = 0; cell < width; cell++) {
    let el = field.map(item => item[cell]);

    el = connection(el);

    for (let row = 0; row < width; row++) {
      field[row][cell] = el[row];

      const place = rowsArr[row].children[cell];
      const number = field[row][cell];

      squareValue(place, number);
    }
  }
}

function moveDown() {
  for (let cell = 0; cell < width; cell++) {
    let el = field.map(item => item[cell]).reverse();

    el = connection(el).reverse();

    for (let row = 0; row < width; row++) {
      field[row][cell] = el[row];

      const place = rowsArr[row].children[cell];
      const number = field[row][cell];

      squareValue(place, number);
    }
  }
}

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    gameBeginning();
  }

  if (start.classList.contains('restart')) {
    cellsArr.forEach(i => squareValue(i, 0));
    messageLose.classList.add('hidden');
    result = 0;
    gameScore.innerHTML = result;
    gameBeginning();
  }
});

document.addEventListener('keydown', (e) => {
  if (button.innerText === 'Start') {
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      launchingRandom();
      break;
    case 'ArrowLeft':
      moveLeft();
      launchingRandom();
      break;
    case 'ArrowUp':
      moveUp();
      launchingRandom();
      break;
    case 'ArrowDown':
      moveDown();
      launchingRandom();
      break;
    default:
      break;
  }

  if (!checkConnection() && !empty()) {
    messageLose.classList.remove('hidden');
  }
});
