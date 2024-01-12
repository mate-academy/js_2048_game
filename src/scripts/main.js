'use strict';

let data = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let inProgress = false;

const start = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');

start.addEventListener('click', () => {
  if (start.innerText === 'Start') {
    start.innerText = 'Restart';
    start.classList.replace('start', 'restart');
    messageStart.classList.add('hidden');
  } else {
    clearField();
    score = 0;
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  randomizer(2);

  inProgress = true;
  domReload();
});

document.addEventListener('keydown', (e) => {
  if (!inProgress) {
    return;
  }

  const prevData = JSON.parse(JSON.stringify(data));

  let moveExecuted = false;

  switch (e.key) {
    case 'ArrowRight':
      if (isGameOver() === false) {
        mergeTiles('right');
        tileMovement('right');
        isWin();
        moveExecuted = true;
      }
      break;

    case 'ArrowLeft':
      if (isGameOver() === false) {
        mergeTiles('left');
        tileMovement('left');
        isWin();
        moveExecuted = true;
      }
      break;

    case 'ArrowDown':
      if (isGameOver() === false) {
        mergeTiles('down');
        tileMovement('down');
        isWin();
        moveExecuted = true;
      }
      break;

    case 'ArrowUp':
      if (isGameOver() === false) {
        mergeTiles('up');
        tileMovement('up');
        isWin();
        moveExecuted = true;
      }
      break;
  }

  if (moveExecuted && !isEqual(prevData, data)) {
    randomizer(1);

    if (isGameOver()) {
      inProgress = false;
      messageLose.classList.remove('hidden');
      domReload();
    } else {
      domReload();
    }
  }
});

function isEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function tileMovement(direction) {
  for (let i = 0; i < data.length; i++) {
    let values;

    if (direction === 'right' || direction === 'left') {
      const nonZeroValues = data[i].filter((element) => element !== 0);
      const zeroValues = data[i].filter((element) => element === 0);

      values = direction === 'right' ? zeroValues.concat(nonZeroValues)
        : nonZeroValues.concat(zeroValues);
      data[i] = values;
    } else if (direction === 'down' || direction === 'up') {
      const column = [];

      for (let row = 0; row < data.length; row++) {
        column.push(data[row][i]);
      }

      const nonZeroValues = column.filter((element) => element !== 0);
      const zeroValues = column.filter((element) => element === 0);

      values = direction === 'down' ? zeroValues.concat(nonZeroValues)
        : nonZeroValues.concat(zeroValues);

      for (let j = 0; j < data.length; j++) {
        data[j][i] = values[j];
      }
    }
  }
}

function mergeTiles(direction) {
  for (let tile = 0; tile < data.length; tile++) {
    let values = [];
    const merged = Array(data.length).fill(false);

    if (direction === 'down' || direction === 'up') {
      for (let row = 0; row < data.length; row++) {
        values.push(data[row][tile]);
      }
    } else if (direction === 'left' || direction === 'right') {
      values = data[tile].slice();
    }

    const nonZeroValues = values.filter((element) => element !== 0);
    const zeroValues = values.filter((element) => element === 0);

    if (direction === 'down' || direction === 'right') {
      for (let i = nonZeroValues.length - 1; i > 0; i--) {
        if (nonZeroValues[i] === nonZeroValues[i - 1] && !merged[i]) {
          nonZeroValues[i] += nonZeroValues[i - 1];
          score += nonZeroValues[i];
          nonZeroValues[i - 1] = 0;
          merged[i] = true;
        }
      }
      values = zeroValues.concat(nonZeroValues);
    } else if (direction === 'up' || direction === 'left') {
      for (let i = 0; i < nonZeroValues.length - 1; i++) {
        if (nonZeroValues[i] === nonZeroValues[i + 1] && !merged[i]) {
          nonZeroValues[i] += nonZeroValues[i + 1];
          score += nonZeroValues[i];
          nonZeroValues[i + 1] = 0;
          merged[i] = true;
        }
      }
      values = nonZeroValues.concat(zeroValues);
    }

    if (direction === 'down' || direction === 'up') {
      for (let row = 0; row < data.length; row++) {
        data[row][tile] = values[row];
      }
    } else if (direction === 'left' || direction === 'right') {
      data[tile] = values.slice();
    }
  }
}

function randomizer(count) {
  for (let i = 0; i < count; i++) {
    const emptyPositions = [];

    for (let row = 0; row < data.length; row++) {
      for (let tile = 0; tile < data[row].length; tile++) {
        if (data[row][tile] === 0) {
          emptyPositions.push({
            row, tile,
          });
        }
      }
    }

    if (emptyPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyPositions.length);
      const { row, tile } = emptyPositions[randomIndex];
      const randomNumber = Math.random() * 2 > 1.9 ? 4 : 2;

      data[row][tile] = randomNumber;
    }
  }
}

function colorizing() {
  const fieldsRows = document.querySelectorAll('.field-row');

  const classMap = {
    0: '',
    2: 'field-cell--2',
    4: 'field-cell--4',
    8: 'field-cell--8',
    16: 'field-cell--16',
    32: 'field-cell--32',
    64: 'field-cell--64',
    128: 'field-cell--128',
    256: 'field-cell--256',
    512: 'field-cell--512',
    1024: 'field-cell--1024',
    2048: 'field-cell--2048',
  };

  for (let row = 0; row < data.length; row++) {
    const cellsInRow = fieldsRows[row].querySelectorAll('.field-cell');

    for (let tile = 0; tile < data[row].length; tile++) {
      const cellValue = data[row][tile];

      cellsInRow[tile].className = 'field-cell ' + classMap[cellValue];
    }
  }
}

function isWin() {
  for (const row of data) {
    for (const tile of row) {
      if (tile === 2048) {
        messageWin.classList.remove('hidden');
        inProgress = false;
      }
    }
  }
}

function clearField() {
  data = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function domReload() {
  const scoreBlock = document.querySelector('.game-score');

  for (let row = 0; row < data.length; row++) {
    for (let tile = 0; tile < data.length; tile++) {
      const startRow = document.querySelectorAll('.field-row')[row];
      const startTile = startRow.querySelectorAll('.field-cell')[tile];

      if (data[row][tile] === 0) {
        startTile.textContent = ' ';
        continue;
      }

      startTile.textContent = data[row][tile];
    }
  }

  scoreBlock.textContent = score;
  colorizing();
}

function isGameOver() {
  if (data.some(row => row.includes(0))) {
    return false;
  }

  for (let row = 0; row < data.length; row++) {
    for (let tile = 0; tile < data.length - 1; tile++) {
      if (data[row][tile] === data[row][tile + 1]) {
        return false;
      }
    }
  }

  for (let tile = 0; tile < data.length; tile++) {
    for (let row = 0; row < data.length - 1; row++) {
      if (data[row][tile] === data[row + 1][tile]) {
        return false;
      }
    }
  }

  return true;
}
