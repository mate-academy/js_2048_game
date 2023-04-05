'use strict';

const startButton = document.querySelector('.start');
const playTable = document.querySelector('tbody');
const scoreInfo = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const looseMessage = document.querySelector('.message-lose');
let cellLocation = [];
let playObject = {
  0: [0, 0, 0, 0],
  1: [0, 0, 0, 0],
  2: [0, 0, 0, 0],
  3: [0, 0, 0, 0],
};
const oldLocation = [];
const newLocation = [];
let score = 0;
let coordiX = null;
let coordiY = null;
let hasMove = false;

const randomNumber = () => {
  const min = 1;
  const max = 10;
  let number = Math.floor(Math.random() * (max - min + 1)) + min;

  if (number === 4) {
    return number;
  }

  number = 2;

  return number;
};

const randomCell = () => {
  const min = 0;
  const max = 3;
  let row = Math.floor(Math.random() * (max - min + 1)) + min;
  const column = Math.floor(Math.random() * (max - min + 1)) + min;

  if (playObject[row][column] === 0) {
    return [row, column];
  }

  if (row >= 3) {
    row--;

    return [row, column];
  }

  row++;

  return [row, column];
};

const addCell = (field) => {
  const arrayLocation = [];

  for (const key in field) {
    for (let i = 0; i < field[key].length; i++) {
      if (field[key][i] === '') {
        arrayLocation.push([key, i]);
      }
    }
  }

  if (arrayLocation.length < 1) {
    return;
  }

  const randomLocation
    = Math.floor(Math.random() * (arrayLocation.length - 1 - 0 + 1)) + 0;

  field[arrayLocation[randomLocation][0]][arrayLocation[randomLocation][1]]
    = randomNumber();
};

const saveTable = () => {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      if (playObject[row][cell] === 0) {
        playObject[row][cell] = '';
        playTable.rows[row].cells[cell].textContent = playObject[row][cell];
        playTable.rows[row].cells[cell].className = 'field-cell';

        continue;
      }
      playTable.rows[row].cells[cell].textContent = playObject[row][cell];

      playTable.rows[row].cells[cell].className
        = `field-cell field-cell--${playObject[row][cell]}`;
    }
  }
};

const emptySort = (array, direct) => {
  array.sort((a, b) => {
    let x = a;
    let y = b;

    if (direct === 'right' || direct === 'down') {
      x = b;
      y = a;
    }

    if (x === '') {
      x = 0;
    }

    if (y === '') {
      y = 0;
    }

    if (y === 0 || '') {
      return -1;
    } else if (x === 0 || '') {
      return 1;
    } else {
      return 0;
    }
  });
};

const moveCheck = (array) => {
  array.splice(0, 16);

  for (const key in playObject) {
    playObject[key].map(el => {
      array.push(el);
    });
  }

  return array;
};

const shift = (direct) => {
  for (let row = 0; row < 4; row++) {
    emptySort(playObject[row], direct);

    if (direct === 'left') {
      for (let cell = 0; cell < 4; cell++) {
        if (playObject[row][cell] === '') {
          playObject[row][cell] = 0;
        }

        if (playObject[row][cell] === playObject[row][cell + 1]) {
          playObject[row][cell]
            = playObject[row][cell] + playObject[row][cell + 1];
          score += playObject[row][cell];
          playObject[row][cell + 1] = 0;

          emptySort(playObject[row], direct);

          break;
        }
      }
    }

    if (direct === 'right') {
      for (let cell = 3; cell >= 0; cell--) {
        if (playObject[row][cell] === '') {
          playObject[row][cell] = 0;
        }

        if (playObject[row][cell] === playObject[row][cell - 1]) {
          playObject[row][cell]
            = playObject[row][cell] + playObject[row][cell - 1];
          score += playObject[row][cell];
          playObject[row][cell - 1] = 0;

          emptySort(playObject[row], direct);

          break;
        }
      }
    }
  }
};

