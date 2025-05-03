'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();

    if (!initialState) {
      this.spawnTile();
    }
  }

  shift(row) {
    const cleanedRow = [];

    for (const num of row) {
      if (num !== 0) {
        cleanedRow.push(num);
      }
    }

    const finalRow = [];
    let count = 0;

    while (count < cleanedRow.length) {
      if (cleanedRow[count] === cleanedRow[count + 1]) {
        finalRow.push(cleanedRow[count] * 2);
        this.score += cleanedRow[count] * 2;
        count += 2;
      } else {
        finalRow.push(cleanedRow[count]);
        count += 1;
      }
    }

    while (finalRow.length < this.size) {
      finalRow.push(0);
    }

    return finalRow;
  }

  moveLeft() {
    let changed = false;

    for (let count = 0; count < this.board.length; count++) {
      const newRow = this.shift(this.board[count]);

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[count])) {
        changed = true;
      }

      this.board[count] = newRow;
    }

    if (changed) {
      this.spawnTile();
    }

    return changed;
  }

  moveRight() {
    let changed = false;

    for (let count = 0; count < this.board.length; count++) {
      const row = [...this.board[count]].reverse();
      const newRow = this.shift(row).reverse();

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[count])) {
        changed = true;
      }

      this.board[count] = newRow;
    }

    if (changed) {
      this.spawnTile();
    }

    return changed;
  }

  moveUp() {
    let changed = false;

    for (let colIndex = 0; colIndex < this.size; colIndex++) {
      const workingColumn = [];

      for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
        workingColumn.push(this.board[rowIndex][colIndex]);
      }

      const newColumn = this.shift(workingColumn);

      if (JSON.stringify(newColumn) !== JSON.stringify(workingColumn)) {
        changed = true;
      }

      for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
        this.board[rowIndex][colIndex] = newColumn[rowIndex];
      }
    }

    if (changed) {
      this.spawnTile();
    }

    return changed;
  }

  moveDown() {
    let changed = false;

    for (let colIndex = 0; colIndex < this.size; colIndex++) {
      const workingColumn = [];

      for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
        workingColumn.push(this.board[rowIndex][colIndex]);
      }

      workingColumn.reverse();

      const newColumn = this.shift(workingColumn).reverse();

      if (
        JSON.stringify(newColumn) !== JSON.stringify(workingColumn.reverse())
      ) {
        changed = true;
      }

      for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
        this.board[rowIndex][colIndex] = newColumn[rowIndex];
      }
    }

    if (changed) {
      this.spawnTile();
    }

    return changed;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  canMakeMove() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.board[row][column] === this.board[row][column + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < this.size - 1; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.board[row][column] === this.board[row + 1][column]) {
          return true;
        }
      }
    }

    return false;
  }

  getStatus() {
    if (this.status !== 'playing') {
      return this.status;
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMakeMove()) {
      this.status = 'lose';
    }

    return this.status;
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  spawnTile() {
    const emptyCells = [];

    const newCellValue = Math.random() > 0.9 ? 4 : 2;

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.board[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = newCellValue;
  }

  /**
   * Starts the game.
   */
  start() {
    // this.restart();
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.spawnTile();
    this.spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.spawnTile();
  }

  // Add your own methods here
}

module.exports = Game;
