'use strict';

let score;
let gameField;
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const field = document.querySelector('.game-field');

button.addEventListener('click', startGame);

function startGame() {
  button.classList.remove('start');
  button.classList.add('restart');
  document.querySelector('.message-start').classList.add('hidden');
  button.removeEventListener('click', startGame);
  button.addEventListener('click', newGame);
  button.innerHTML = 'Restart';
  newGame();
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
    updateField();
    win();
    lose();
  }
}

function newGame() {
  gameField = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  score = 0;
  updateScore();
  randomCell();
  randomCell();
  updateField();
  document.addEventListener('keydown', game);
}

function updateScore() {
  gameScore.innerHTML = score;
}

function updateField() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      field.rows[i].cells[j].innerHTML = gameField[i][j];

      field.rows[i].cells[j].className
        = `field-cell field-cell--${gameField[i][j]}`;
    }
  }
}

function randomCell() {
  let row;
  let column;
  let number;

  do {
    row = Math.floor(Math.random() * 4);
    column = Math.floor(Math.random() * 4);
  } while (!isEmptyCell([row, column]));

  if (Math.floor(Math.random() * 10) === 9) {
    number = 4;
  } else {
    number = 2;
  }

  gameField[row][column] = number;
}

function win() {
  for (const row of gameField) {
    if (row.includes(2048)) {
      document.removeEventListener('keydown', game);
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }
}

function lose() {
  for (const row of gameField) {
    if (row.includes('')) {
      return;
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (canMerge([i, j], [i, j + 1])
        || canMerge([j, i], [j + 1, i])) {
        return;
      }
    }
  }

  document.removeEventListener('keydown', game);
  document.querySelector('.message-lose').classList.remove('hidden');
}

function mergeCells(prevCell, cell) {
  const number = gameField[cell[0]][cell[1]] * 2;

  gameField[prevCell[0]][prevCell[1]] = number;
  gameField[cell[0]][cell[1]] = '';
  score += number;
  updateScore();
}

function moveCells(prevCell, cell) {
  gameField[prevCell[0]][prevCell[1]] = gameField[cell[0]][cell[1]];
  gameField[cell[0]][cell[1]] = '';
}

function isEmptyCell(cell) {
  if (gameField[cell[0]][cell[1]] === '') {
    return true;
  }

  return false;
}

function canMerge(prevCell, cell) {
  if (gameField[prevCell[0]][prevCell[1]] === gameField[cell[0]][cell[1]]) {
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
          cell = [rows[i], columns[j]];
          break;
        case 'vertical':
          cell = [rows[j], columns[i]];
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
