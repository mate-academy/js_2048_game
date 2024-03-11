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
    console.log(initialState, 'initial state');
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.cells = cells;
    // this.rows = rows;


  }

  moveLeft() {}
  moveRight() {}

  moveUp() {

  }
  moveDown() {
    for (let row = 0; row <= this.board.length - 2; row++) {
      console.log(this.board[row], 'the row');
      for (let cell = 0; cell <= this.board[row].length - 1 ; cell++) {
        if (this.board[row][cell] === this.board[row + 1][cell]) {
          this.board[row + 1][cell] = this.board[row][cell] * 2;
          this.board[row][cell] = 0;
          this.renderBoard();
          console.log(this.board, 'board2');
        }
      }
    }
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
    // eslint-disable-next-line no-console

    // this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    // this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] = 2;
    this.board[0][2] = 2;
    this.board[1][2] = 2;
    this.board[2][2] = 4;

    // console.log(this.board, 'board');
    this.renderBoard()
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

    const test = empty[coords]
    if (test !== undefined) {this.board[test[0]][test[1]] = 2;}
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
