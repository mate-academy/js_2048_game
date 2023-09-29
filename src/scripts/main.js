'use strict';

const score = document.querySelector('.game-score');
let count = 0;
const button = document.querySelector('.button');
let isRestart = false;
let gameOver = false;
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = document.querySelectorAll('.field-cell');
let cellElement;
let cellsChanged = false;

// #region Creating matrix with all fields
const fieldCells
= Array.from(document.querySelectorAll('.field-row .field-cell'));
const numRows = 4;
const numCols = 4;

const matrix = [];
let matrixValue;

for (let row = 0; row < numRows; row++) {
  matrix[row] = [];

  for (let col = 0; col < numCols; col++) {
    matrix[row][col] = 0;
  }
}
// console.log(matrix);
// #endregion

// #region Setting Start and GameOver and Winner functions
function start() {
  const randomIndices = [];

  button.classList.toggle('restart');
  messageStart.classList.toggle('hidden');

  if (!isRestart) {
    button.innerHTML = 'Restart';
    button.style.fontSize = '18px';
    messageWin.classList.add('hidden');

    let numEmptyCells = 0;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (matrix[row][col] === 0) {
          numEmptyCells++;
        }
      }
    }

    if (numEmptyCells >= 2) {
      while (randomIndices.length < 2) {
        const randomIndex = Math.floor(Math.random() * numRows * numCols);

        if (randomIndices.indexOf(randomIndex) === -1) {
          randomIndices.push(randomIndex);
        }
      }

      for (const randomIndex of randomIndices) {
        const row = Math.floor(randomIndex / numCols);
        const col = randomIndex % numCols;

        matrix[row][col] = 2;

        matrixValue = matrix[row][col];

        cellElement = fieldCell[row * numCols + col];

        cellElement.classList.add(`field-cell--${matrixValue}`);
      }
    }
    // console.log(matrix);
  } else {
    button.innerHTML = 'Start';
    button.style.fontSize = '20px';
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        matrix[row][col] = 0;

        cellElement = fieldCell[row * numCols + col];

        cellElement.classList.remove('field-cell--2',
          'field-cell--4',
          'field-cell--8',
          'field-cell--16',
          'field-cell--32',
          'field-cell--64',
          'field-cell--128',
          'field-cell--256',
          'field-cell--512',
          'field-cell--1024',
          'field-cell--2048'
        );
      }
    }
  }

  isRestart = !isRestart;
  count = 0;
  score.innerHTML = count;
}

button.addEventListener('click', start);

function isGameOver() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const currentValue = matrix[row][col];

      if (currentValue === 0) {
        return false;
      }

      if (
        (row < numRows - 1 && matrix[row + 1][col] === currentValue)
        || (col < numCols - 1 && matrix[row][col + 1] === currentValue)
      ) {
        return false;
      }
    }
  }

  return true;
}

function isWinner() {
  const has2048Cell = document.querySelector('.field-cell--2048');

  if (has2048Cell) {
    messageWin.classList.remove('hidden');
    gameOver = true;
  }

  return gameOver;
}

// #endregion

// #region key functions
function moveUp() {
  let currentMerge = 0;
  const animatedCells = [];

  if (gameOver) {
    return;
  }

  if (isWinner()) {
    return;
  }

  for (let col = 0; col < numCols; col++) {
    for (let row = 1; row < numRows; row++) {
      const currentValue = matrix[row][col];

      if (currentValue !== 0) {
        let newRow = row - 1;

        while (newRow >= 0 && (matrix[newRow][col] === 0 || matrix[newRow][col] === currentValue)) {
          if (matrix[newRow][col] === currentValue) {
            matrix[newRow][col] *= 2;
            matrix[row][col] = 0;
            cellsChanged = true;

            const mergedValue = matrix[newRow][col];

            currentMerge += mergedValue;
          } else {
            matrix[newRow][col] = currentValue;
            matrix[row][col] = 0;
            cellsChanged = true;
          }

          row = newRow;
          newRow--;

          animatedCells.push({ row, col });
        }
      }
    }
  }

  score.innerHTML = Number(score.innerHTML) + currentMerge;

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }

  updateUI();

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
    gameOver = true;
  }
}

