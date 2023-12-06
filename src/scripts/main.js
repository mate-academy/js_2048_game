'use strict';

const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const rows = 4;
const cells = 4;
let score = 0;
let moveScore = 0;
let moveMade = false;

const gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomTileValue() {
  return Math.round(Math.random()) < 0.9 ? 2 : 4;
}

function getRandomIndex() {
  return Math.floor(Math.random() * 4);
}

function hasAdjacentTiles() {
  let hasAdjacent = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      if (c < cells - 1 && gameBoard[r][c] === gameBoard[r][c + 1]) {
        hasAdjacent = true;
      } else if (r < rows - 1 && gameBoard[r][c] === gameBoard[r + 1][c]) {
        hasAdjacent = true;
      }
    }
  }

  return hasAdjacent;
};

function isLoser() {
  if (!hasEmptyTile() && !hasAdjacentTiles()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keyup', keyHandler);
  }
}

function isWinner() {
  if (gameBoard.some(row => row.some(cell => cell === 2048))) {
    winMessage.classList.remove('hidden');
    document.removeEventListener('keyup', keyHandler);
  }
}

function resetBoard() {
  gameBoard.forEach(row => row.fill(0));
}

startButton.addEventListener('click', (buttonEvent) => {
  resetBoard();
  score = 0;
  moveMade = false;

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
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cells; c++) {
      const tile = gameField.rows[r].cells[c];
      const cellValue = gameBoard[r][c];

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
  moveMade = false;
  isWinner();
  isLoser();
  moveScore = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const newRow = gameBoard[rowIndex];

    const movedRow = move(newRow);

    if (!arraysEqual(newRow, movedRow)) {
      moveMade = true;
    }

    gameBoard[rowIndex] = movedRow;
  }

  if (moveMade) {
    appendTile();
  }
  score += moveScore;

  updateScore();
  renderBoard();
}

function moveRight() {
  moveMade = false;
  isWinner();
  isLoser();
  moveScore = 0;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const newRow = gameBoard[rowIndex];

    const reversedRow = newRow.slice().reverse();
    const movedRow = move(reversedRow);
    const finalRow = movedRow.reverse();

    if (!arraysEqual(newRow, finalRow)) {
      moveMade = true;
    }

    gameBoard[rowIndex] = finalRow;
  }

  if (moveMade) {
    appendTile();
  }

  score += moveScore;

  updateScore();
  renderBoard();
};

function moveUp() {
  moveMade = false;
  isWinner();
  isLoser();
  moveScore = 0;

  for (let columnIndex = 0; columnIndex < cells; columnIndex++) {
    const newColumn = [
      gameBoard[0][columnIndex],
      gameBoard[1][columnIndex],
      gameBoard[2][columnIndex],
      gameBoard[3][columnIndex],
    ];

    const column = move(newColumn);

    if (!arraysEqual(newColumn, column)) {
      moveMade = true;
    }

    gameBoard[0][columnIndex] = column[0];
    gameBoard[1][columnIndex] = column[1];
    gameBoard[2][columnIndex] = column[2];
    gameBoard[3][columnIndex] = column[3];
  }

  if (moveMade) {
    appendTile();
  }

  score += moveScore;

  updateScore();
  renderBoard();
};

function moveDown() {
  moveMade = false;
  isWinner();
  isLoser();
  moveScore = 0;

  for (let columnIndex = 0; columnIndex < cells; columnIndex++) {
    const newColumn = [
      gameBoard[3][columnIndex],
      gameBoard[2][columnIndex],
      gameBoard[1][columnIndex],
      gameBoard[0][columnIndex],
    ];

    const column = move(newColumn);

    if (!arraysEqual(newColumn, column)) {
      moveMade = true;
    }

    gameBoard[3][columnIndex] = column[0];
    gameBoard[2][columnIndex] = column[1];
    gameBoard[1][columnIndex] = column[2];
    gameBoard[0][columnIndex] = column[3];
  }

  if (moveMade) {
    appendTile();
  }

  score += moveScore;

  updateScore();
  renderBoard();
};

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function keyHandler(keyEvent) {
  const keyActions = {
    ArrowLeft: moveLeft,
    ArrowRight: moveRight,
    ArrowUp: moveUp,
    ArrowDown: moveDown,
  };

  const action = keyActions[keyEvent.code];

  if (action) {
    action();
  }
}
