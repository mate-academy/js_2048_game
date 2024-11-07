'use strict';

class Game {
  /**
   * Створює новий екземпляр гри 2048.
   * @param {number[][]} initialValue - Початковий стан поля (4x4 матриця).
   * Якщо не задано, поле ініціалізується порожнім.
   */
  constructor(initialValue) {
    this.board = initialValue || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.previousState = JSON.parse(JSON.stringify(this.board));
    this.isNewTileGenerated = false;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((value) => value !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow[col + 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (
        !moved &&
        !this.board[row].every((value, index) => value === newRow[index])
      ) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.generateTile();
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          column.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          moved = true;
        }
      }

      column = column.filter((value) => value !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== column[row]) {
          moved = true;
        }
        this.board[row][col] = column[row];
      }
    }

    if (moved) {
      this.generateTile();
    }

    return moved;
  }

  moveDown() {
    this.#reverseColumns();

    const moved = this.moveUp();

    this.#reverseColumns();

    return moved;
  }

  #reverseColumns() {
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 2; row++) {
        const temp = this.board[row][col];

        this.board[row][col] = this.board[3 - row][col];
        this.board[3 - row][col] = temp;
      }
    }
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  isWinner() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    this.generateTile();
    this.generateTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  generateTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < 4; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
