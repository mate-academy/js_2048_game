'use strict';

const fieldCells = [...document.querySelectorAll('tr td')];
const pointsScrean = document.querySelector('.game-score');
const startButton = document.querySelector('.start');

const getRandom = (max) => Math.floor(Math.random() * max);
const isNoSlide = (array) => array.every(item => item === true);
const transpose = (arr) => arr[0].map((_, i) => arr.map(item => item[i]));
const setStates = (reverse, transposed) => (isStates = [reverse, transposed]);
const newBoard = Array(4).fill(Array(4).fill(0));

let board = newBoard.map(arr => arr.slice());
let isStates = [false, false];
let isWin = false;
let boardCheck = [];
let newCellCoord;
let scores = 0;

const direction = {
  ArrowUp: () => setStates(false, true),
  ArrowDown: () => setStates(true, true),
  ArrowLeft: () => setStates(false, false),
  ArrowRight: () => setStates(true, false),
};

const winPromise = new Promise((resolve) => {
  document.addEventListener('keydown', () => isWin && resolve('message-win'));
});

function slideResult(arr, arrayCheck) {
  const row = arr.filter(i => i);
  const newArr = [];
  let merge;

  while (row.length) {
    if (row[0] === row[1]) {
      merge = row.splice(0, 2).reduce((a, b) => a + b);
      (!isWin && merge === 2048) && (isWin = true);
      scores += merge;

      newArr.push(merge);
    } else {
      newArr.push(row.splice(0, 1));
    };
  };

  const result = [
    ...newArr.flat(), ...Array(arr.length - newArr.length).fill(0),
  ];

  arrayCheck.push(result.map((item, i) => item === arr[i]).every(i => i));

  return result;
};

function slideBoard() {
  const arr = isStates[1] ? transpose(board) : board;
  const result = isStates[0]
    ? arr.map(row => slideResult(row.reverse(), boardCheck).reverse())
    : arr.map(row => slideResult(row, boardCheck));

  board = isStates[1] ? transpose(result) : result;
};

function newCell(array = board.flat()) {
  const empty = array.map((item, i) => !item ? i : 0).filter(i => i);

  if (!empty.length) {
    return;
  };

  const random = empty[getRandom(empty.length)];

  board[Math.floor(random / 4)][random % 4] = getRandom(10) > 9 ? 4 : 2;
  newCellCoord = random;
};

function renderCells(array = board.flat()) {
  fieldCells.forEach((item, i) => {
    if (array[i]) {
      item.classList.add(`field-cell--${array[i]}`);
      item.innerHTML = `${array[i]}`;

      if (newCellCoord === i) {
        item.classList.add(`field-cell--new`);
      };
    };
  });
};

function clearCells() {
  fieldCells.map((item) => {
    item.className = `field-cell`;
    item.innerHTML = '';
  });
};

function toggleMessage(result) {
  document.querySelector(`.${result}`).classList.toggle('hidden');
};

function newMoveState(isDobleCell = false) {
  pointsScrean.innerHTML = scores;
  boardCheck = [];
  clearCells();
  newCell();
  isDobleCell && newCell();
  renderCells();
  loseGameCheck();
};

function loseGameCheck(arr = board) {
  if (arr.flat().filter(i => i).length !== 16) {
    return;
  };

  const checkX = [];
  const checkY = [];

  arr.forEach(item => slideResult(item, checkX));
  transpose(arr).forEach(item => slideResult(item, checkY));

  if (isNoSlide(checkX) && isNoSlide(checkY)) {
    toggleMessage('message-lose');
  };
};

document.addEventListener('keydown', (e) => {
  if (!direction[`${e.key}`]) {
    return;
  };

  direction[`${e.key}`]();
  slideBoard();

  if (isNoSlide(boardCheck)) {
    return;
  };

  newMoveState();
});

startButton.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    startButton.className = 'button restart';
    startButton.innerHTML = 'Restart';
    toggleMessage('message-start');
  };

  document.querySelector('.message-lose').classList.add('hidden');
  board = newBoard.map(arr => arr.slice());
  scores = 0;
  newMoveState(true);
});

winPromise.then(toggleMessage);
