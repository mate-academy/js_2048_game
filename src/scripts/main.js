'use strict';

const cellsAll = document.querySelectorAll('.game-field .field-cell');

let gameScore = 0;
const gameScoreDisplay = document.querySelector('.game-score');
let gameOver = false;

const applyCellStyles = (cell) => {
  const value = cell.textContent;

  cell.className = 'field-cell';

  if (value) {
    cell.classList.add(`field-cell--${value}`);
  }
};

const randomizer = () => {
  const emptyCells = fillEmptyCell();

  if (emptyCells.length === 0) {
    return;
  };

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const random = Math.random();

  randomCell.textContent = random < 0.9 ? '2' : '4';
};

// Find all empty cells in the grid
const fillEmptyCell = () => {
  const emptyCells = [];

  cellsAll.forEach(cell => {
    if (cell.textContent.trim() === '') {
      emptyCells.push(cell);
    }
  });

  return emptyCells;
};

// Slide and merge the row of cells
const slideAndMerge = (row) => {
  // Filter out empty values, shift values to left, and pad with empty strings
  const result
    = row.filter(val => val !== '').concat(Array(4 - row.length).fill(''));

  for (let i = 0; i < result.length - 1; i++) {
    if (result[i] !== '' && result[i] === result[i + 1]) {
      result[i] = (parseInt(result[i]) * 2).toString();
      result[i + 1] = '';
      gameScore += parseInt(result[i]);
      gameScoreDisplay.textContent = gameScore;
      i++;
    }
  }

  // Filter again and add empty strings to the end for completed row
  return result.filter(val => val !== '')
    .concat(Array(4 - result.filter(val => val !== '').length).fill(''));
};

// Move the cells in a specified direction and merge them
const moveCells = (direction) => {
  const cellsFilled = Array.from(cellsAll).map(cell => cell.textContent.trim());
  let moved = false;

  const updateCells = (startIndex, increment, reverse = false) => {
    let row = [];

    for (let i = 0; i < 4; i++) {
      row.push(cellsFilled[startIndex + i * increment]);
    };

    // Reverse row for right/down movements
    if (reverse) {
      row = row.reverse();
    };

    const movedRow = slideAndMerge(row);

    if (reverse) {
      movedRow.reverse();
    };

    // Update the original array with the moved row
    for (let i = 0; i < 4; i++) {
      if (cellsFilled[startIndex + i * increment] !== movedRow[i]) {
        moved = true;
      };
      cellsFilled[startIndex + i * increment] = movedRow[i];
    }
  };

  // Update based on direction
  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < 4; i++) {
      const startIndex = i * 4;

      updateCells(startIndex, 1, direction === 'right');
    }
  } else if (direction === 'up' || direction === 'down') {
    for (let i = 0; i < 4; i++) {
      updateCells(i, 4, direction === 'down');
    }
  }

  // Update cells with new values
  cellsAll.forEach((cell, idx) => {
    cell.textContent = cellsFilled[idx] || '';
    applyCellStyles(cell);

    if (cell.textContent === '2048') {
      document.querySelector('.message-win').classList.remove('hidden');
    }
  });

  // Trigger new random tile if a move happened
  if (moved) {
    randomizer();
  };
};

// Check if the game is over (no more moves or empty cells)
const checkGameOver = () => {
  if (fillEmptyCell().length > 0) {
    return false;
  };

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      // Check rows for possible merges
      if (cellsAll[i * 4 + j]
        .textContent === cellsAll[i * 4 + j + 1].textContent) {
        return false;
      };

      // Check columns for possible merges
      if (cellsAll[j * 4 + i]
        .textContent === cellsAll[(j + 1) * 4 + i].textContent) {
        return false;
      };
    }
  }

  return true;
};

// Reset the game
const resetGame = () => {
  cellsAll.forEach(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });
  gameScore = 0;
  gameScoreDisplay.textContent = gameScore;
  gameOver = false;
  randomizer();
  randomizer();

  const button = document.querySelector('button');

  button.textContent = 'Reset';
  button.classList.remove('start');
  button.classList.add('restart');

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
};

// Handle arrow key movements
// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (gameOver) {
    return;
  };

  if (event.key === 'ArrowRight') {
    moveCells('right');
  } else if (event.key === 'ArrowLeft') {
    moveCells('left');
  } else if (event.key === 'ArrowUp') {
    moveCells('up');
  } else if (event.key === 'ArrowDown') {
    moveCells('down');
  }

  // Check if the game is over after each move
  if (checkGameOver()) {
    gameOver = true;
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

// Restart the game when the start button is clicked
document.querySelector('.start').addEventListener('click', resetGame);
