'use strict';

const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const cells = 4;
let score = 0;
let moveScore = 0;

function getRandomTileValue() {
  return Math.round(Math.random()) < 0.9 ? 2 : 4;
}

function getRandomIndex() {
  return Math.floor(Math.random() * 4);
}

function isWinner() {
  return gameBoard.some(row => row.some(cell => cell === 2048));
}

function resetBoard() {
  gameBoard.forEach(row => row.fill(0));
}

startButton.addEventListener('click', (buttonEvent) => {
  resetBoard();
  score = 0;

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startButton.classList.remove('start');
  buttonEvent.target.classList.add('restart');
  startButton.innerHTML = 'Restart';

  document.addEventListener('keyup', keyHandler);

  appendTile();
  appendTile();

  renderBoard();
});

function hasEmptyTile() {
  return gameBoard.some(row => row.some(cell => cell === 0));
}

function appendTile() {
  if (hasEmptyTile()) {
    let rowIndex, cellIndex;

    do {
      rowIndex = getRandomIndex();
      cellIndex = getRandomIndex();
    } while (gameBoard[rowIndex][cellIndex] !== 0);

    gameBoard[rowIndex][cellIndex] = getRandomTileValue();
  } else {
    return null;
  }
}

function updateTile(tile, cellValue) {
  tile.innerHTML = '';
  tile.className = '';
  tile.classList.add('field-cell');

  if (cellValue > 0) {
    tile.classList.add(`field-cell--${cellValue}`);
    tile.innerHTML = cellValue;
    moveScore += cellValue;
  }

  updateScore();
};

function updateScore() {
  gameScore.innerHTML = score;
}

function renderBoard() {
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let cellIndex = 0; cellIndex < cells; cellIndex++) {
      const tile = gameField.rows[rowIndex].cells[cellIndex];
      const cellValue = gameBoard[rowIndex][cellIndex];

      updateTile(tile, cellValue);
    }
  }
}

function move(row) {
  const noZerosRow = row.filter(cell => cell !== 0);
  const mergedRow = [];
  let mergedValue = 0;

  for (let i = 0; i < noZerosRow.length; i++) {
    if (noZerosRow[i] === noZerosRow[i + 1]) {
      mergedRow.push(noZerosRow[i] * 2);
      mergedValue += noZerosRow[i] * 2;
      i++;
    } else {
      mergedRow.push(noZerosRow[i]);
    }
  }

  while (mergedRow.length < cells) {
    mergedRow.push(0);
  }

  score += mergedValue;

  return mergedRow;
}

function moveLeft() {
  isWinner();
  moveScore = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const newRow = gameBoard[rowIndex];

    gameBoard[rowIndex] = move(newRow);
  }

  appendTile();
  score += moveScore;

  updateScore();
  renderBoard();
}

function moveRight() {
  isWinner();
  moveScore = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const newRow = gameBoard[rowIndex];

    newRow.reverse();

    gameBoard[rowIndex] = move(newRow).reverse();
  }

  appendTile();
  score += moveScore;

  updateScore();
  renderBoard();
};

function moveUp() {
  isWinner();
  moveScore = 0;

  for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
    let newColumn = [
      gameBoard[0][columnIndex],
      gameBoard[1][columnIndex],
      gameBoard[2][columnIndex],
      gameBoard[3][columnIndex],
    ];

    newColumn = move(newColumn);

    gameBoard[0][columnIndex] = newColumn[0];
    gameBoard[1][columnIndex] = newColumn[1];
    gameBoard[2][columnIndex] = newColumn[2];
    gameBoard[3][columnIndex] = newColumn[3];
  }

  appendTile();
  score += moveScore;

  updateScore();
  renderBoard();
};

function moveDown() {
  isWinner();
  moveScore = 0;

  for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
    let newColumn = [
      gameBoard[3][columnIndex],
      gameBoard[2][columnIndex],
      gameBoard[1][columnIndex],
      gameBoard[0][columnIndex],
    ];

    newColumn = move(newColumn);

    gameBoard[3][columnIndex] = newColumn[0];
    gameBoard[2][columnIndex] = newColumn[1];
    gameBoard[1][columnIndex] = newColumn[2];
    gameBoard[0][columnIndex] = newColumn[3];
  }

  appendTile();
  score += moveScore;

  updateScore();
  renderBoard();
};

function keyHandler(keyEvent) {
  switch (keyEvent.code) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }
};
