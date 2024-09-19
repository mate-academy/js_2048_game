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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.startButton = document.querySelector('.button');
    this.board = [];
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;

      for (let j = 0; j < this.board.length; j++){
        if (this.board[i][j] !== 0){
          [this.board[i][j], this.board[i][index]] = [this.board[i][index], this.board[i][j]];
          index++;
        }
      }
    }
  }
  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      let index = this.board.length - 1;

      for (let j = this.board.length; j > 0; j--) {
        if (this.board[i][j] !== 0) {
          [this.board[i][j], this.board[i][index]] = [this.board[i][index], this.board[i][j]];
          index--;
        }
      }
    }
  }
  moveUp() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;

      for (let j = 0; j < this.board.length; j++){
        if (this.board[j][i] !== 0){
          [this.board[j][i], this.board[index][i]] = [this.board[index][i], this.board[j][i]];
          index++;
        }
      }
    }
  }
  moveDown() {
    for (let i = 0; i < this.board.length; i++) {
      let index = this.board.length - 1;

      for (let j = this.board.length; j > 0; j--){
        if (this.board[j][i] !== 0){
          [this.board[j][i], this.board[index][i]] = [this.board[index][i], this.board[j][i]];
          index--;
        }
      }
    }
  }

  moveAllLeftRight() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;

      for (let j = 0; j < this.board.length; j++){
        if (this.board[i][j] !== 0){
          [this.board[i][j], this.board[i][index]] = [this.board[i][index], this.board[i][j]];
          index++;
        }
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.startButton.textContent = 'Restart';
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();
    this.cell1 = document.querySelector('#cell1');

    const rowArray = [2,0,0,8];
    for (let i = 0; i < rowArray.length; i++) {
      const el = rowArray[i];
      console.log(el, i)
      if (el > 0) {
        this.cell = document.querySelector(`#cell${i}`);
        this.cell.textContent = rowArray[i];
      }
    }
  }

  /**
   * Resets the game.
   */
  
  restart() {
    this.start();
  }

  addRandomCell() {
    const emptyCell = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (!this.board[i][j]) {
          emptyCell.push({ x: i, y: j });
        }
      }
    }

    if (emptyCell.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCell.length);
      const randomEmptyCell = emptyCell[randomIndex];

      this.board[randomEmptyCell.x][randomEmptyCell.y] =
        Math.random() < 0.9 ? 2 : 4;
    }
    console.log(this.board);
  }
}

module.exports = Game;
