'use strict';

const refs = {
  tiles: document.querySelectorAll('.field-cell'),
  startBtn: document.querySelector('start'),
  gameScore: document.querySelector('.game-score'),
};

const NUMBER_OF_ROWS = 4;
const NUMBER_OF_CELLS = 4;

function generateRandomTile() {
  const hasEmptyTiles = checkEmptyTiles();

  if (!hasEmptyTiles) {
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

generateRandomTile();
generateRandomTile();
getFieldValues();

window.addEventListener('keyup', (e) => {
  const boardValues = getFieldValues();

  if (e.key === 'ArrowLeft') {
    const updatedValues = slideLeft(boardValues);

    updateTiles(updatedValues);
    generateRandomTile();

    return;
  }

  if (e.key === 'ArrowRight') {
    const updatedValues = slideRight(boardValues);

    updateTiles(updatedValues);
    generateRandomTile();

    return;
  }

  if (e.key === 'ArrowUp') {
    let rotatedArray = rotateArray(boardValues);

    const transformedValues = slideLeft(rotatedArray);

    rotatedArray = rotateArray(transformedValues);
    updateTiles(rotatedArray);
    generateRandomTile();

    return;
  }

  if (e.key === 'ArrowDown') {
    let rotatedArray = rotateArray(boardValues);

    const transformedValues = slideRight(rotatedArray);

    rotatedArray = rotateArray(transformedValues);
    updateTiles(rotatedArray);
    generateRandomTile();
  }
});

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

function checkEmptyTiles() {
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
