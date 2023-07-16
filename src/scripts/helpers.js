export const getRandomIndex = (gridSize) =>
  Math.floor(Math.random() * gridSize);

export const getSelectedAxis = (array, y) =>
  array.reduce(
    (acc, curr, i) => {
      acc[Math.floor(y ? i % acc.length : i / acc.length)].push(curr);

      return acc;
    },
    [[], [], [], []]
  );

export const getColumns = (cells) => {
  return getSelectedAxis([...cells], true);
};

export const getRows = (cells) => {
  return getSelectedAxis([...cells]);
};

export const getTotalPoints = (cells) =>
  [...cells].reduce(
    (acc, curr) => (+curr.textContent > 2 ? acc + +curr.textContent : acc + 0),
    0
  );

export const isCellsEqual = (currentCells, newCells) =>
  [...currentCells].some((cell, i) => !cell.isEqualNode(newCells.flat()[i]));

export const hasEmptyCell = (cells) =>
  [...cells].some((cell) => cell.textContent === "");

const isMergePossible = (cells) => {
  const rowsAndColumns = [...getRows(cells), ...getColumns(cells)];

  for (const subArr of rowsAndColumns) {
    for (let i = 0; i < subArr.length; i++) {
      if (subArr[i].isEqualNode(subArr[i + 1])) {
        return true;
      }
    }
  }
};

export const isGameOver = (cells) => {
  if (!hasEmptyCell(cells)) {
    return !isMergePossible(cells);
  }

  return false;
};

export const isWin = (cells) =>
  [...cells].some((cell) => +cell.textContent === 2048);
