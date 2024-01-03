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

let score = gameFields.reduce((acc, row) => {
  return acc + row.reduce((rowSum, cell) => rowSum + cell, 0);
}, 0);

let isStart = false;

let isWin = false;

document.addEventListener('keydown', handleKeyPress);

function gameOver() {
  for (let row = 0; row < gameFields.length; row++) {
    for (let column = 0; column < gameFields[row].length; column++) {
      if (gameFields[row][column] === 0) {
        return;
      }

      if (column < gameFields[row].length - 1
        && gameFields[row][column] === gameFields[row][column + 1]) {
        return;
      }

      if (row < gameFields.length - 1
        && gameFields[row][column] === gameFields[row + 1][column]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

function gameIsWin() {
  const result = gameFields.some(field => field.some(tile => tile === 2048));

  if (result) {
    isWin = true;
  }
}

function moveTilesRight() {
  let moved = false;

  for (let row = 0; row < gameFields.length; row++) {
    for (let column = 1; column < gameFields[row].length; column++) {
      const current = gameFields[row][column];
      const next = gameFields[row][column - 1];

      if (next > 0) {
        if (current === 0) {
          gameFields[row][column] = next;
          gameFields[row][column - 1] = 0;
          column = -1;
          moved = true;
        } else if (current === next) {
          gameFields[row][column] *= 2;
          gameFields[row][column - 1] = 0;
          score += gameFields[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomNumber();
  }
}

function moveTilesLeft() {
  let moved = false;

  for (let row = 0; row < gameFields.length; row++) {
    for (let column = gameFields[row].length - 1; column >= 0; column--) {
      const current = gameFields[row][column];
      const next = gameFields[row][column + 1];

      if (next > 0) {
        if (current === 0) {
          gameFields[row][column] = next;
          gameFields[row][column + 1] = 0;
          column = gameFields[row].length;
          moved = true;
        } else if (current === next) {
          gameFields[row][column] *= 2;
          gameFields[row][column + 1] = 0;
          score += gameFields[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomNumber();
  }
}

function moveTilesUp() {
  let moved = false;

  for (let column = 0; column < gameFields[0].length; column++) {
    for (let row = 0; row < gameFields.length - 1; row++) {
      const current = gameFields[row][column];
      const next = gameFields[row + 1][column];

      if (next > 0) {
        if (current === 0) {
          [gameFields[row][column], gameFields[row + 1][column]] = [next, 0];
          row = -1;
          moved = true;
        } else if (current === next) {
          gameFields[row][column] *= 2;
          gameFields[row + 1][column] = 0;
          score += gameFields[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomNumber();
  }
}

function moveTilesDown() {
  let moved = false;

  for (let column = 0; column < gameFields[0].length; column++) {
    for (let row = gameFields.length - 1; row > 0; row--) {
      const current = gameFields[row][column];
      const next = gameFields[row - 1][column];

      if (next > 0) {
        if (current === 0) {
          gameFields[row][column] = next;
          gameFields[row - 1][column] = 0;
          row = gameFields.length;
          moved = true;
        } else if (current === next) {
          gameFields[row][column] *= 2;
          gameFields[row - 1][column] = 0;
          score += gameFields[row][column];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateRandomNumber();
  }
}

function generateRandomNumber() {
  let randomCell = Math.floor(Math.random() * 4);
  let randomRow = Math.floor(Math.random() * 4);

  while (gameFields[randomCell][randomRow] !== 0) {
    randomCell = Math.floor(Math.random() * 4);
    randomRow = Math.floor(Math.random() * 4);
  }

  const number = Math.random() < 0.1 ? 4 : 2;

  gameFields[randomCell][randomRow] = number;
}

function handleKeyPress(ev) {
  if (isStart) {
    switch (ev.key) {
      case 'ArrowUp':
        moveTilesUp();
        break;
      case 'ArrowDown':
        moveTilesDown();
        break;
      case 'ArrowLeft':
        moveTilesLeft();
        break;
      case 'ArrowRight':
        moveTilesRight();
        break;
    }
  }

  render();
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

  gameOver();
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

  button.classList.add('restart');
  button.textContent = 'Restart';
  generateRandomNumber();
  generateRandomNumber();
  render();
});
