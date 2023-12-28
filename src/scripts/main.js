'use strict';

const start = document.querySelector('.button');
const scoreHTML = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
let gameIsStarted = false;
let score = 0;
const rows = 4;
const cols = 4;
const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function renderGameField() {
  cells[0].innerHTML = !gameField[0][0] ? '' : gameField[0][0];
  cells[1].innerHTML = !gameField[0][1] ? '' : gameField[0][1];
  cells[2].innerHTML = !gameField[0][2] ? '' : gameField[0][2];
  cells[3].innerHTML = !gameField[0][3] ? '' : gameField[0][3];
  cells[4].innerHTML = !gameField[1][0] ? '' : gameField[1][0];
  cells[5].innerHTML = !gameField[1][1] ? '' : gameField[1][1];
  cells[6].innerHTML = !gameField[1][2] ? '' : gameField[1][2];
  cells[7].innerHTML = !gameField[1][3] ? '' : gameField[1][3];
  cells[8].innerHTML = !gameField[2][0] ? '' : gameField[2][0];
  cells[9].innerHTML = !gameField[2][1] ? '' : gameField[2][1];
  cells[10].innerHTML = !gameField[2][2] ? '' : gameField[2][2];
  cells[11].innerHTML = !gameField[2][3] ? '' : gameField[2][3];
  cells[12].innerHTML = !gameField[3][0] ? '' : gameField[3][0];
  cells[13].innerHTML = !gameField[3][1] ? '' : gameField[3][1];
  cells[14].innerHTML = !gameField[3][2] ? '' : gameField[3][2];
  cells[15].innerHTML = !gameField[3][3] ? '' : gameField[3][3];

  for (let i = 0; i < cells.length; i++) {
    switch (cells[i].innerHTML) {
      case '2':
        cells[i].className = 'field-cell field-cell--2';
        break;
      case '4':
        cells[i].className = 'field-cell field-cell--4';
        break;
      case '8':
        cells[i].className = 'field-cell field-cell--8';
        break;
      case '16':
        cells[i].className = 'field-cell field-cell--16';
        break;
      case '32':
        cells[i].className = 'field-cell field-cell--32';
        break;
      case '64':
        cells[i].className = 'field-cell field-cell--64';
        break;
      case '128':
        cells[i].className = 'field-cell field-cell--128';
        break;
      case '256':
        cells[i].className = 'field-cell field-cell--256';
        break;
      case '512':
        cells[i].className = 'field-cell field-cell--512';
        break;
      case '1024':
        cells[i].className = 'field-cell field-cell--1024';
        break;
      case '2048':
        cells[i].className = 'field-cell field-cell--2048';
        break;
      default:
        cells[i].className = 'field-cell';
    }
  }
}

function generateNumberTwoOrFour() {
  const numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const random = Math.floor(Math.random() * 10);

  return numbers[random];
}

function generateInEmptyCell() {
  const emptyCells = getEmptyCellIndex();
  const random = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[random];
}

function getEmptyCellIndex() {
  const emptyCellCoords = [];

  for (let row = 0; row < gameField.length; row++) {
    for (let col = 0; col < gameField[row].length; col++) {
      if (!gameField[row][col]) {
        const coords = [row, col];

        emptyCellCoords.push(coords);
      }
    }
  }

  if (emptyCellCoords.length !== 0) {
    return emptyCellCoords;
  } else {
    return false;
  }
}

function generateCell() {
  const cell = generateInEmptyCell();

  if (cell) {
    gameField[cell[0]][cell[1]] = generateNumberTwoOrFour();
  } else {
    return 'no empty cells';
  }
}

function gameStart() {
  score = 0;
  gameIsStarted = true;
  generateCell();
  generateCell();
  renderGameField();
}

