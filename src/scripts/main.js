'use strict';

const startButton = document.querySelector('.start');
let score = 0;

const size = 4;
const gameData = new Array(size);

function initializeGame() {
  for (let i = 0; i < size; i++) {
    gameData[i] = new Array(size);

    for (let j = 0; j < size; j++) {
      gameData[i][j] = 0;
    }
  }

  score = 0;
  generateNewNumber();
  generateNewNumber();

  const messageContainer = document.querySelector('.message-container');

  messageContainer.innerHTML = '';
}

function generateNewNumber() {
  while (true) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (gameData[row][col] === 0) {
      const randomNumber = Math.random() < 0.1 ? 4 : 2;

      gameData[row][col] = randomNumber;
      updateUI();
      break;
    }

    if (isGameOver()) {
      break;
    }
  }
}

function isGameOver() {
  let gameOver = true;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (gameData[i][j] === 0) {
        gameOver = false;
      }
    }
  }

  return gameOver;
}

startButton.addEventListener('click', () => {
  initializeGame();
  updateUI();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  const messageStart = document.querySelector('.message-start');

  messageStart.style.display = 'none';

  if (isGameOver()) {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
});

function moveLeft() {
  const oldGrid = gameData.map(row => [...row]);

  for (let i = 0; i < size; i++) {
    gameData[i] = slideAndMerge(gameData[i].reverse()).reverse();
  }

  const changed = !gameData.every((row, i) =>
    row.every((num, j) => num === oldGrid[i][j])
  );

  if (changed) {
    generateNewNumber();
    updateUI();
  }
}

function moveRight() {
  const oldGrid = gameData.map(row => [...row]);

  for (let i = 0; i < size; i++) {
    gameData[i] = slideAndMerge(gameData[i]);
  }

  const changed = !gameData.every((row, i) =>
    row.every((num, j) => num === oldGrid[i][j])
  );

  if (changed) {
    generateNewNumber();
    updateUI();
  }
}

function moveUp() {
  const oldGrid = gameData.map(row => [...row]);

  for (let i = 0; i < size; i++) {
    let arr = [];

    for (let j = 0; j < size; j++) {
      arr.push(gameData[j][i]);
    }

    arr = slideAndMerge(arr.reverse()).reverse();

    for (let j = 0; j < size; j++) {
      gameData[j][i] = arr[j];
    }
  }

  const changed = !gameData.every((row, i) =>
    row.every((num, j) => num === oldGrid[i][j])
  );

  if (changed) {
    generateNewNumber();
    updateUI();
  }
}

function moveDown() {
  const oldGrid = gameData.map(row => [...row]);

  for (let i = 0; i < size; i++) {
    let arr = [];

    for (let j = 0; j < size; j++) {
      arr.push(gameData[j][i]);
    }

    arr = slideAndMerge(arr);

    for (let j = 0; j < size; j++) {
      gameData[j][i] = arr[j];
    }
  }

  const changed = !gameData.every((row, i) =>
    row.every((num, j) => num === oldGrid[i][j])
  );

  if (changed) {
    generateNewNumber();
    updateUI();
  }
}

function slideAndMerge(row) {
  let arr = row.filter(val => val);
  let missing = size - arr.length;
  let zeros = Array(missing).fill(0);

  arr = zeros.concat(arr);

  for (let j = size - 1; j > 0; j--) {
    const a = arr[j];
    const b = arr[j - 1];

    if (a === b) {
      arr[j] = a + b;
      score += arr[j];
      arr[j - 1] = 0;
    }
  }

  arr = arr.filter(val => val);
  missing = size - arr.length;
  zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);

  return arr;
}

document.addEventListener('keydown', function(evt) {
  switch (evt.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
  }
});

function updateUI() {
  const table = document.querySelector('.game-field');

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = table.rows[i].cells[j];

      cell.innerText = gameData[i][j] === 0 ? '' : gameData[i][j];
      cell.className = 'field-cell field-cell--' + gameData[i][j];

      if (gameData[i][j] === 2048) {
        const messageContainer = document.querySelector('.message-container');

        messageContainer.innerHTML = `
        <p class="message message-win">
          Winner! Congrats! You did it!
        </p>`;
      }
    }
  }

  document.querySelector('.game-score').innerText = score;
  checkGameOver();
}

function canMove(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (j < board[i].length - 1 && board[i][j] === board[i][j + 1]) {
        return true;
      }

      if (i < board.length - 1 && board[i][j] === board[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function checkGameOver() {
  if (!canMove(gameData)) {
    const messageContainer = document.querySelector('.message-container');

    messageContainer.innerHTML = `
    <p class="message message-lose">
      Game Over
    </p>`;
  }
}
