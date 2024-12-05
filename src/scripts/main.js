'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const mesStart = document.querySelector('.message-start');
const mesWin = document.querySelector('.message-win');
const mesLose = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
let statusGame = 'idle';
let scoreValue = 0;
const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameArr = [
  // [0, 0, 0, 0],
  // [0, 0, 0, 0],
  // [0, 0, 0, 0],
  // [0, 0, 0, 0],
];

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }
});

game.getScore = () => {
  return score.textContent;
};

game.getState = () => {
  return gameArr;
};

game.getStatus = () => {
  return statusGame;
};

game.start = function () {
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';

  if (!mesStart.className.includes('hidden')) {
    mesStart.classList.add('hidden');
  }

  if (!mesWin.className.includes('hidden')) {
    mesWin.classList.add('hidden');
  }

  if (!mesLose.className.includes('hidden')) {
    mesLose.classList.add('hidden');
  }
  statusGame = 'playing';
  gameArr = structuredClone(initialState);
  score.textContent = 0;

  for (let i = 0; i < 2; i++) {
    const row = Math.floor(Math.random() * 4);

    pushValue(gameArr[row]);
  }
  update();
};

game.restart = () => {
  button.classList.replace('restart', 'start');
  button.textContent = 'Start';
  mesStart.classList.remove('hidden');

  if (!mesWin.className.includes('hidden')) {
    mesWin.classList.add('hidden');
  }

  if (!mesLose.className.includes('hidden')) {
    mesLose.classList.add('hidden');
  }
  score.textContent = 0;
  statusGame = 'idle';
  gameArr = structuredClone(initialState);
  update();
};

game.moveLeft = function () {
  let testArr = structuredClone(gameArr);

  gameArr.forEach((item) => arrLeft(item));

  if (!compareArrays(testArr, gameArr)) {
    pushToDoubleArr(gameArr);
  }
  testArr = null;
  score.textContent = scoreValue;
  update();
};

game.moveRight = function () {
  let testArr = structuredClone(gameArr);

  gameArr.forEach((item) => arrRight(item));

  if (!compareArrays(testArr, gameArr)) {
    pushToDoubleArr(gameArr);
  }
  testArr = null;
  score.textContent = scoreValue;
  update();
};

game.moveUp = function () {
  let newArray = helperUp(gameArr);
  let testArr = structuredClone(gameArr);

  gameArr = structuredClone(newArray);
  newArray = null;

  if (!compareArrays(testArr, gameArr)) {
    pushToDoubleArr(gameArr);
  }
  testArr = null;
  score.textContent = scoreValue;
  update();
};

game.moveDown = function () {
  let newArray = helperDown(gameArr);
  let testArr = structuredClone(gameArr);

  gameArr = structuredClone(newArray);
  newArray = null;

  if (!compareArrays(testArr, gameArr)) {
    pushToDoubleArr(gameArr);
  }
  testArr = null;
  score.textContent = scoreValue;
  update();
};

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (ev.key === 'ArrowRight') {
    game.moveRight();
  }

  if (ev.key === 'ArrowUp') {
    game.moveUp();
  }

  if (ev.key === 'ArrowDown') {
    game.moveDown();
  }
});

//  -----------helps functions----------

function pushValue(arr) {
  if (arr.includes(0)) {
    const freeFields = arr
      .map((value, index) => (value === 0 ? index : null))
      .filter((index) => index !== null);

    const randomIndex =
      freeFields[Math.floor(Math.random() * freeFields.length)];

    arr[randomIndex] = Math.random() <= 0.1 ? 4 : 2;
  } else {
    return 'message-lose';
  }
}

function helperUp(arr) {
  const newArr = [];
  const resArr = [];

  for (let i = 0; i < 4; i++) {
    const subArr = [];

    for (let j = 0; j < 4; j++) {
      subArr.push(arr[j][i]);
    }
    newArr.push(subArr);
  }
  newArr.forEach((item) => arrLeft(item));

  for (let i = 0; i < 4; i++) {
    const subArr = [];

    for (let j = 0; j < 4; j++) {
      subArr.push(newArr[j][i]);
    }
    resArr.push(subArr);
  }

  return resArr;
}

function helperDown(arr) {
  const newArr = [];
  const resArr = [];

  for (let i = 0; i < 4; i++) {
    const subArr = [];

    for (let j = 0; j < 4; j++) {
      subArr.push(arr[j][i]);
    }
    newArr.push(subArr);
  }
  newArr.forEach((item) => arrRight(item));

  for (let i = 0; i < 4; i++) {
    const subArr = [];

    for (let j = 0; j < 4; j++) {
      subArr.push(newArr[j][i]);
    }
    resArr.push(subArr);
  }

  return resArr;
}