function gameStatus() {
  const moveStatus = [true, true, true, true];
  let tempGameField = JSON.parse(JSON.stringify(gameField));

  for (let r = 0; r < rows; r++) {
    let row = tempGameField[r];

    row = slideForCheck(row);
    tempGameField[r] = row;
  }

  if (JSON.stringify(tempGameField) === JSON.stringify(gameField)) {
    moveStatus[0] = false;
  }

  tempGameField = JSON.parse(JSON.stringify(gameField));

  for (let r = 0; r < rows; r++) {
    let row = tempGameField[r];

    row.reverse();
    row = slideForCheck(row);
    row.reverse();
    tempGameField[r] = row;
  }

  if (JSON.stringify(tempGameField) === JSON.stringify(gameField)) {
    moveStatus[1] = false;
  }

  let rotateGame = gameField
    .map((val, index) => gameField.map(row => row[row.length - 1 - index]));

  for (let r = 0; r < rows; r++) {
    let row = rotateGame[r];

    row = slideForCheck(row);
    rotateGame[r] = row;
  }

  rotateGame = rotateGame
    .map((val, index) => rotateGame.map(row => row[index]).reverse());

  if (JSON.stringify(rotateGame) === JSON.stringify(gameField)) {
    moveStatus[2] = false;
  }

  rotateGame = gameField
    .map((val, index) => gameField.map(row => row[index]).reverse());

  for (let r = 0; r < rows; r++) {
    let row = rotateGame[r];

    row = slideForCheck(row);
    rotateGame[r] = row;
  }

  rotateGame = rotateGame
    .map((val, index) => rotateGame.map(row => row[row.length - 1 - index]));

  if (JSON.stringify(rotateGame) === JSON.stringify(gameField)) {
    moveStatus[3] = false;
  }

  const canMove = moveStatus.filter(item => !item);

  if (generateCell() === 'no empty cells' && canMove.length === 4) {
    gameOver();
  }

  if (score >= 2048) {
    winner();
  }
}

function winner() {
  gameIsStarted = false;
  document.querySelector('.message-win').classList.remove('hidden');
}

function gameOver() {
  gameIsStarted = false;
  document.querySelector('.message-lose').classList.remove('hidden');
}

function removeZeros(arr) {
  const row = arr.filter(cell => cell !== 0);

  return row;
}

function slide(arr) {
  let row = removeZeros(arr);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = removeZeros(row);

  for (let i = 0; i < cols; i++) {
    if (!row[i]) {
      row.push(0);
    }
  }

  return row;
}

function slideForCheck(arr) {
  let row = removeZeros(arr);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }

  row = removeZeros(row);

  for (let i = 0; i < cols; i++) {
    if (!row[i]) {
      row.push(0);
    }
  }

  return row;
}

function leftArrow() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row = slide(row);
    gameField[r] = row;
  }
}

function rightArrow() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    gameField[r] = row;
  }
}

function upArrow() {
  let rotateGame = gameField
    .map((val, index) => gameField.map(row => row[row.length - 1 - index]));

  for (let r = 0; r < rows; r++) {
    let row = rotateGame[r];

    row = slide(row);
    rotateGame[r] = row;
  }

  rotateGame = rotateGame
    .map((val, index) => rotateGame.map(row => row[index]).reverse());

  for (let r = 0; r < rows; r++) {
    gameField[r] = rotateGame[r];
  }
}

function downArrow() {
  let rotateGame = gameField
    .map((val, index) => gameField.map(row => row[index]).reverse());

  for (let r = 0; r < rows; r++) {
    let row = rotateGame[r];

    row = slide(row);
    rotateGame[r] = row;
  }

  rotateGame = rotateGame
    .map((val, index) => rotateGame.map(row => row[row.length - 1 - index]));

  for (let r = 0; r < rows; r++) {
    gameField[r] = rotateGame[r];
  }
}

start.addEventListener('click', () => {
  for (let r = 0; r < gameField.length; r++) {
    for (let c = 0; c < gameField[r].length; c++) {
      gameField[r][c] = 0;
    }
  }
  start.classList.remove('start');
  start.classList.add('restart');
  start.innerHTML = 'Restart';
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  gameStart();
});

document.addEventListener('keydown', (e) => {
  if (gameIsStarted) {
    if (e.key === 'ArrowRight') {
      rightArrow();
    } else if (e.key === 'ArrowLeft') {
      leftArrow();
    } else if (e.key === 'ArrowUp') {
      upArrow();
    } else if (e.key === 'ArrowDown') {
      downArrow();
    }

    scoreHTML.innerHTML = score;
    generateCell();
    renderGameField();
    gameStatus();
  };
});
