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

  moveLeft() {
    let moved = false;

    this.state.forEach((row, index) => {
      const filteredRow = row.filter((number) => number !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] = filteredRow[i] + filteredRow[i + 1];
          this.score += filteredRow[i];

          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;

        this.state[index] = filteredRow;
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
      const reversedRow = [...row].reverse();

      const filteredRow = reversedRow.filter((number) => number !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] = filteredRow[i] + filteredRow[i + 1];

          this.score += filteredRow[i];

          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      filteredRow.reverse();

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;
      }

      this.state[index] = filteredRow;
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

      const filteredColumn = column.filter((number) => number !== 0);

      for (let j = 0; j < filteredColumn.length - 1; j++) {
        if (filteredColumn[j] === filteredColumn[j + 1]) {
          filteredColumn[j] = filteredColumn[j] + filteredColumn[j + 1];

          this.score = this.score + filteredColumn[j];

          filteredColumn.splice(j + 1, 1);
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.push(0);
      }

      if (JSON.stringify(column) !== JSON.stringify(filteredColumn)) {
        moved = true;
      }

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.state[rowIndex][i] = filteredColumn[rowIndex];
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

      const reversedColumn = [...column].reverse();

      const filteredColumn = reversedColumn.filter((number) => number !== 0);

      for (let j = 0; j < filteredColumn.length - 1; j++) {
        if (filteredColumn[j] === filteredColumn[j + 1]) {
          filteredColumn[j] = filteredColumn[j] + filteredColumn[j + 1];

          this.score = this.score + filteredColumn[j];

          filteredColumn.splice(j + 1, 1);
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.push(0);
      }

      filteredColumn.reverse();

      if (JSON.stringify(column) !== JSON.stringify(filteredColumn)) {
        moved = true;
      }

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.state[rowIndex][i] = filteredColumn[rowIndex];
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