function arrLeft(el) {
  for (let i = el.length - 2; i >= 0; i--) {
    if (el[i] === 0 && el[i + 1] !== 0) {
      [el[i], el[i + 1]] = [el[i + 1], el[i]];
    }

    if (el[i] !== 0 && el[i + 1] === el[i]) {
      if (el[i - 1] === 0) {
        [el[i - 1], el[i + 1]] = [el[i + 1], el[i - 1]];
      }
    }
  }

  for (let i = 0; i < el.length - 1; i++) {
    if (el[i] === 0 && i + 2 < el.length) {
      [el[i], el[i + 1], el[i + 2]] = [el[i + 1], el[i + 2], 0];
    }

    if (el[i] !== 0 && el[i + 1] === el[i]) {
      [el[i], el[i + 1]] = [el[i + 1] + el[i], 0];
      scoreValue += el[i];
    }
  }

  for (let i = el.length - 2; i >= 0; i--) {
    if (el[i] === 0 && el[i + 1] !== 0) {
      [el[i], el[i + 1]] = [el[i + 1], el[i]];
    }

    if (el[i] !== 0 && el[i + 1] === el[i]) {
      if (el[i - 1] === 0) {
        [el[i - 1], el[i + 1]] = [el[i + 1], el[i - 1]];
      }
    }
  }

  return el;
}

function arrRight(el) {
  // const testArr = [...el];

  for (let i = 1; i < el.length; i++) {
    if (el[i] === 0 && el[i - 1] !== 0) {
      [el[i], el[i - 1]] = [el[i - 1], el[i]];
    }

    if (el[i] !== 0 && el[i - 1] === el[i]) {
      if (el[i + 1] === 0) {
        [el[i + 1], el[i - 1]] = [el[i - 1], el[i + 1]];
      }
    }
  }

  for (let i = el.length - 1; i >= 0; i--) {
    if (el[i] === 0 && i - 2 > 0) {
      [el[i], el[i - 1], el[i - 2]] = [el[i - 1], el[i - 2], 0];
    }

    if (el[i] !== 0 && el[i - 1] === el[i]) {
      [el[i], el[i - 1]] = [el[i - 1] + el[i], 0];
      scoreValue += el[i];
    }
  }

  for (let i = 1; i < el.length; i++) {
    if (el[i] === 0 && el[i - 1] !== 0) {
      [el[i], el[i - 1]] = [el[i - 1], el[i]];
    }

    if (el[i] !== 0 && el[i - 1] === el[i]) {
      if (el[i + 1] === 0) {
        [el[i + 1], el[i - 1]] = [el[i - 1], el[i + 1]];
      }
    }
  }
}

function update() {
  const arr = [];

  cells.forEach((el) => (el.className = 'field-cell'));

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      arr.push(gameArr[i][j]);
    }
  }

  if (arr.includes(2048)) {
    mesWin.classList.remove('hidden');
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      cells[i].textContent = arr[i];
    }

    if (arr[i] === 0) {
      cells[i].textContent = '';
    }
  }

  cells.forEach((element) => {
    if (element.textContent > 0) {
      element.classList.add(`field-cell--${element.textContent}`);
    }
  });

  const checkCellsArr = [];
  let noMoves = false;

  for (let i = 0; i < 4; i++) {
    const subArr = [];

    for (let j = 0; j < 4; j++) {
      subArr.push(gameArr[j][i]);
    }
    checkCellsArr.push(subArr);
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (!gameArr[i].includes(0) && gameArr[i][j] === gameArr[i][j + 1]) {
        noMoves = true;
      }
    }

    if (gameArr[i].includes(0)) {
      noMoves = true;
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        !checkCellsArr[i].includes(0) &&
        checkCellsArr[i][j] === checkCellsArr[i][j + 1]
      ) {
        noMoves = true;
      }
    }
  }

  if (!noMoves) {
    mesLose.classList.remove('hidden');
  }
}

function pushToDoubleArr(arr) {
  const newArr = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArr.push(arr[i][j]);
    }
  }

  if (newArr.includes(0)) {
    pushValue(newArr);
  } else {
    mesLose.classList.remove('hidden');
  }

  let count = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      arr[i][j] = newArr[count];
      count++;
    }
  }

  return arr;
}

function compareArrays(arr1, arr2) {
  const arr1inLine = [];
  const arr2inLine = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1.length; j++) {
      arr1inLine.push(arr1[i][j]);
      arr2inLine.push(arr2[i][j]);
    }
  }

  for (let i = 0; i < arr1inLine.length; i++) {
    if (arr1inLine[i] !== arr2inLine[i]) {
      return false;
    }
  }

  return true;
}
