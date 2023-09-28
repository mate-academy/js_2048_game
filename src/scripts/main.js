'use strict';

const score = document.querySelector('.game-score');
let count = 0;
const button = document.querySelector('.button');
let isRestart = false;
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = document.querySelectorAll('.field-cell');
let cellElement;
let cellsChanged = false;
let currentMerge = 0;

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

    // Добавляем класс 'hidden' к сообщению о победе
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
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      matrixValue = matrix[row][col];

      if (matrixValue === 2048) {
        messageWin.classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}

// #endregion

// #region key functions
function moveUp() {
  for (let col = 0; col < numCols; col++) {
    for (let row = 1; row < numRows; row++) {
      const currentValue = matrix[row][col];

      if (currentValue !== 0) {
        let newRow = row - 1;

        while (newRow >= 0 && matrix[newRow][col] === 0) {
          matrix[newRow][col] = currentValue;
          matrix[row][col] = 0;
          row = newRow;
          newRow--;
          cellsChanged = true;
        }

        if (newRow >= 0 && matrix[newRow][col] === currentValue) {
          matrix[newRow][col] *= 2;
          matrix[row][col] = 0;
          cellsChanged = true;

          const mergedValue = currentValue * 2;

          currentMerge += mergedValue;
        }
      }
    }
  }

  count += currentMerge;
  score.innerHTML = count;
  console.log(matrix);

  // console.log(matrix);

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
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
}

function moveDown() {
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

          const mergedValue = currentValue * 2;

          currentMerge += mergedValue;
        }
      }
    }
  }

  count += currentMerge;
  score.innerHTML = count;
  console.log(matrix);

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

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
}

function moveLeft() {
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
          matrix[row][col] = 0;
          cellsChanged = true;

          const mergedValue = currentValue * 2;

          currentMerge += mergedValue;
        }
      }
    }
  }

  count += currentMerge;
  score.innerHTML = count;
  console.log(matrix);

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

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
}

function moveRight() {
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
          matrix[row][col] = 0;
          cellsChanged = true;

          const mergedValue = currentValue * 2;

          currentMerge += mergedValue;
        }
      }
    }
  }

  count += currentMerge;
  score.innerHTML = count;
  console.log(matrix);

  isWinner();

  if (cellsChanged) {
    addRandomCell();
  }
  updateUI();

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
}

// function addRandomCells() {
//   const emptyCells = [];

//   for (let row = 0; row < numRows; row++) {
//     for (let col = 0; col < numCols; col++) {
//       if (matrix[row][col] === 0) {
//         emptyCells.push({ row, col });
//       }
//     }
//   }

//   if (emptyCells.length > 0) {
//     const randomIndices = [];

//     while (randomIndices.length < 2) {
//       const randomIndex = Math.floor(Math.random() * emptyCells.length);

//       randomIndices.push(randomIndex);
//     }

//     for (const index of randomIndices) {
//       const { row, col } = emptyCells[index];

//       matrix[row][col] = 2;
//     }
//   }
// }

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

// function shouldAddOneCell() {
//   let filledCells = 0;

//   for (let row = 0; row < numRows; row++) {
//     for (let col = 0; col < numCols; col++) {
//       if (matrix[row][col] !== 0) {
//         filledCells++;
//       }
//     }
//   }

//   return filledCells >= numRows * numCols * 0.5;
// }
// #endregion

// #region Setting key logic
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
// #endregion
