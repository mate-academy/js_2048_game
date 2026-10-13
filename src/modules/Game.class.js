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

  moveLine(line, reverse) {
    let processedLine = line;

    if (reverse) {
      processedLine = [...line].reverse();
    }

    processedLine = this.removeZeros(processedLine);

    this.mergeLine(processedLine);

    while (processedLine.length < 4) {
      processedLine.push(0);
    }

    if (reverse) {
      processedLine = [...processedLine].reverse();
    }

    return processedLine;
  }

  moveHorizontally(reverse) {
    let moved = false;

    this.state.forEach((row, index) => {
      const processedLine = this.moveLine(row, reverse);

      if (JSON.stringify(row) !== JSON.stringify(processedLine)) {
        moved = true;

        this.state[index] = processedLine;
      }
    });

    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveVertically(reverse) {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const column = this.state.map((row) => row[i]);

      const processedColumn = this.moveLine(column, reverse);

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

  moveLeft() {
    this.moveHorizontally(false);
  }

  moveRight() {
    this.moveHorizontally(true);
  }

  moveUp() {
    this.moveVertically(false);
  }

  moveDown() {
    this.moveVertically(true);
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
