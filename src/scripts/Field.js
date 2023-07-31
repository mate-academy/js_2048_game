'use strict';

const Cell = require('./Cell');

class Field {
  constructor(element) {
    this.cells = [];

    const rows = element.querySelectorAll('.field-row');

    rows.forEach((row) => {
      const cellElements = row.querySelectorAll('.field-cell');
      const rowCells = [...cellElements].map((cell) => new Cell(cell));

      this.cells.push(rowCells);
    });
  }

  getMaxValue() {
    return this.cells.reduce((maxValue, row) => {
      const rowMaxValue = row.reduce((rowMax, cell) => {
        return Math.max(rowMax, cell.value);
      }, 0);

      return Math.max(maxValue, rowMaxValue);
    }, 0);
  }

  hasAvailableMoves() {
    let hasEmptyCell = false;

    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const isEmpty = cell.isEmpty;
        const isValueAboveSame = rowIndex > 0
          && this.cells[rowIndex - 1][columnIndex].value === cell.value;
        const isValueToLeftSame = columnIndex > 0
          && this.cells[rowIndex][columnIndex - 1].value === cell.value;

        if (isEmpty || isValueAboveSame || isValueToLeftSame) {
          hasEmptyCell = true;
        }
      });
    });

    return hasEmptyCell;
  }

  mergeCells(cells) {
    let score = 0;
    let currentIndex = 0;

    cells.forEach((cell, i) => {
      if (!cell.isEmpty) {
        cells[currentIndex].setValue(cell.value);

        if (currentIndex !== i) {
          cell.clear();
        }
        currentIndex++;
      }
    });

    for (let i = 0; i < cells.length - 1; i++) {
      if (!cells[i].isEmpty && cells[i].value === cells[i + 1].value) {
        const mergedValue = cells[i].value * 2;

        cells[i].setValue(mergedValue);
        cells[i + 1].clear();
        score += mergedValue;
        i++;
      }
    }

    currentIndex = 0;

    cells.forEach((cell, i) => {
      if (!cell.isEmpty) {
        cells[currentIndex].setValue(cell.value);

        if (currentIndex !== i) {
          cell.clear();
        }
        currentIndex++;
      }
    });

    return score;
  }

  shiftLeft() {
    let totalScore = 0;

    this.cells.forEach((row) => {
      totalScore += this.mergeCells(row);
    });

    return totalScore;
  }

  shiftRight() {
    let totalScore = 0;

    this.cells.forEach((row) => {
      const reversedRow = row.slice().reverse();

      totalScore += this.mergeCells(reversedRow);
    });

    return totalScore;
  }

  shiftUp() {
    let totalScore = 0;

    const transposedCells = this.transposeCells();

    transposedCells.forEach((row) => {
      totalScore += this.mergeCells(row);
    });

    return totalScore;
  }

  shiftDown() {
    let totalScore = 0;

    const transposedCells = this.transposeCells();

    transposedCells.forEach((row) => {
      const reversedRow = row.slice().reverse();

      totalScore += this.mergeCells(reversedRow);
    });

    return totalScore;
  }

  transposeCells() {
    const transposedCells = [];

    for (let column = 0; column < this.cells[0].length; column++) {
      transposedCells.push(this.cells.map((row) => row[column]));
    }

    return transposedCells;
  }

  addTile(value) {
    const emptyCells = [];

    this.cells.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell.isEmpty) {
          emptyCells.push({
            row: rowIndex,
            column: columnIndex,
          });
        }
      });
    });

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    this.cells[randomCell.row][randomCell.column].setValue(value);

    return true;
  }

  reset() {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        cell.clear();
      });
    });
  }
}

module.exports = Field;
