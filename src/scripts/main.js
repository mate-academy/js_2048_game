'use strict';

'use strict';

const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const allCells = [...document.querySelectorAll('.field-cell')];
const gridRows = [...document.querySelectorAll('.field-row')].map((row) => [
  ...row.children,
]);

function startGame() {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  startMessage.classList.add('hidden');

  clearField();
  spawnNewCell();
  spawnNewCell();
}

function spawnNewCell() {
  const emptyCells = allCells.filter((cell) => cell.classList.length === 1);

  if (emptyCells.length === 0) {
    return;
  }

  const index = getRandomIntInclusive(0, emptyCells.length - 1);
  const cellValue = getNewValue();

  updateCell(emptyCells[index], cellValue);
}

function updateCell(cell, value) {
  cell.className = `field-cell field-cell--${value}`;
  cell.dataset.value = value;
  cell.textContent = value;
}

function resetCell(cell) {
  cell.className = 'field-cell';
  cell.dataset.value = '0';
  cell.textContent = '';
}

function clearField() {
  allCells.forEach((cell) => {
    resetCell(cell);
  });
}

function getRandomIntInclusive(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewValue() {
  const random = Math.random();

  return random >= 0.9 ? '4' : '2';
}

function transpose(grid) {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));
}

function mergeRow(row) {
  const nonZeroRow = row.filter((cell) => cell.dataset.value !== '0');
  const mergedRow = [];

  for (let i = 0; i < nonZeroRow.length; i++) {
    const currentValue = Number(nonZeroRow[i].dataset.value);

    if (
      i < nonZeroRow.length - 1 &&
      nonZeroRow[i].dataset.value === nonZeroRow[i + 1].dataset.value
    ) {
      mergedRow.push(currentValue * 2);
      nonZeroRow[i + 1].dataset.value = '0';
      i++;
    } else {
      mergedRow.push(currentValue);
    }
  }

  return mergedRow;
}

function moveRowLeft(cellsInRow) {
  const mergedRow = mergeRow(cellsInRow);

  for (let i = 0; i < cellsInRow.length; i++) {
    const newValue = mergedRow[i];

    if (newValue) {
      updateCell(cellsInRow[i], newValue);
    } else {
      resetCell(cellsInRow[i]);
    }
  }
}

function moveRowRight(cellsInRow) {
  const mergedRow = mergeRow(cellsInRow);

  let j = mergedRow.length - 1;

  for (let i = cellsInRow.length - 1; i >= 0; i--) {
    if (j >= 0) {
      const newValue = mergedRow[j];

      updateCell(cellsInRow[i], newValue);
      j--;
    } else {
      resetCell(cellsInRow[i]);
    }
  }
}

function shiftUp(grid) {
  const transposedGrid = transpose(grid);

  transposedGrid.forEach((row) => moveRowLeft(row));

  return transpose(transposedGrid);
}

function shiftDown(grid) {
  const transposedGrid = transpose(grid);

  transposedGrid.forEach((row) => moveRowRight(row));

  return transpose(transposedGrid);
}

startButton.onclick = () => {
  startGame();
};

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      shiftUp(gridRows);
      spawnNewCell();
      break;

    case 'ArrowDown':
      shiftDown(gridRows);
      spawnNewCell();
      break;

    case 'ArrowRight':
      gridRows.forEach((row) => moveRowRight(row));
      spawnNewCell();
      break;

    case 'ArrowLeft':
      gridRows.forEach((row) => moveRowLeft(row));
      spawnNewCell();
      break;

    default:
      break;
  }
});
