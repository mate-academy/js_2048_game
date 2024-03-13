/* eslint-disable */

'use strict';
/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    cells,
    scoreElement,
  ) {
    // eslint-disable-next-line no-console
    // console.log(initialState, 'initial state');
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.cells = cells;
    this.scoreElement = scoreElement;
    // this.rows = rows;
  }

  moveLeft() {
    for (let row = 0; row <= this.board.length - 1; row++) {
      // console.log(typeof this.board[row], 'row left');
      this.compress(this.board[row]);
      this.merge(this.board[row]);
      this.compress(this.board[row]);
    }
    this.renderBoard();
    this.generateNumbers();
  }
  moveRight() {
    for (let row = 0; row <= this.board.length - 1; row++) {
      console.log(typeof this.board[row], 'row right');
      this.compressDown(this.board[row]);
      this.mergeDown(this.board[row]);
      this.compressDown(this.board[row]);
    }
    this.renderBoard();
    this.generateNumbers();
  }

  moveUp() {
    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]);
      this.compress(column);
      this.merge(column);
      this.compress(column);
      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }
    }
    this.renderBoard();
    this.generateNumbers();
  }

  merge(column) {
    for (let i = 0; i <= column.length - 1; i++) {
      if (column[i] === column[i + 1] && column[i] > 0) {
        column[i] *= 2;

        column[i + 1] = 0;
        this.score += column[i];
      }
    }
  }
  mergeDown(column) {
    // debugger;
    //  console.log(column, 'col for merge');
    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1] && column[i] > 0) {
        column[i] *= 2;
        column[i - 1] = 0;
        this.score += column[i];
      }
    }
  }

  // compressLeft(row) {
  //     console.log(row, 'row before compression');
  //   const compressedColumn = row.filter(cell => cell !== 0);
  //   console.log(compressedColumn, 'compressed');
  //   while (compressedColumn.length < 4) {
  //     compressedColumn.push(0);
  //   }
  //   row.forEach(function(part, index, array) {
  //     array[index] = compressedColumn[index]
  //  });
  //  console.log(row, 'row after all');
  // }

  compress(col) {
    // console.log(col, 'col before compression');
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.push(0);
    }
    col.forEach(function (part, index, array) {
      array[index] = compressedColumn[index];
    });
  }

  compressDown(col) {
    // console.log(col, 'col before compression');
    // debugger;
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.unshift(0);
    }
    col.forEach(function (part, index, array) {
      array[index] = compressedColumn[index];
    });

    // console.log(compressedColumn, col, 'compressed column3');
  }

  moveDown() {
    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]);
      this.compressDown(column);
      this.mergeDown(column);
      this.compressDown(column);
      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }
    }
    this.renderBoard();
    this.generateNumbers();
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start(name) {
    this.status = 'playing';
    // eslint-disable-next-line no-console

    this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    // this.board[0][1] = 2;

    // this.board[0][1] = 2;
    // this.board[1][0] = 2;
    // this.board[2][0] = 2;
    // this.board[3][0] = 2;

    // this.board[0][1] = 2;
    // this.board[0][2] = 2;
    // this.board[0][3] = 2;

    // this.board[0][2] = 4;
    // this.board[2][2] = 2;
    // this.board[3][2] = 2;

    // this.board[3][3] = 2;

    // this.board[1][0] = 2;
    // // this.board[2][0] = 2;
    // this.board[3][0] = 2;
    // this.board[3][0] = 2;

    // console.log(this.board, 'board');
    this.renderBoard();
    // console.log(this.cells, 'board ');
  }

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here

  generateNumbers() {
    const empty = [];
    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        if (this.board[line][col] === 0) {
          empty.push([line, col]);
        }
      }
    }
    const coords = Math.floor(Math.random() * empty.length);

    const test = empty[coords];
    if (test !== undefined) {
      this.board[test[0]][test[1]] = 2;
    }
    // console.log(this.board, 'board2');
    this.renderBoard();
  }

  renderBoard() {
    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        this.cells[line].cells[col].innerText = this.board[line][col];
        if (this.board[line][col] === 0) {
          this.cells[line].cells[col].innerText = '';
        }
      }
    }
    this.scoreElement[0].innerText = this.score;
  }

}

module.exports = Game;
