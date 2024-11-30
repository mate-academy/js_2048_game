/* eslint-disable no-shadow */
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

  if (random < 0.9) {
    randomCell.textContent = '2';
    randomCell.classList.add(`field-cell--2`);
  } else {
    randomCell.textContent = '4';
    randomCell.classList.add(`field-cell--4`);
  }

  randomCell.classList.add(`animate`);

  setTimeout(() => {
    randomCell.classList.remove('animate');
  }, 200);
};

const fillEmptyCell = () =>
  Array.from(cellsAll).filter(cell => !cell.textContent.trim());

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

  if (moved) {
    randomizer();
  };
};

const checkGameOver = () => {
  if (fillEmptyCell().length > 0) {
    return false;
  };

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (cellsAll[i * 4 + j]
        .textContent === cellsAll[i * 4 + j + 1].textContent) {
        return false;
      };

      if (cellsAll[j * 4 + i]
        .textContent === cellsAll[(j + 1) * 4 + i].textContent) {
        return false;
      };
    }
  }

  return true;
};

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

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
};

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

  if (checkGameOver()) {
    gameOver = true;
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

document.querySelector('.start').addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', () => {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const element = document.querySelector('.game-field');

  element.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
  });

  element.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];

    endX = touch.clientX;
    endY = touch.clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        moveCells('right');
      } else if (deltaX < -50) {
        moveCells('left');
      }
    } else {
      if (deltaY > 50) {
        moveCells('down');
      } else if (deltaY < -50) {
        moveCells('up');
      }
    }
  });
});
