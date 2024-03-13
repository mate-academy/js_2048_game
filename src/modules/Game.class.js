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
    ], cells
  ) {
    // eslint-disable-next-line no-console
    // console.log(initialState, 'initial state');
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.cells = cells;
    // this.rows = rows;


  }

  moveLeft() { }
  moveRight() { }

  moveUp() {

    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map(row => row[col]);
      // console.log(column, 'column');
      // Compress the column
      this.compress(column);
      // this.renderBoard();
      // debugger;
      // Merge cells in the column
      this.merge(column);
      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }
      // this.renderBoard();
      // console.log(this.board, 'board!!');
    }


    this.renderBoard();

    // }



    this.generateNumbers();
  }

  merge(column) {
    // debugger;

   console.log(column, 'col for merge');
    for (let i = 0; i <= column.length - 1; i++) {
      console.log(column[i], 'column[i]');
      if (column[i] === column[i + 1] && column[i] > 0) {
        column[i] *= 2;
        console.log(column[i], column[i - 1], 'value');
        column[i + 1] = 0;
        // this.score += column[i];
      }
    }
  }


  compress(col) {
      console.log(col, 'col before compression');
    const compressedColumn = col.filter(cell => cell !== 0);
  

    col.forEach(function(part, index, array) {
       array[index] = index < compressedColumn.length
       ? compressedColumn[index]
       : 0;
    });

    console.log(compressedColumn, col, 'compressed column3');

  }

  moveDown() {

  }

  /**
   * @returns {number}
   */
  getScore() { }

  /**
   * @returns {number[][]}
   */
  getState() { }

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
  getStatus() { }

  /**
   * Starts the game.
   */
  start(name) {
    // eslint-disable-next-line no-console

    // this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    // this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    this.board[0][1] = 2;

  
    this.board[1][1] = 2;
    this.board[2][1] = 2;
    this.board[3][1] = 2;


    this.board[0][2] = 4;
    this.board[2][2] = 2;
    this.board[3][2] = 2;

    this.board[3][3] = 2;
 
    this.board[1][0] = 2;
    // this.board[2][0] = 2;
    this.board[3][0] = 2;
    // this.board[3][0] = 2;

    // console.log(this.board, 'board');
    this.renderBoard()
    // console.log(this.cells, 'board ');
  }

  /**
   * Resets the game.
   */
  restart() { }

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

    const test = empty[coords]
    if (test !== undefined) { this.board[test[0]][test[1]] = 2; }
    // console.log(this.board, 'board2');
    this.renderBoard()

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
  }
}

module.exports = Game;
