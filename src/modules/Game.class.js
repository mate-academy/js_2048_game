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
    // let count = 0;
    // const next = false;

    // this.board.forEach((row, index) => {
    //   console.log(row[index]);
    // })
    // console.log(this.board, 'tiles');
    // for (let line = 0; line <= this.board.length - 2; line++) {
    //   console.log(this.board[line] ,'Move down!');

    //   for (let cell = 0; cell <= this.board[line].cells.length - 1; cell++) {

    //     const condition = this.board[line].cells[cell].innerText === this.board[line + 1].cells[cell].innerText && this.board[line].cells[cell].innerText.length > 0;


    //     const condition2 = this.board[line].cells[cell].innerText === this.board[line + 1].cells[cell].innerText && this.board[line].cells[cell].innerText.length === 0;

    //     count++;


    //     if (condition && !next) {

    //       this.board[line].cells[cell].innerText = '';
    //       this.board[line + 1].cells[cell].innerText = +this.board[line + 1].cells[cell].innerText * 2;
    //       next === true;
    //     }

        // if (this.board[line + 1].cells[cell].innerText = '' &&  this.board[line].cells[cell].innerText !== '') {
        //   this.board[line + 1].cells[cell].innerText = this.board[line].cells[cell].innerText;
        // }


      //   else {
      //     console.log('noooo');
      //   }
      // }
    // }
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
    this.board[2][2] = 2;

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
    this.board[test[0]][test[1]] = 2;
    this.renderBoard()

  }

  renderBoard() {

    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        if (this.board[line][col] !== 0) {
          this.cells[line].cells[col].innerText = this.board[line][col];
        }
      }
    }
  }
}

module.exports = Game;
