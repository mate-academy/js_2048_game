'use strict';

class Game {
  constructor(initialState) {
    const state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = state.map((row) => [...row]);

    this.state = this.initialState.map((row) => [...row]);

    this.score = 0;

    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  removeZeros(row) {
    return row.filter((number) => number !== 0);
  }

  mergeLine(line) {
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] = line[i] + line[i + 1];
        this.score += line[i];

        line.splice(i + 1, 1);
      }
    }
  }

  moveRow(row, reverse) {
    let processedRow = row;

    if (reverse) {
      processedRow = [...row].reverse();
    }

    processedRow = this.removeZeros(processedRow);

    this.mergeLine(processedRow);

    while (processedRow.length < 4) {
      processedRow.push(0);
    }

    if (reverse) {
      processedRow = [...processedRow].reverse();
    }

    return processedRow;
  }

  moveColumn(column, reverse) {
    let processedColumn = column;

    if (reverse) {
      processedColumn = [...column].reverse();
    }

    processedColumn = this.removeZeros(processedColumn);

    this.mergeLine(processedColumn);

    while (processedColumn.length < 4) {
      processedColumn.push(0);
    }

    if (reverse) {
      processedColumn = [...processedColumn].reverse();
    }

    return processedColumn;
  }

  moveLeft() {
    let moved = false;

    this.state.forEach((row, index) => {
      const processedRow = this.moveRow(row, false);

      if (JSON.stringify(row) !== JSON.stringify(processedRow)) {
        moved = true;

        this.state[index] = processedRow;
      }
    });

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    let moved = false;

    this.state.forEach((row, index) => {
      const processedRow = this.moveRow(row, true);

      if (JSON.stringify(row) !== JSON.stringify(processedRow)) {
        moved = true;

        this.state[index] = processedRow;
      }
    });

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveUp() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const column = this.state.map((row) => row[i]);

      const processedColumn = this.moveColumn(column, false);

      if (JSON.stringify(column) !== JSON.stringify(processedColumn)) {
        moved = true;

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          this.state[rowIndex][i] = processedColumn[rowIndex];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveDown() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const column = this.state.map((row) => row[i]);

      const processedColumn = this.moveColumn(column, true);

      if (JSON.stringify(column) !== JSON.stringify(processedColumn)) {
        moved = true;

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          this.state[rowIndex][i] = processedColumn[rowIndex];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === 0) {
          emptyCells.push({
            row: rowIndex,
            column: columnIndex,
          });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      this.state[randomCell.row][randomCell.column] = randomValue;
    }
  }

  checkStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.some((row) => row.includes(0));

    if (!hasEmptyCell) {
      let canMerge = false;

      this.state.forEach((row) => {
        for (let i = 0; i < row.length - 1; i++) {
          if (row[i] === row[i + 1]) {
            canMerge = true;
          }
        }
      });

      for (let rowIndex = 0; rowIndex < this.state.length - 1; rowIndex++) {
        for (
          let columnIndex = 0;
          columnIndex < this.state[rowIndex].length;
          columnIndex++
        ) {
          if (
            this.state[rowIndex][columnIndex] ===
            this.state[rowIndex + 1][columnIndex]
          ) {
            canMerge = true;
          }
        }
      }

      if (!canMerge) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