const vertikalShift = (direct) => {
  if (direct === 'down') {
    for (let cell = 0; cell < 4; cell++) {
      const newArray = [];

      for (let row = 0; row < 4; row++) {
        newArray.push(playObject[row][cell]);
      }

      emptySort(newArray, direct);

      for (let row = 3; row >= 0; row--) {
        if (newArray[row] === '') {
          newArray[row] = 0;
        }

        if (newArray[row] === newArray[row - 1]) {
          newArray[row] = newArray[row] + newArray[row - 1];
          score += newArray[row];
          newArray[row - 1] = 0;
        }
        emptySort(newArray, direct);
        playObject[row][cell] = newArray[row];
      }
    }

    return;
  }

  for (let cell = 0; cell < 4; cell++) {
    const newArray = [];

    for (let row = 0; row < 4; row++) {
      newArray.push(playObject[row][cell]);
    }

    emptySort(newArray);

    for (let row = 0; row < 4; row++) {
      if (newArray[row] === '') {
        newArray[row] = 0;
      }

      if (newArray[row] === newArray[row + 1]) {
        newArray[row] = newArray[row] + newArray[row + 1];
        score += newArray[row];
        newArray[row + 1] = 0;
      }
      emptySort(newArray);
      playObject[row][cell] = newArray[row];
    }
  }
};

const winOrLose = (field) => {
  for (const key in field) {
    for (let i = 0; i < field[key].length; i++) {
      if (field[key][i] === 2048) {
        winMessage.classList.remove('hidden');
      }

      if (field[key][i] === 0 || field[key][i] === '') {
        return;
      }
    }
  }

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      if (field[row][cell] === field[row][cell + 1]
        || field[row][cell] === field[row][cell - 1]) {
        return;
      }

      if (row === 0) {
        if (field[row][cell] === field[row + 1][cell]) {
          return;
        }
      };

      if (row === 1 || row === 2) {
        if (field[row][cell] === field[row + 1][cell]
          || field[row][cell] === field[row - 1][cell]) {
          return;
        }
      };

      if (row === 3) {
        if (field[row][cell] === field[row - 1][cell]) {
          return;
        }
      };
    }
  }

  looseMessage.classList.remove('hidden');
};

const handleMove = (move) => {
  switch (move) {
    case 'ArrowLeft':
      shift('left');
      break;

    case 'ArrowRight':
      shift('right');
      break;

    case 'ArrowUp':
      vertikalShift('up');
      break;

    case 'ArrowDown':
      vertikalShift('down');
      break;
  }
};

startButton.addEventListener('click', (e) => {
  playObject = {
    0: [0, 0, 0, 0],
    1: [0, 0, 0, 0],
    2: [0, 0, 0, 0],
    3: [0, 0, 0, 0],
  };
  score = 0;

  if (startButton.matches('.start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'restart';
  }

  startMessage.classList.add('hidden');

  cellLocation = randomCell();

  playObject[cellLocation[0]][cellLocation[1]] = randomNumber();

  cellLocation = randomCell();

  playObject[cellLocation[0]][cellLocation[1]] = randomNumber();

  saveTable();
});

document.addEventListener('keydown', (e) => {
  moveCheck(oldLocation);

  handleMove(e.key);

  saveTable();

  moveCheck(newLocation);
});

document.addEventListener('keyup', (e) => {
  if (startButton.matches('.start')) {
    return;
  }

  if (oldLocation.join() === newLocation.join()) {
    return;
  }

  scoreInfo.textContent = score;

  addCell(playObject);
  saveTable();
  winOrLose(playObject);
});

document.addEventListener('touchstart', (e) => {
  const firstTouch = e.touches[0];

  coordiX = firstTouch.clientX;
  coordiY = firstTouch.clientY;
});

document.addEventListener('touchmove', (e) => {
  if (!coordiX || !coordiY) {
    return;
  }

  const coordiXEnd = e.touches[0].clientX;
  const coordieYEnd = e.touches[0].clientY;
  const xDiff = coordiXEnd - coordiX;
  const yDiff = coordieYEnd - coordiY;
  let touchMove = '';

  if (Math.abs(xDiff) >= Math.abs(yDiff)) {
    if (xDiff > 0) {
      touchMove = 'ArrowRight';
    } else {
      touchMove = 'ArrowLeft';
    }
  } else {
    if (yDiff > 0) {
      touchMove = 'ArrowDown';
    } else {
      touchMove = 'ArrowUp';
    }
  }
  moveCheck(oldLocation);

  handleMove(touchMove);

  saveTable();

  moveCheck(newLocation);

  coordiX = null;
  coordiY = null;
  hasMove = true;
});

document.addEventListener('touchend', (e) => {
  if (!hasMove) {
    return;
  }

  if (startButton.matches('.start')) {
    return;
  }

  if (oldLocation.join() === newLocation.join()) {
    return;
  }

  scoreInfo.textContent = score;

  addCell(playObject);
  saveTable();
  winOrLose(playObject);
  hasMove = false;
});
