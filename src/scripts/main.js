'use strict';

const start = document.querySelector('.start');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

start.flag = false;

start.addEventListener('click', () => {
  const twoRandomCells = getMultipleRandom([...Array(cells.length).keys()], 2);
  const twoRandomNumbers = getMultipleRandom([2, 2, 2, 2, 2, 2, 2, 2, 2, 4], 2);

  start.flag = true;
  score.innerText = 0;
  start.innerText = 'Restart';
  start.classList.remove('start');
  start.classList.add('restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  for (const cell of cells) {
    cell.innerText = '';
    cell.className = 'field-cell';
  }

  cells[twoRandomCells[0]].innerText = `${twoRandomNumbers[0]}`;
  cells[twoRandomCells[0]].classList.add(`field-cell--${twoRandomNumbers[0]}`);
  cells[twoRandomCells[1]].innerText = `${twoRandomNumbers[1]}`;
  cells[twoRandomCells[1]].classList.add(`field-cell--${twoRandomNumbers[1]}`);
});

document.addEventListener('keydown', (e) => {
  if (start.flag === false) {
    return;
  }

  const firstMask = JSON.stringify(makeSchema());

  if (e.key === 'ArrowLeft') {
    move('left');
    merge('left');
    move('left');
  }

  if (e.key === 'ArrowRight') {
    move('right');
    merge('right');
    move('right');
  }

  if (e.key === 'ArrowUp') {
    move('up');
    merge('up');
    move('up');
  }

  if (e.key === 'ArrowDown') {
    move('down');
    merge('down');
    move('down');
  }

  if (is2048()) {
    messageWin.classList.remove('hidden');
    start.flag = false;
    start.classList.remove('restart');
    start.classList.add('start');
    start.innerText = 'Start';

    return;
  }

  const secondMask = JSON.stringify(makeSchema());

  if (firstMask !== secondMask) {
    addRandomNumber();
  }

  if (!isPossibleMove()) {
    messageLose.classList.remove('hidden');
    start.flag = false;
  }
});

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function move(direction) {
  const schema = makeSchema();
  const result = [];
  let count = 0;

  for (let i = 0; i < schema.length / 4; i++) {
    let row = [];

    if (direction === 'up' || direction === 'down') {
      row = schema.filter((el, index) => index % 4 === i);
    }

    if (direction === 'left' || direction === 'right') {
      row = schema.filter((el, index) => index < (i + 1) * 4 && index >= i * 4);
    }

    const numbers = row.filter(num => num !== '');
    const emptyCells = row.filter(num => num === '');
    let movedRow = [];

    if (direction === 'left' || direction === 'up') {
      movedRow = [...numbers, ...emptyCells];
    }

    if (direction === 'right' || direction === 'down') {
      movedRow = [...emptyCells, ...numbers];
    }

    if (direction === 'left' || direction === 'right') {
      result.push(...movedRow);
    }

    if (direction === 'up' || direction === 'down') {
      result.length = 16;

      for (let z = 0; z < row.length; z++) {
        result.length = 16;
        result[(z * 4 + count)] = movedRow[z];
      }
      count++;
    }
  }
  transferDataFromSchema(result);
}

function merge(direction) {
  const schema = makeSchema();
  const result = [];
  let count = 0;

  for (let i = 0; i < schema.length / 4; i++) {
    let row = [];

    if (direction === 'up' || direction === 'down') {
      row = schema.filter((el, index) => index % 4 === i);
    }

    if (direction === 'left' || direction === 'right') {
      row = schema.filter((el, index) => index < (i + 1) * 4 && index >= i * 4);
    }

    if (direction === 'left' || direction === 'up') {
      for (let y = 1; y < row.length; y++) {
        if (row[y - 1] === row[y] && row[y - 1] !== '') {
          row[y - 1] = (row[y - 1] *= 2).toString();
          score.innerText = `${+score.innerText + +row[y - 1]}`;
          row[y] = '';
        }
      }
    }

    if (direction === 'right' || direction === 'down') {
      for (let y = row.length; y > 0; y--) {
        if (row[y] === row[y - 1] && row[y] !== '') {
          row[y] = (row[y] *= 2).toString();
          score.innerText = `${+score.innerText + +row[y]}`;

          row[y - 1] = '';
        }
      }
    }

    if (direction === 'left' || direction === 'right') {
      result.push(...row);
    }

    if (direction === 'up' || direction === 'down') {
      result.length = 16;

      for (let z = 0; z < row.length; z++) {
        result.length = 16;
        result[(z * 4 + count)] = row[z];
      }
      count++;
    }
  }
  transferDataFromSchema(result);
}

function makeSchema() {
  const schema = [];

  for (const cell of getCells()) {
    schema.push(cell.innerText);
  }

  return schema;
}

function transferDataFromSchema(schema) {
  for (const cell of getCells()) {
    cell.innerText = schema[0];
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${cell.innerText}`);
    schema.shift();
  }
}

function getCells() {
  return document.querySelectorAll('.field-cell');
}

function addRandomNumber() {
  const emptyCells = [];

  for (const cell of getCells()) {
    if (cell.innerText === '') {
      emptyCells.push(cell);
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell = getMultipleRandom([...Array(emptyCells.length).keys()], 1);
  const randomNumber = getMultipleRandom([2, 2, 2, 2, 2, 2, 2, 2, 2, 4], 1);

  emptyCells[randomCell].innerText = `${randomNumber}`;
  emptyCells[randomCell].classList.add(`field-cell--${randomNumber}`);

  return emptyCells;
}

function is2048() {
  return Array.from(getCells()).some(cell => cell.innerText === '2048');
}

function isPossibleMove() {
  if (isEmptyCells()) {
    return true;
  }

  const numbers = [];

  for (const cell of getCells()) {
    numbers.push(cell.innerText);
  }

  for (let i = 0; i < numbers.length / 4; i++) {
    const row = numbers.slice(i * 4, i * 4 + 4);

    for (let k = 1; k < row.length; k++) {
      if (row[k - 1] === row[k]) {
        return true;
      }
    }
  }

  for (let y = 0; y < numbers.length / 4; y++) {
    const column = numbers.filter((el, index) => index % 4 === y);

    for (let z = 1; z < column.length; z++) {
      if (column[z - 1] === column[z]) {
        return true;
      }
    }
  }

  return false;
}

function isEmptyCells() {
  const emptyCells = Array
    .from(getCells()).filter(cell => cell.innerText === '');

  if (emptyCells.length === 0) {
    return false;
  }

  return true;
}
