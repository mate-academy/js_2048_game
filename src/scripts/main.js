'use strict';

import { rotateField } from "./helpers";
import { checkPossibleMoves } from "./helpers";
import { convertSwipeToArrow } from "./helpers";

export const board = document.querySelector('.game-field');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const size = 4;
let score = 0;
let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const winNum = 2048;
let isWon = false;
let isLose = false;
let possibleMoves = [];

const filterZeros = (nums) => nums.filter(num => num !== 0);
const getRandomIdex = () => Math.floor(Math.random() * size);
const probabilityOf4 = () => Math.floor(Math.random() * 10); // 1/10 = 10%

function setGame() {
  addNum();
  addNum();
  possibleMoves = checkPossibleMoves(field, size);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = field[r][c] || '';
      const styleColor = value > 0 ? `field-cell--${value}` : '';

      board.insertAdjacentHTML('beforeend', `
      <div
        class="field-cell ${styleColor}"
        id="${r}-${c}"
      >
        ${value}
      </div>
    `)
    }
  }
}

setGame();

document.addEventListener('keyup', (e) => {
  move(e.code);
})

const touches = {
  start: {
    X: 0,
    Y: 0,
  },
  end: {
    X: 0,
    Y: 0,
  },
};

board.addEventListener('touchstart', e => {
  touches.start.X = Math.abs(e.touches[0].clientX);
  touches.start.Y = Math.abs(e.touches[0].clientY);
})

board.addEventListener('touchmove', e => {
  touches.end.X = Math.abs(e.touches[0].clientX);
  touches.end.Y = Math.abs(e.touches[0].clientY);
})

board.addEventListener('touchend', e => {
  move(convertSwipeToArrow(touches));
})


function move(arrow) {
  if (!possibleMoves.includes(arrow)) {
    return;
  }

  switch (arrow) {
    case 'ArrowLeft':
    case 'ArrowRight':
      field = slideRows(arrow, field);
      break;

    case 'ArrowUp':
    case 'ArrowDown':
      const rotated = rotateField(field, size);
      const slided = slideRows(arrow, rotated);

      field = rotateField(slided, size);
      break;
  }

  addNum();
  updateBoard();
  possibleMoves = checkPossibleMoves(field, size);
}

function slideRows(arrow, field) {
  const workField = field.map(row => [...row]);

  for (let r = 0; r < size; r++) {
    let row = workField[r];

    if (arrow === 'ArrowRight' || arrow === 'ArrowDown') {
      row = row.reverse();
      row = slide(row);
      row = row.reverse();
    } else {
      row = slide(row);
    }

    workField[r] = row;
  }

  return workField;
}

function slide(row) {
  row = filterZeros(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZeros(row);

  const startFill = row.length;
  row.length = size;
  row = row.fill(0, startFill, size);

  return row;
}

function updateBoard() {
  checkWin();
  checkLose();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = field[r][c];
      const id = `${r}-${c}`;
      const cell = document.getElementById(id);

      cell.innerText = '';
      cell.className = 'field-cell';

      if (value > 0) {
        cell.innerText = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function addNum() {
  let foundZeroCell = false;
  let numToAdd = (probabilityOf4() === 4) ? 4 : 2;

  while (!foundZeroCell) {
    const r = getRandomIdex();
    const c = getRandomIdex();

    if (field[r][c] === 0) {
      field[r][c] = numToAdd;
      foundZeroCell = true;
    }
  }
}

function checkWin() {
  field.forEach(row => {
    if (row.find(num => num === winNum)) {
      messageWin.classList.remove('hidden');
      isWon = true;
    }
  });
}

function checkLose() {
  if (possibleMoves.length === 0) {
    messageLose.classList.remove('hidden');
    isLose = true;
    return;
  }
}
