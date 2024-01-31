'use strict';

const refs = {
  tiles: document.querySelectorAll('.field-cell'),
  startBtn: document.querySelector('.start'),
  gameScore: document.querySelector('.game-score'),
  gameStartMsg: document.querySelector('.message-start'),
  gameOverMsg: document.querySelector('.message-lose'),
  gameWonMsg: document.querySelector('.message-win'),
};

const NUMBER_OF_ROWS = 4;
const NUMBER_OF_CELLS = 4;
const WIN_VALUE = 2048;

refs.startBtn.addEventListener('click', startGame);

function startGame() {
  window.removeEventListener('keyup', moveTiles);
  clearGameField();

  refs.gameStartMsg.classList.add('hidden');
  refs.gameOverMsg.classList.add('hidden');
  refs.gameWonMsg.classList.add('hidden');
  refs.startBtn.classList.remove('start');
  refs.startBtn.classList.add('restart');
  refs.startBtn.textContent = 'Restart';
  refs.gameScore.textContent = 0;

  window.addEventListener('keyup', moveTiles);

  generateRandomTile();
  generateRandomTile();
}

function generateRandomTile() {
  if (!hasEmptyTiles()) {
    return;
  }

  let generated = false;

  while (!generated) {
    const randomTileIndex = Math.floor(Math.random() * refs.tiles.length);

    const tile = refs.tiles[randomTileIndex];

    if (!tile.textContent) {
      const number = Math.random() >= 0.9 ? 4 : 2;

      updateTile(tile, number);
      generated = true;
    }
  }
}

function hasMoves(array) {
  for (let r = 0; r < NUMBER_OF_ROWS - 1; r++) {
    for (let c = 0; c < NUMBER_OF_CELLS - 1; c++) {
      if (array[r][c] === array[r][c + 1]) {
        return true;
      }
    }
  }

  return false;
}

function canMove(array) {
  // can I slide horizontally?
  if (!hasMoves(array)) {
    return false;
  }

  // can I slide vertically?
  const rotatedArray = rotateArray(array);

  if (!hasMoves(rotatedArray)) {
    return false;
  }

  return true;
}

function getFieldValues() {
  let currentCellIndex = 0;
  const values = [];

  for (let r = 0; r < NUMBER_OF_ROWS; r++) {
    if (!values[r]) {
      values[r] = [];
    }

    for (let c = 0; c < NUMBER_OF_CELLS; c++) {
      values[r].push(+refs.tiles[currentCellIndex].textContent || 0);
      currentCellIndex++;
    }
  }

  return values;
}

function updateTile(tile, number) {
  tile.textContent = number || '';
  tile.className = `field-cell field-cell--${number}`;
}

function moveTiles(e) {
  if (
    e.key !== 'ArrowLeft'
    && e.key !== 'ArrowRight'
    && e.key !== 'ArrowUp'
    && e.key !== 'ArrowDown'
  ) {
    return;
  }

  const boardValues = getFieldValues();
  let slideResult;
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      slideResult = slideLeft(boardValues);
      break;

    case 'ArrowRight':
      slideResult = slideRight(boardValues);

      break;

    case 'ArrowUp':
      slideResult = rotateArray(slideLeft(rotateArray(boardValues)));

      break;

    case 'ArrowDown':
      slideResult = rotateArray(slideRight(rotateArray(boardValues)));
      break;
  }

  if (!checkIfEqual(boardValues, slideResult)) {
    moved = true;
    updateTiles(slideResult);
  }

  if (!moved && !hasEmptyTiles() && !canMove(slideResult)) {
    refs.gameOverMsg.classList.remove('hidden');
    window.removeEventListener('keyup', moveTiles);

    return;
  }

  if (moved && isGameWon()) {
    refs.gameWonMsg.classList.remove('hidden');
    window.removeEventListener('keyup', moveTiles);

    return;
  }

  generateRandomTile();
}

function checkIfEqual(original, updated) {
  if (original.length !== updated.length) {
    return false;
  }

  for (let r = 0; r < NUMBER_OF_ROWS; r++) {
    for (let c = 0; c < NUMBER_OF_CELLS; c++) {
      if (original[r][c] !== updated[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function slideLeft(array) {
  const transformedValues = [];

  for (let r = 0; r < NUMBER_OF_ROWS; r++) {
    let row = removeZeroes(array[r]);

    for (let c = 0; c < NUMBER_OF_CELLS - 1; c++) {
      if (row[c] && row[c] === row[c + 1]) {
        row[c] *= 2;
        row[c + 1] = 0;

        refs.gameScore.textContent = +refs.gameScore.textContent + +row[c];
      }
    }
    row = removeZeroes(row);
    row = addZeroes(row);

    transformedValues.push(row);
  }

  return transformedValues;
}

function slideRight(array) {
  const transformedValues = [];

  for (let r = 0; r < NUMBER_OF_ROWS; r++) {
    let row = removeZeroes(array[r]).reverse();

    for (let c = 0; c < NUMBER_OF_CELLS - 1; c++) {
      if (row[c] && row[c] === row[c + 1]) {
        row[c] *= 2;
        row[c + 1] = 0;
        refs.gameScore.textContent = +refs.gameScore.textContent + +row[c];
      }
    }

    row = removeZeroes(row);
    row = addZeroes(row).reverse();

    transformedValues.push(row);
  }

  return transformedValues;
}

function rotateArray(array) {
  const rotadedArray = [];

  for (let c = 0; c < NUMBER_OF_CELLS; c++) {
    for (let r = 0; r < NUMBER_OF_ROWS; r++) {
      if (!rotadedArray[c]) {
        rotadedArray[c] = [];
      }
      rotadedArray[c].push(array[r][c]);
    }
  }

  return rotadedArray;
}

function removeZeroes(array) {
  return array.filter((item) => item && item > 0);
}

function addZeroes(row) {
  for (let c = 0; c < NUMBER_OF_CELLS; c++) {
    if (!row[c]) {
      row.push(0);
    }
  }

  return row;
}

function hasEmptyTiles() {
  return [...refs.tiles].some((tile) => tile.textContent === '');
}

function updateTiles(array) {
  let currentTile = 0;

  for (let r = 0; r < NUMBER_OF_ROWS; r++) {
    for (let c = 0; c < NUMBER_OF_CELLS; c++) {
      updateTile(refs.tiles[currentTile], array[r][c]);
      currentTile++;
    }
  }
}

function clearGameField() {
  [...refs.tiles].forEach((tile) => {
    tile.textContent = '';
    tile.className = 'field-cell';
  });
}

function isGameWon() {
  return [...refs.tiles].some((tile) => +tile.textContent === WIN_VALUE);
}
