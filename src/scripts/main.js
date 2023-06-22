import { flipArray, getRandomDigit } from './utils';

const INITIAL_RANDOM_NUMBERS = 2;
const WIN_VALUE = 2048;

const keyDownEvent = 'keydown';
const directions = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  right: 'ArrowRight',
  left: 'ArrowLeft',
};

const ALL_DIRECTION = Object.values(directions);
const VERTICAL_DIRECTION = [directions.up, directions.down];
const NORMAL_SORT_DIRECTION = [directions.down, directions.right];

// write your code here
const page = document.documentElement;
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');

let gameFieldArray = [
  [1, 2, 4, 6],
  [7, 8, 9, 3],
  [6, 5, 2, 2],
  [1024, 1024, 6, 7],
];

const fieldSize = gameFieldArray.length;

let score = 0;

// *** Game start ***

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  }

  resetGame();

  const arrOfStartCoords = getRandomStartCoords(
    fieldSize,
    INITIAL_RANDOM_NUMBERS
  );
  const initialNumbers = getInitialNumbers(INITIAL_RANDOM_NUMBERS);

  arrOfStartCoords.forEach(({ row, col }, i) => {
    gameFieldArray[row][col] = initialNumbers[i];
  });

  renderToUI(gameFieldArray);
});

// *** Arrows PRESS handler ***
page.addEventListener(keyDownEvent, turn);

// *** FUNCTIONS ***

function turn({ key: direction }) {
  if (!ALL_DIRECTION.includes(direction)) {
    return;
  }

  if (VERTICAL_DIRECTION.includes(direction)) {
    gameFieldArray = flipArray(gameFieldArray);
    movement(gameFieldArray, direction);
    gameFieldArray = flipArray(gameFieldArray);
  } else {
    movement(gameFieldArray, direction);
  }

  if (checkIfWin(gameFieldArray.flat())) {
    showMessage(messageWin);
    page.removeEventListener(keyDownEvent, turn);
  }

  if (checkIfLoose(gameFieldArray)) {
    showMessage(messageLose);
    page.removeEventListener(keyDownEvent, turn);
  }

  renderToUI(gameFieldArray);
}

function showMessage(el) {
  el.classList.remove('hidden');
}

function renderToUI(arr) {
  for (const rowIndex in arr) {
    for (const cellIndex in arr[rowIndex]) {
      const content = arr[rowIndex][cellIndex] || '';

      gameField.rows[rowIndex].cells[cellIndex].textContent = content;

      gameField.rows[rowIndex].cells[cellIndex].className = content
        ? `field-cell field-cell--${arr[rowIndex][cellIndex]}`
        : 'field-cell';
    }
  }

  renderScore(score);
}

function sumEqualAndIncreaseScore(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i + 1] *= 2;
      score += arr[i + 1];
      setScore(score);
      arr[i] = 0;
      i += 1;
    }
  }

  return arr;
}

function setScore(value) {
  score = value;
}

function checkIfWin(arr) {
  return arr.some((el) => el === WIN_VALUE);
}

function checkIfLoose(arr) {
  if (!arr.flat().every((el) => el)) {
    return false;
  }

  const hirizontalMovesAvaliable = movesAvaliable(arr);

  return !hirizontalMovesAvaliable && !movesAvaliable(flipArray(arr));
}

function movesAvaliable(arr) {
  return arr.some((row) => row.some((_, i) => row[i] === row[i + 1]));
}

function moveToDirection(arr, direction) {
  let sortedArray;

  if (NORMAL_SORT_DIRECTION.includes(direction)) {
    sortedArray = arr.sort((a) => (!a ? -1 : 0));
  } else if ([directions.left, directions.up].includes(direction)) {
    sortedArray = arr
      .reverse()
      .sort((a) => (!a ? -1 : 0))
      .reverse();
  }

  return sortedArray;
}

function getNewRandomCoords(arr) {
  const emptyCellsArr = arr.reduce((acc, row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        acc.push([i, j]);
      }
    });

    return acc;
  }, []);

  const randomCoordsIndex = getRandomDigit(emptyCellsArr.length - 1);

  return emptyCellsArr[randomCoordsIndex];
}

function movement(arr, direction) {
  for (const i in arr) {
    // move to direction edge
    // (needed in case whole row comtains similar values e.g. [2, 2, 2, 2])
    arr[i] = moveToDirection(arr[i], direction);
    // sum equal values
    arr[i] = sumEqualAndIncreaseScore(arr[i]);

    // move to direction edge again
    arr[i] = moveToDirection(arr[i], direction);
  }

  // extract
  // generate random coords for new value
  const coords = getNewRandomCoords(arr);

  if (coords) {
    // paste new value into coords
    arr[coords[0]][coords[1]] = getRandomlyTwoOrFour();
  }
}

function renderScore(scoreValue) {
  gameScore.textContent = scoreValue;
}

function getInitialNumbers(count) {
  const initialNumbersArr = [];

  while (initialNumbersArr.length < count) {
    initialNumbersArr.push(getRandomlyTwoOrFour());
  }

  return initialNumbersArr;
}

function getRandomlyTwoOrFour() {
  return Math.random() < 0.9 ? 2 : 4;
}

function getRandomStartCoords(max, elements) {
  const randomCoords = [];

  while (randomCoords.length < elements) {
    const coord = {
      row: getRandomDigit(max),
      col: getRandomDigit(max),
    };

    if (
      !randomCoords.some(
        ({ row, col }) => row === coord.row && col === coord.col
      )
    ) {
      randomCoords.push(coord);
    }
  }

  return randomCoords;
}

function resetGame() {
  setScore(0);

  gameFieldArray = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  page.addEventListener(keyDownEvent, turn);
}
