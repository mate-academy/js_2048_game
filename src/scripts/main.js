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
});

function hasEmptyTile() {
  for (let r = 0; r < numOfCells; r++) {
    if (gameField[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function setRundom() {
  while (hasEmptyTile()) {
    const randomRow = Math.floor((Math.random() * numOfCells));
    const randomCol = Math.floor((Math.random() * numOfCells));

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

  setRundom();
  setRundom();
}

function loseGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < numOfCells; r++) {
    for (let c = 0; c < numOfCells; c++) {
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

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setRundom();
      break;

    case 'ArrowRight':
      slideRight();
      setRundom();
      break;

    case 'ArrowUp':
      slideUp();
      setRundom();
      break;

    case 'ArrowDown':
      slideDown();
      setRundom();
      break;
  }

  setCells();
});

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
  for (let r = 0; r < numOfCells; r++) {
    let row = gameField[r];

    row = slide(row);
    gameField[r] = row;
  }
}

function slideRight() {
  for (let r = 0; r < numOfCells; r++) {
    let row = gameField[r].reverse();

    row = slide(row).reverse();
    gameField[r] = row;
  }
}

function slideUp() {
  for (let c = 0; c < numOfCells; c++) {
    let row = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ];

    row = slide(row);

    for (let r = 0; r < numOfCells; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function slideDown() {
  for (let c = 0; c < numOfCells; c++) {
    let row = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ].reverse();

    row = slide(row).reverse();

    for (let r = 0; r < numOfCells; r++) {
      gameField[r][c] = row[r];
    }
  }
}
