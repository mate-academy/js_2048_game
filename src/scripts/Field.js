'use strict';

const Cell = require('./Cell');

class Field {
  constructor(element) {
    this.cells = [];

    const rows = element.querySelectorAll('.field-row');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].querySelectorAll('.field-cell');

      this.cells.push([...row].map((cell) => new Cell(cell)));
    }
  }

  getMaxValue() {
    let maxValue = 0;

    for (let row = 0; row < this.cells.length; row++) {
      for (let column = 0; column < this.cells[row].length; column++) {
        const cellValue = this.cells[row][column].value;

        if (cellValue > maxValue) {
          maxValue = cellValue;
        }
      }
    }

    return maxValue;
  }

  hasAvailableMoves() {
    for (let row = 0; row < this.cells.length; row++) {
      for (let column = 0; column < this.cells[row].length; column++) {
        const cell = this.cells[row][column];

        if (cell.isEmpty) {
          return true;
        }

        if (
          (row > 0 && this.cells[row - 1][column].value === cell.value)
          || (column > 0 && this.cells[row][column - 1].value === cell.value)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  mergeCells(cells) {
    let score = 0;

    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        if (!cells[i].isEmpty && cells[i].value === cells[j].value) {
          score += cells[i].value * 2;
          cells[i].setValue(cells[i].value * 2);
          cells[j].clear();
        } else if (cells[i].isEmpty && !cells[j].isEmpty) {
          cells[i].setValue(cells[j].value);
          cells[j].clear();
        }
      }
    }

    return score;
  }

  shiftLeft() {
    let totalScore = 0;

    for (let row = 0; row < this.cells.length; row++) {
      totalScore += this.mergeCells(this.cells[row]);
    }

    return totalScore;
  }

  shiftRight() {
    let totalScore = 0;

    for (let row = 0; row < this.cells.length; row++) {
      const reversedRow = this.cells[row].slice().reverse();

      totalScore += this.mergeCells(reversedRow);
    }

    return totalScore;
  }

  shiftUp() {
    let totalScore = 0;

    for (let column = 0; column < this.cells[0].length; column++) {
      const columnCells = this.cells.map((row) => row[column]);

      totalScore += this.mergeCells(columnCells);
    }

    return totalScore;
  }

  shiftDown() {
    let totalScore = 0;

    for (let column = 0; column < this.cells[0].length; column++) {
      const columnCells = this.cells.map((row) => row[column]).reverse();

      totalScore += this.mergeCells(columnCells);
    }

    return totalScore;
  }

  addTile(value) {
    const emptyCells = [];

    for (let row = 0; row < this.cells.length; row++) {
      for (let column = 0; column < this.cells[row].length; column++) {
        if (this.cells[row][column].isEmpty) {
          emptyCells.push({
            row, column,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    this.cells[randomCell.row][randomCell.column].setValue(value);

    return true;
  }

  reset() {
    for (let column = 0; column < this.cells.length; column++) {
      for (let row = 0; row < this.cells.length; row++) {
        this.cells[row][column].clear();
      }
    }
  }
}

module.exports = Field;
