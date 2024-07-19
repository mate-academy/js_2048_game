'use strict';

const tbody = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageContainer = document.querySelector('.message-container');

let gameFields = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

let isStart = false;

let isWin = false;

document.addEventListener('keydown', handleKeyPress);

function gameOver() {
  for (let row = 0; row < gameFields.length; row++) {
    for (let column = 0; column < gameFields[row].length; column++) {
      if (gameFields[row][column] === 0) {
        return false;
      }

      if (
        column < gameFields[row].length - 1
        && gameFields[row][column] === gameFields[row][column + 1]
      ) {
        return false;
      }

      if (
        row < gameFields.length - 1
        && gameFields[row][column] === gameFields[row + 1][column]
      ) {
        return false;
      }
    }
  }

  messageLose.classList.remove('hidden');

  return true;
}

function gameIsWin() {
  for (let row = 0; row < gameFields.length; row++) {
    for (let column = 0; column < gameFields[row].length; column++) {
      if (gameFields[row][column] === 2048) {
        isWin = true;
        messageWin.classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}

function moveTilesRight() {
  let moved = false;

  for (let row = 0; row < gameFields.length; row++) {
    let newRow = gameFields[row].filter((tile) => tile !== 0);

    for (let i = newRow.length - 1; i > 0; i--) {
      if (newRow[i] === newRow[i - 1]) {
        newRow[i] *= 2;
        newRow[i - 1] = 0;
        score += newRow[i];
        moved = true;
      }
    }
    newRow = newRow.filter((tile) => tile !== 0);

    while (newRow.length < 4) {
      newRow.unshift(0);
    }

    if (JSON.stringify(newRow) !== JSON.stringify(gameFields[row])) {
      moved = true;
    }
    gameFields[row] = newRow;
  }

  if (moved) {
    generateRandomNumber();
    render();
  }
}

function moveTilesLeft() {
  let moved = false;

  for (let row = 0; row < gameFields.length; row++) {
    let newRow = gameFields[row].filter((tile) => tile !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        score += newRow[i];
        moved = true;
      }
    }
    newRow = newRow.filter((tile) => tile !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    if (JSON.stringify(newRow) !== JSON.stringify(gameFields[row])) {
      moved = true;
    }
    gameFields[row] = newRow;
  }

  if (moved) {
    generateRandomNumber();
    render();
  }
}

function moveTilesUp() {
  let moved = false;

  for (let column = 0; column < 4; column++) {
    let newCol = [];

    for (let row = 0; row < 4; row++) {
      if (gameFields[row][column] !== 0) {
        newCol.push(gameFields[row][column]);
      }
    }

    for (let i = 0; i < newCol.length - 1; i++) {
      if (newCol[i] === newCol[i + 1]) {
        newCol[i] *= 2;
        newCol[i + 1] = 0;
        score += newCol[i];
        moved = true;
      }
    }
    newCol = newCol.filter((tile) => tile !== 0);

    while (newCol.length < 4) {
      newCol.push(0);
    }

    for (let row = 0; row < 4; row++) {
      if (gameFields[row][column] !== newCol[row]) {
        moved = true;
      }
      gameFields[row][column] = newCol[row];
    }
  }

  if (moved) {
    generateRandomNumber();
    render();
  }
}

function moveTilesDown() {
  let moved = false;

  for (let column = 0; column < 4; column++) {
    let newCol = [];

    for (let row = 0; row < 4; row++) {
      if (gameFields[row][column] !== 0) {
        newCol.push(gameFields[row][column]);
      }
    }

    for (let i = newCol.length - 1; i > 0; i--) {
      if (newCol[i] === newCol[i - 1]) {
        newCol[i] *= 2;
        newCol[i - 1] = 0;
        score += newCol[i];
        moved = true;
      }
    }

    newCol = newCol.filter((tile) => tile !== 0);

    while (newCol.length < 4) {
      newCol.unshift(0);
    }

    for (let row = 0; row < 4; row++) {
      if (gameFields[row][column] !== newCol[row]) {
        moved = true;
      }
      gameFields[row][column] = newCol[row];
    }
  }

  if (moved) {
    generateRandomNumber();
    render();
  }
}

function generateRandomNumber() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      if (gameFields[row][column] === 0) {
        emptyCells.push({
          row, column,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, column }
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const number = Math.random() < 0.1 ? 4 : 2;

    gameFields[row][column] = number;
  }
}

function handleKeyPress(ev) {
  if (isStart) {
    let moved = false;

    switch (ev.key) {
      case 'ArrowUp':
        moveTilesUp();
        moved = true;
        break;
      case 'ArrowDown':
        moveTilesDown();
        moved = true;
        break;
      case 'ArrowLeft':
        moveTilesLeft();
        moved = true;
        break;
      case 'ArrowRight':
        moveTilesRight();
        moved = true;
        break;
    }

    if (moved) {
      render();
    }
  }
}

const render = () => {
  gameScore.innerHTML = `
    <span class="game-score">${score}</span>
  `;

  tbody.innerHTML = '';

  for (let i = 0; i < gameFields.length; i++) {
    const row = document.createElement('tr');

    row.classList.add('field-row');

    for (let j = 0; j < gameFields[i].length; j++) {
      const cellValue = gameFields[i][j];
      const cell = document.createElement('td');

      cell.textContent = cellValue === 0 ? '' : cellValue;
      cell.classList.add('field-cell');

      if (cellValue === 0) {
        cell.classList.add('field-cell');
      } else {
        cell.classList.add(`field-cell--${cellValue}`);
      }

      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  if (gameOver()) {
    return;
  }
  gameIsWin();
  messageWin.classList.toggle('hidden', !isWin);

  if (!isStart) {
    messageContainer.appendChild(messageStart);
  } else if (messageContainer.contains(messageStart)) {
    messageContainer.removeChild(messageStart);
  }
};

button.addEventListener('click', () => {
  isStart = true;

  gameFields = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  button.classList.add('restart');
  button.textContent = 'Restart';

  if (messageContainer.contains(messageStart)) {
    messageContainer.removeChild(messageStart);
  }

  generateRandomNumber();
  generateRandomNumber();
  render();
});
