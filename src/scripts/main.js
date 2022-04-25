'use strict';

const cells = document.querySelectorAll('.field-cell');
const start = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const isMerge = {
  'horizontal': false,
  'vertical': false,
};

start.flag = false;

start.addEventListener('click', (e) => {
  score.innerText = 0;
  messageStart.hidden = true;
  start.flag = true;
  start.innerText = 'Restart';
  start.classList.remove('start');
  start.classList.add('restart');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  for (const cell of cells) {
    cell.innerText = '';
    cell.className = 'field-cell';
  }

  getTwoRandomCells(cells);
});

document.addEventListener('keydown', (e) => {
  const beforeMove = makeSchema();

  if (beforeMove.includes('2048')) {
    return;
  }

  if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'h') {
    moveLeftRight('left');
    mergeLeftRight('left');
    moveLeftRight('left');
  }

  if (e.key === 'd' || e.key === 'ArrowRight' || e.key === 'l') {
    moveLeftRight('right');
    mergeLeftRight('right');
    moveLeftRight('right');
  }

  if (e.key === 'w' || e.key === 'ArrowUp' || e.key === 'k') {
    moveUpDown('up');
    mergeUpDown('up');
    moveUpDown('up');
  }

  if (e.key === 's' || e.key === 'ArrowDown' || e.key === 'j') {
    moveUpDown('down');
    mergeUpDown('down');
    moveUpDown('down');
  }

  const afterMove = makeSchema();

  if (afterMove.includes('2048')) {
    messageWin.classList.remove('hidden');

    return;
  }

  if (JSON.stringify(beforeMove) !== JSON.stringify(afterMove)) {
    addNumber();
  }

  if (!afterMove.includes('')) {
    isMerge.horizontal = false;
    isMerge.vertical = false;
  }

  if (mergeIsNotPossible()) {
    messageLose.classList.remove('hidden');
  }
});

function moveLeftRight(direction) {
  const schema = makeSchema();
  let result = [];

  for (let i = 0; i < 4; i++) {
    const row = schema.splice(0, 4);

    const arrOfZero = row.filter(num => num === '');
    const filledCells = row.filter(num => num !== '');

    for (let y = 0; y < arrOfZero.length; y++) {
      if (direction === 'left') {
        filledCells.push('');
      } else {
        filledCells.unshift('');
      }
    }

    result = result.concat(filledCells);
  }
  transferDataFromSchema(result);
}

function moveUpDown(direction) {
  const schema = makeSchema();
  let result = [];

  const column1 = [];
  const column2 = [];
  const column3 = [];
  const column4 = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    column.push(schema[i]);
    column.push(schema[i + 4]);
    column.push(schema[i + 8]);
    column.push(schema[i + 12]);

    const arrOfZero = column.filter(num => num === '');
    const filledCells = column.filter(num => num !== '');

    for (let y = 0; y < arrOfZero.length; y++) {
      if (direction === 'up') {
        filledCells.push('');
      } else {
        filledCells.unshift('');
      }
    }

    column1.push(filledCells[0]);
    column2.push(filledCells[1]);
    column3.push(filledCells[2]);
    column4.push(filledCells[3]);
  }

  result = result.concat(column1, column2, column3, column4);
  transferDataFromSchema(result);
}

function mergeLeftRight(direction) {
  const schema = makeSchema();
  let result = [];

  for (let i = 0; i < 4; i++) {
    const row = schema.splice(0, 4);

    if (direction === 'right') {
      for (let y = row.length - 1; y > 0; y--) {
        if (row[y] === row[y - 1] && row[y] !== '') {
          row[y] *= 2;
          row[y - 1] = '';
          score.innerText = +score.innerText + +row[y];
        }
      }
    } else {
      for (let y = 0; y < row.length - 1; y++) {
        if (row[y] === row[y + 1] && row[y] !== '') {
          row[y] *= 2;
          row[y + 1] = '';
          score.innerText = +score.innerText + +row[y];
        }
      }
    }

    schema.push(row);
    result = schema.flat();
  }
  transferDataFromSchema(result);
}

function mergeUpDown(direction) {
  const schema = makeSchema();
  let result = [];

  const column1 = [];
  const column2 = [];
  const column3 = [];
  const column4 = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    column.push(schema[i]);
    column.push(schema[i + 4]);
    column.push(schema[i + 8]);
    column.push(schema[i + 12]);

    if (direction === 'up') {
      for (let y = 0; y < column.length - 1; y++) {
        if (column[y] === column[y + 1] && column[y] !== '') {
          column[y] *= 2;
          column[y + 1] = '';
          score.innerText = +score.innerText + column[y];
        }
      }
    } else {
      for (let y = 3; y > 0; y--) {
        if (column[y] === column[y - 1] && column[y] !== '') {
          column[y] *= 2;
          column[y - 1] = '';
          score.innerText = +score.innerText + column[y];
        }
      }
    }

    column1.push(column[0]);
    column2.push(column[1]);
    column3.push(column[2]);
    column4.push(column[3]);
  }

  result = result.concat(column1, column2, column3, column4);
  transferDataFromSchema(result);
}

function makeSchema() {
  const schema = [];
  const actualCells = document.querySelectorAll('.field-cell');

  for (const cell of actualCells) {
    schema.push(cell.innerText);
  }

  return schema;
}

function getTwoRandomCells(array) {
  const arr = [];
  const result = [];

  for (let i = 0; i < array.length; i++) {
    arr.push(i);
  }

  while (arr.length > 0) {
    const random = Math.floor(Math.random() * arr.length - 1);
    const elem = arr.splice(random, 1)[0];

    result.push(elem);
  }
  cells[result[0]].innerText = getRandomNumber();
  cells[result[0]].classList.add(`field-cell--${cells[result[0]].innerText}`);
  cells[result[1]].innerText = getRandomNumber();
  cells[result[1]].classList.add(`field-cell--${cells[result[1]].innerText}`);
}

function getRandomNumber() {
  const random = Math.floor(Math.random() * 100);

  if (random < 95) {
    return '2';
  }

  return 4;
}

function addNumber() {
  const schema = makeSchema();
  const emptyCells = schema.filter(num => num === '');
  const random = Math.floor(Math.random() * emptyCells.length);

  emptyCells[random] = getRandomNumber();

  let y = 0;

  for (let i = 0; i < schema.length; i++) {
    if (schema[i] === '') {
      schema[i] = emptyCells[y];
      y++;
    }
  }
  transferDataFromSchema(schema);
}

function transferDataFromSchema(arr) {
  const actualCells = document.querySelectorAll('.field-cell');

  for (const cell of actualCells) {
    cell.innerText = arr[0];
    cell.className = ('field-cell');
    cell.classList.add(`field-cell--${cell.innerText}`);
    arr.shift();
  }
}

function mergeIsNotPossible() {
  const schema = makeSchema();
  const schema1 = makeSchema();

  for (let i = 0; i < 4; i++) {
    const row = schema.splice(0, 4);

    for (let y = 0; y < 3; y++) {
      if (row[y] === row[y + 1]) {
        isMerge.horizontal = true;
      }
    }

    const column = [];

    column.push(schema1[i]);
    column.push(schema1[i + 4]);
    column.push(schema1[i + 8]);
    column.push(schema1[i + 12]);

    for (let z = 0; z < 3; z++) {
      if (column[z] === column[z + 1]) {
        isMerge.vertical = true;
      }
    }
  }

  if (!isMerge.horizontal && !isMerge.vertical) {
    return true;
  }
}
