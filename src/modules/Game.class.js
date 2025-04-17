'use strict';
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    this.board.forEach((el, index) => {
      const notZeros = el.filter((num) => num !== 0);

      for (let i = 0; i < notZeros.length - 1; i++) {
        if (notZeros[i] === notZeros[i + 1]) {
          notZeros[i] *= 2;
          notZeros[i + 1] = 0;
          this.score += notZeros[i];
        }
      }

      const merged = notZeros.filter((num) => num !== 0);

      while (merged.length < el.length) {
        merged.push(0);
      }

      this.board[index] = [...merged];
    });
  }

  moveRight() {
    this.board.forEach((el, index) => {
      const notZeros = el.filter((num) => num !== 0);

      for (let i = 0; i < notZeros.length - 1; i++) {
        if (notZeros[i] === notZeros[i + 1]) {
          notZeros[i] *= 2;
          notZeros[i + 1] = 0;
          this.score += notZeros[i];
        }
      }

      const merged = notZeros.filter((num) => num !== 0);

      while (merged.length < el.length) {
        merged.unshift(0);
      }

      this.board[index] = [...merged];
    });
  }

  moveUp() {
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
        }
      }

      const newColumn = column.filter((num) => num !== 0);

      while (newColumn.length < this.size) {
        newColumn.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = newColumn[row];
      }
    }
  }

  moveDown() {
    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      for (let i = column.length - 1; i >= 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i];
        }
      }

      const newColumn = column.filter((num) => num !== 0);

      while (newColumn.length < this.size) {
        newColumn.unshift(0);
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = newColumn[row];
      }
    }
  }

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
    this.status = 'playing';
    this.score = 0;
  }

  createRandomTile() {
    const numbersToAdd = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    let randomRow, randomCell;

    do {
      randomRow = Math.floor(Math.random() * this.size);
      randomCell = Math.floor(Math.random() * this.size);
    } while (this.board[randomRow][randomCell] !== 0);

    this.board[randomRow][randomCell] =
      numbersToAdd[Math.floor(Math.random() * numbersToAdd.length)];

    this.printTiles(numbersToAdd);
  }

  printTiles() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / this.size);
      const col = index % this.size;
      const value = this.board[row][col];

      cell.className = 'field-cell';
      cell.textContent = value !== 0 ? value : '';
      cell.classList.add(`field-cell--${cell.textContent}`);
    });
  }

  winGame() {
    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  loseGame() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
