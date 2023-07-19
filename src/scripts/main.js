'use strict';

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const cells = document.querySelector('tbody');
const startGameText = document.querySelector('.message-start');
const loseGameText = document.querySelector('.message-lose');
const winGameText = document.querySelector('.message-win');

const numOfCells = 4;
let scoreCount = 0;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  startGameText.classList.add('hidden');
  loseGameText.classList.add('hidden');
  winGameText.classList.add('hidden');

  startPlay();
  addArrowKeyListener();
});

function hasEmptyTile() {
  for (let r = 0; r < numOfCells; r++) {
    if (gameField[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function setRandom() {
  while (hasEmptyTile()) {
    const randomRow = Math.floor(Math.random() * numOfCells);
    const randomCol = Math.floor(Math.random() * numOfCells);

    if (gameField[randomRow][randomCol] === 0) {
      const numb = Math.random() < 0.9 ? 2 : 4;

      gameField[randomRow][randomCol] = numb;
      break;
    }
  }

  setCells();
}

function startPlay() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  scoreCount = 0;
  score.innerText = scoreCount;

  setRandom();
  setRandom();
}

function loseGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < numOfCells; r++) {
    for (let c = 0; c < numOfCells - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < numOfCells - 1; r++) {
    for (let c = 0; c < numOfCells; c++) {
      if (gameField[r][c] === gameField[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function setCells() {
  for (let r = 0; r < numOfCells; r++) {
    for (let c = 0; c < numOfCells; c++) {
      const currentCell = cells.rows[r].cells[c];
      const num = gameField[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        winGameText.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (loseGame()) {
    loseGameText.classList.remove('hidden');
  }
}

function addArrowKeyListener() {
  document.addEventListener('keyup', handleArrowKey);
}

function handleArrowKey(e) {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setRandom();
      break;

    case 'ArrowRight':
      slideRight();
      setRandom();
      break;

    case 'ArrowUp':
      slideUp();
      setRandom();
      break;

    case 'ArrowDown':
      slideDown();
      setRandom();
      break;
  }

  setCells();
}

function checkZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = checkZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];

      score.innerText = scoreCount;
    }
  }

  newRow = checkZero(newRow);

  while (newRow.length < numOfCells) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let i = 0; i < numOfCells; i++) {
    let row = gameField[i].slice();

    row = slide(row);
    gameField[i] = row;
  }
}

function slideRight() {
  for (let i = 0; i < numOfCells; i++) {
    let row = gameField[i].slice().reverse();

    row = slide(row).reverse();
    gameField[i] = row;
  }
}

function slideUp() {
  for (let i = 0; i < numOfCells; i++) {
    let row = [
      gameField[0][i],
      gameField[1][i],
      gameField[2][i],
      gameField[3][i],
    ];

    row = slide(row);

    for (let v = 0; v < numOfCells; v++) {
      gameField[v][i] = row[v];
    }
  }
}

function slideDown() {
  for (let i = 0; i < numOfCells; i++) {
    let row = [
      gameField[0][i],
      gameField[1][i],
      gameField[2][i],
      gameField[3][i],
    ].reverse();

    row = slide(row).reverse();

    for (let v = 0; v < numOfCells; v++) {
      gameField[v][i] = row[v];
    }
  }
}