function moveDown() {
  let currentMerge = 0;

  if (gameOver) {
    return;
  }

  for (let col = 0; col < numCols; col++) {
    for (let row = numRows - 2; row >= 0; row--) {
      const currentValue = matrix[row][col];

      if (currentValue !== 0) {
        let newRow = row + 1;

        while (newRow < numRows && matrix[newRow][col] === 0) {
          matrix[newRow][col] = currentValue;
          matrix[row][col] = 0;
          row = newRow;
          newRow++;
          cellsChanged = true;
        }

        if (newRow < numRows && matrix[newRow][col] === currentValue) {
          matrix[newRow][col] *= 2;
          matrix[row][col] = 0;
          cellsChanged = true;

          const mergedValue = matrix[newRow][col];

          currentMerge += mergedValue;
        }
      }
    }
  }
  score.innerHTML = Number(score.innerHTML) + currentMerge;
  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
    gameOver = true;
  }
}

function moveLeft() {
  let currentMerge = 0;

  for (let row = 0; row < numRows; row++) {
    for (let col = 1; col < numCols; col++) {
      const currentValue = matrix[row][col];

      if (currentValue !== 0) {
        let newCol = col - 1;

        while (newCol >= 0 && matrix[row][newCol] === 0) {
          matrix[row][newCol] = currentValue;
          matrix[row][col] = 0;
          col = newCol;
          newCol--;
          cellsChanged = true;
        }

        if (newCol >= 0 && matrix[row][newCol] === currentValue) {
          matrix[row][newCol] *= 2;

          const mergedValue = matrix[row][newCol];

          matrix[row][col] = 0;
          cellsChanged = true;

          currentMerge += mergedValue;
        }
      }
    }
  }
  score.innerHTML = Number(score.innerHTML) + currentMerge;

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
    gameOver = true;
  }
}

function moveRight() {
  let currentMerge = 0;

  if (gameOver) {
    return;
  }

  for (let row = 0; row < numRows; row++) {
    for (let col = numCols - 2; col >= 0; col--) {
      const currentValue = matrix[row][col];

      if (currentValue !== 0) {
        let newCol = col + 1;

        while (newCol < numCols && matrix[row][newCol] === 0) {
          matrix[row][newCol] = currentValue;
          matrix[row][col] = 0;
          col = newCol;
          newCol++;
          cellsChanged = true;
        }

        if (newCol < numCols && matrix[row][newCol] === currentValue) {
          matrix[row][newCol] *= 2;

          const mergedValue = matrix[row][newCol];

          matrix[row][col] = 0;
          cellsChanged = true;

          currentMerge += mergedValue;
        }
      }
    }
  }
  score.innerHTML = Number(score.innerHTML) + currentMerge;
  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
    gameOver = true;
  }
}

function addRandomCell() {
  const emptyCells = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (matrix[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    matrix[row][col] = 2;
  }
}

function updateUI() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      cellElement = fieldCells[row * numCols + col];
      matrixValue = matrix[row][col];

      cellElement.classList.remove('field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024'
      );

      if (matrixValue > 0) {
        cellElement.classList.add(`field-cell--${matrixValue}`);
      }
    }
  }
}

// #endregion

// #region Setting key logic
let touchStartX, touchStartY, touchEndX, touchEndY;

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && isRestart) {
    event.preventDefault();
    moveUp();
  } else if (event.key === 'ArrowDown' && isRestart) {
    event.preventDefault();
    moveDown();
  } else if (event.key === 'ArrowLeft' && isRestart) {
    event.preventDefault();
    moveLeft();
  } else if (event.key === 'ArrowRight' && isRestart) {
    event.preventDefault();
    moveRight();
  }
});

document.addEventListener('touchstart', function(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
});

document.addEventListener('touchend', function(event) {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && isRestart) {
      moveRight();
    } else if (deltaX < 0 && isRestart) {
      moveLeft();
    }
  } else {
    if (deltaY > 0 && isRestart) {
      moveDown();
    } else if (deltaY < 0 && isRestart) {
      moveUp();
    }
  }
});
// #endregion
