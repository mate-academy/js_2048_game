import {
  getSelectedAxis,
  checkCellsEqual,
  getColumns,
  getRows,
} from './helpers';
import {
  createEmptyCell,
  fillCell,
  updateBoard,
  GRID_SIZE,
} from './domFunctions';
import { cells } from './main';

const mergeCells = (cellsArray) => {
  const mergedCells = [];

  for (let i = 0; i < cellsArray.length;) {
    const currCell = cellsArray[i];
    const nextCell = cellsArray[i + 1];

    if (nextCell && currCell.isEqualNode(nextCell)) {
      fillCell(currCell, +currCell.textContent * 2);
      i++;
    }
    i++;

    mergedCells.push(currCell);
  }

  return mergedCells;
};

const getNewCells = (cellsGroup, reversed) =>
  cellsGroup.map((group) => {
    const cleanedCellsGroup = group.filter((cell) => cell.textContent && cell);
    const mergedCellsGroup = mergeCells(cleanedCellsGroup);

    const emptyCellsGroup = Array.from(
      { length: GRID_SIZE - mergedCellsGroup.length },
      () => createEmptyCell()
    );

    if (reversed) {
      return emptyCellsGroup.concat(mergedCellsGroup);
    }

    return mergedCellsGroup.concat(emptyCellsGroup);
  });

const slideCellsHorizontal = (cellsGroup, reversed) => {
  const newRowCells = getNewCells(cellsGroup, reversed);

  if (checkCellsEqual(cells, newRowCells)) {
    updateBoard(newRowCells);
  }
};

const slideCellsVertical = (cellsGroup, reversed) => {
  const newColumnCells = getNewCells(cellsGroup, reversed);
  const newColumnCellsToRow = getSelectedAxis(newColumnCells.flat(), true);

  if (checkCellsEqual(cells, newColumnCellsToRow)) {
    updateBoard(newColumnCellsToRow);
  }
};

export const moveUp = () => {
  slideCellsVertical(getColumns(cells));
};

export const moveDown = () => {
  slideCellsVertical(getColumns(cells), true);
};

export const moveLeft = () => {
  slideCellsHorizontal(getRows(cells));
};

export const moveRight = () => {
  slideCellsHorizontal(getRows(cells), true);
};
