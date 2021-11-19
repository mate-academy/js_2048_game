'use strict';

let score = 0;

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const field = document.querySelector('.game-field');

button.addEventListener('click', startGame);

function startGame() {
  button.classList.remove('start');
  button.classList.add('restart');
  document.querySelector('.message-start').classList.add('hidden');
  button.removeEventListener('click', startGame);
  button.addEventListener('click', restartGame);
  button.innerHTML = 'Restart';
  randomCell();
  randomCell();
  document.addEventListener('keydown', game);
}

function game(e) {
  let action;

  switch (e.code) {
    case 'ArrowLeft':
      action = lines([0, 1, 2, 3], [0, 1, 2, 3], 'horizontal');
      break;
    case 'ArrowRight':
      action = lines([0, 1, 2, 3], [3, 2, 1, 0], 'horizontal');
      break;
    case 'ArrowUp':
      action = lines([0, 1, 2, 3], [0, 1, 2, 3], 'vertical');
      break;
    case 'ArrowDown':
      action = lines([3, 2, 1, 0], [0, 1, 2, 3], 'vertical');
      break;
  }

  if (action) {
    randomCell();
    win();
    lose();
  }
}

function restartGame() {
  for (const cell of field.querySelectorAll('.field-cell')) {
    cell.innerHTML = '';
    cell.className = 'field-cell';
  }

  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  score = 0;
  updateScore();
  randomCell();
  randomCell();
  document.addEventListener('keydown', game);
}

function updateScore() {
  gameScore.innerHTML = score;
}

function randomCell() {
  let cell;
  let number;

  do {
    cell = field.rows[Math.floor(Math.random() * 4)]
      .cells[Math.floor(Math.random() * 4)];
  } while (!isEmptyCell(cell));

  if (Math.floor(Math.random() * 10) === 9) {
    number = 4;
  } else {
    number = 2;
  }

  cell.innerHTML = number;
  cell.classList.add(`field-cell--${number}`);
}

function win() {
  for (const cell of field.querySelectorAll('.field-cell')) {
    if (cell.innerHTML === '2048') {
      document.removeEventListener('keydown', game);
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }
}

function lose() {
  if (hasEmptyCell()) {
    return;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (canMerge(field.rows[i].cells[j], field.rows[i].cells[j + 1])
        || canMerge(field.rows[j].cells[i], field.rows[j + 1].cells[i])) {
        return;
      }
    }
  }

  document.removeEventListener('keydown', game);
  document.querySelector('.message-lose').classList.remove('hidden');
}

function mergeCells(prevCell, cell) {
  const number = cell.innerHTML * 2;

  prevCell.innerHTML = number;
  prevCell.className = `field-cell field-cell--${number}`;
  cell.innerHTML = '';
  cell.className = 'field-cell';
  score += number;
  updateScore();
}

function moveCells(prevCell, cell) {
  prevCell.innerHTML = cell.innerHTML;
  cell.innerHTML = '';
  prevCell.className = cell.className;
  cell.className = 'field-cell';
}

function hasEmptyCell() {
  for (const cell of field.querySelectorAll('.field-cell')) {
    if (isEmptyCell(cell)) {
      return true;
    }
  }

  return false;
}

function isEmptyCell(cell) {
  if (cell.innerHTML === '') {
    return true;
  }

  return false;
}

function canMerge(prevCell, cell) {
  if (prevCell.innerHTML === cell.innerHTML) {
    return true;
  }

  return false;
}

function lines(rows, columns, direction) {
  let action = false;

  for (let i = 0; i < 4; i++) {
    const line = [];

    for (let j = 0; j < 4; j++) {
      let cell;

      switch (direction) {
        case 'horizontal':
          cell = field.rows[rows[i]].cells[columns[j]];
          break;
        case 'vertical':
          cell = field.rows[rows[j]].cells[columns[i]];
          break;
      }

      line.push(cell);
    }

    action = mergeLine(line) ? true : action;
    action = moveLine(line) ? true : action;
  }

  return action;
}

function mergeLine(line) {
  let merged = false;
  let cell;
  let prevCell = null;

  for (let i = 0; i < 4; i++) {
    cell = line[i];

    if (isEmptyCell(cell)) {
      continue;
    }

    if (prevCell) {
      if (canMerge(prevCell, cell)) {
        mergeCells(prevCell, cell);
        merged = true;
        prevCell = null;
      } else {
        prevCell = cell;
      }
    } else {
      prevCell = cell;
    }
  }

  return merged;
}

function moveLine(line) {
  let moved = false;
  let cell;
  let prevCell;
  let i = 1;

  while (i < 4) {
    if (i === 0) {
      i++;
    }

    cell = line[i];

    if (isEmptyCell(cell)) {
      i++;
      continue;
    }

    prevCell = line[i - 1];

    if (isEmptyCell(prevCell)) {
      moveCells(prevCell, cell);
      moved = true;
      i--;
    } else {
      i++;
    }
  }

  return moved;
}
