'use strict';

let score = 0;
const rows = 4;
const columns = 4;
let board;

const startButton = document.querySelector('.start');
const messageLoss = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const scoreElement = document.querySelector('.game-score');
const rowsArray = [...document.querySelectorAll('tr')];
const cellsArray = [...document.querySelectorAll('.field-cell')];

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setRandom();
  setRandom();
}

function updateStyle(tile, number) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add(`field-cell--${number}`, 'field-cell');

  if (number > 0) {
    tile.innerText = number;
  }

  if (number === 2048) {
    messageWin.style.display = 'block';
  }
}

function hasEmpty() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setRandom() {
  if (!hasEmpty()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);
    const random = Math.random() * 100;

    if (board[r][c] === 0) {
      const tile = rowsArray[r].children[c];

      if (random < 10) {
        board[r][c] = 4;
        updateStyle(tile, 4);
      } else {
        board[r][c] = 2;
        updateStyle(tile, 2);
      }

      found = true;
    }
  }
}

function merge(row) {
  let filteredRow = row.filter(n => n !== 0);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
    }
  }

  scoreElement.innerHTML = score;
  filteredRow = filteredRow.filter(n => n !== 0);

  while (filteredRow.length < columns) {
    filteredRow.push(0);
  }

  return filteredRow;
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    setGame();
  } else if (startButton.classList.contains('restart')) {
    cellsArray.forEach(a => updateStyle(a, 0));
    score = 0;
    scoreElement.innerHTML = score;
    messageLoss.style.display = 'none';
    messageWin.style.display = 'none';
    setGame();
  }
});

document.addEventListener('keyup', (browserEvent) => {
  switch (browserEvent.code) {
    case 'ArrowUp':
      for (let c = 0; c < columns; c++) {
        let row = board.map(el => el[c]);

        row = merge(row);

        for (let r = 0; r < rows; r++) {
          board[r][c] = row[r];

          const tile = rowsArray[r].children[c];
          const num = board[r][c];

          updateStyle(tile, num);
        }
      }

      setRandom();
      break;
    case 'ArrowDown':
      for (let c = 0; c < columns; c++) {
        let row = board.map(el => el[c]).reverse();

        row = merge(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
          board[r][c] = row[r];

          const tile = rowsArray[r].children[c];
          const num = board[r][c];

          updateStyle(tile, num);
        }
      }

      setRandom();
      break;
    case 'ArrowRight':
      for (let r = 0; r < rows; r++) {
        let row = board[r];

        row.reverse();
        row = merge(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
          const tile = rowsArray[r].children[c];
          const num = board[r][c];

          updateStyle(tile, num);
        }
      }

      setRandom();
      break;
    case 'ArrowLeft':
      for (let r = 0; r < rows; r++) {
        let row = board[r];

        row = merge(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
          const tile = rowsArray[r].children[c];
          const num = board[r][c];

          updateStyle(tile, num);
        }
      }

      setRandom();
      break;
  }

  if (!mergePossible() && !hasEmpty()) {
    messageLoss.style.display = 'block';
  }
});

function mergePossible() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1] || board[c][r] === board[c + 1][r]) {
        return true;
      }
    }
  }

  return false;
}
