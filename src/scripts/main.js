'use strict';

import { size, clearField, winNum } from "./constants";
import { rotateField } from "./helpers";
import { checkPossibleMoves } from "./helpers";
import { convertSwipeToArrow } from "./helpers";

const board = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const buttonStart = document.querySelector('.start');
const buttonRestart = document.querySelector('.restart');
const scoreboard = document.querySelector('.game-score');
const bestScoreboard = document.querySelector('.game-best-score');
let score = +localStorage.score || 0;
let bestScore = +localStorage.bestScore || 0;
let isPlaying = localStorage.isPlaying;

let field = isPlaying
  ? JSON.parse(localStorage.field)
  : clearField;

let isWon = false;
let isLose = false;
let possibleMoves = [];

const filterZeros = (nums) => nums.filter(num => num !== 0);
const getRandomIdex = () => Math.floor(Math.random() * size);
const probabilityOf4 = () => Math.floor(Math.random() * 10); // 1/10 = 10%

function setGame() {
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

if (isPlaying) {
  scoreboard.innerText = score;
  bestScoreboard.innerHTML = bestScore;
  buttonStart.classList.add('hidden');
  buttonRestart.classList.remove('hidden');
  startGame();
}

function startGame() {
  if (isPlaying) {
    messageStart.classList.add('hidden');
    possibleMoves = checkPossibleMoves(field, size);
    updateBoard();

    return;
  }

  messageStart.classList.add('hidden');
  addNum();
  addNum();
  updateBoard();
  possibleMoves = checkPossibleMoves(field, size);
}

buttonStart.addEventListener('click', (e) => {
  localStorage.isPlaying = true;
  buttonStart.classList.add('hidden');
  buttonRestart.classList.remove('hidden');

  startGame();
})

buttonRestart.addEventListener('click', (e) => {
  localStorage.field = JSON.stringify(clearField);
  field = JSON.parse(localStorage.field);
  localStorage.isPlaying = false;
  isPlaying = localStorage.isPlaying;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  updateScore(null);
  addNum();
  addNum();
  startGame();
})

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
  e.preventDefault()
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
  checkWin();
  possibleMoves = checkPossibleMoves(field, size);
  checkLose();
  updateBoard();
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
      updateScore(row[i]);
    }
  }

  row = filterZeros(row);

  const startFill = row.length;
  row.length = size;
  row = row.fill(0, startFill, size);

  return row;
}

function updateBoard() {
  localStorage.field = JSON.stringify(field);

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

function updateScore(value) {
  if (value === null) {
    score = 0;
    localStorage.score = score;
  } else {
    score += value;
    localStorage.score = score;

    if (score > bestScore) {
      updateBestScore(score);
    }
  }

  scoreboard.innerText = score;
}

function updateBestScore(newScore) {
  bestScore = newScore;
  localStorage.bestScore = newScore;
  bestScoreboard.innerHTML = bestScore;
}
