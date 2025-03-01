'use strict';
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);

    const shiftAndFilter = (array) => {
      const filteredArray = array.filter((cell) => cell !== 0);

      while (filteredArray.length < 4) {
        filteredArray.push(0);
      }

      return filteredArray;
    };

    for (let row = 0; row < 4; row++) {
      this.board[row] = shiftAndFilter(this.board[row]);

      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          this.board[row][col] += this.board[row][col + 1];
          this.board[row][col + 1] = 0;
          this.score += this.board[row][col];

          col++;
        }
      }

      this.board[row] = shiftAndFilter(this.board[row]);
    }

    const newBoard = JSON.stringify(this.board);

    return oldBoard !== newBoard;
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    const shiftAndFilter = (array) => {
      const filteredArray = array.filter((cell) => cell !== 0);

      while (filteredArray.length < 4) {
        filteredArray.unshift(0);
      }

      return filteredArray;
    };

    for (let row = 0; row < 4; row++) {
      this.board[row] = shiftAndFilter(this.board[row]);

      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          this.board[row][col] += this.board[row][col + 1];
          this.board[row][col + 1] = 0;
          this.score += this.board[row][col];

          col++;
        }
      }

      this.board[row] = shiftAndFilter(this.board[row]);
    }

    const newBoard = JSON.stringify(this.board);

    return oldBoard !== newBoard;
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    const shiftAndFilter = (array) => {
      const filteredArray = array.filter((cell) => cell !== 0);

      while (filteredArray.length < 4) {
        filteredArray.push(0);
      }

      return filteredArray;
    };

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      column = shiftAndFilter(column);

      for (let r = 0; r < 3; r++) {
        if (column[r] === column[r + 1]) {
          column[r] += column[r + 1];
          column[r + 1] = 0;
          this.score += column[r];

          r++;
        }
      }

      column = shiftAndFilter(column);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.board[rowIndex][col] = column[rowIndex];
      }
    }

    const newBoard = JSON.stringify(this.board);

    return oldBoard !== newBoard;
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    const shiftAndFilter = (array) => {
      const filteredArray = array.filter((cell) => cell !== 0);

      while (filteredArray.length < 4) {
        filteredArray.push(0);
      }

      return filteredArray;
    };

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      column.reverse();
      column = shiftAndFilter(column);

      for (let r = 0; r < 3; r++) {
        if (column[r] === column[r + 1]) {
          column[r] += column[r + 1];
          column[r + 1] = 0;
          this.score += column[r];

          r++;
        }
      }

      column = shiftAndFilter(column);
      column.reverse();

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.board[rowIndex][col] = column[rowIndex];
      }
    }

    const newBoard = JSON.stringify(this.board);

    return oldBoard !== newBoard;
  }

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
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    const hasEmptyTiles = this.board.some((row) => row.includes(0));

    if (!hasEmptyTiles) {
      const canMove = (board) => {
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            if (
              (col < 3 && board[row][col] === board[row][col + 1]) ||
              (row < 3 && board[row][col] === board[row + 1][col])
            ) {
              return true;
            }
          }
        }

        return false;
      };

      if (!canMove(this.board)) {
        this.status = 'lose';

        return this.status;
      }
    }

    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.score = 0;
    }

    this.status = 'playing';

    this.addRandomTiles();
    this.addRandomTiles();
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

  addRandomTiles() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    const randomCell =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
