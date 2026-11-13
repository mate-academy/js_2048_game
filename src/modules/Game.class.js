/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
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
    const emptyBoard = Array.from({ length: 4 }, () => Array(4).fill(0)); //створюється поле 4×4;

    this.initialState = initialState //копіюється рядок за рядком;
      ? initialState.map((row) => [...row])
      : emptyBoard;
    // eslint-disable-next-line max-len
    this.board = this.initialState.map((row) => [...row]); //окрема копія, створює окрему робочу дошку board
    this.score = 0; //починається з 0 встановлює score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      console.log('this.board', this.board);

      const originalRow = this.board[i];

      const tiles = originalRow.filter((tile) => tile !== 0);

      for (let j = 0; j < tiles.length - 1; j++) {
        if (tiles[j] === tiles[j + 1]) {
          tiles[j] *= 2;
          tiles.splice(j + 1, 1); // видалити праву плитку
          this.score += tiles[j]; //збільшити рахунок
        }
      }

      while (tiles.length < originalRow.length) {
        tiles.push(0);
      }
      this.board[i] = tiles;
    }
  }
  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]].reverse(); //

      const tiles = originalRow.filter((tile) => tile !== 0);

      for (let j = 0; j < tiles.length - 1; j++) {
        if (tiles[j] === tiles[j + 1]) {
          tiles[j] *= 2;
          tiles.splice(j + 1, 1); // видалити праву плитку
          this.score += tiles[j]; //збільшити рахунок
        }
      }

      while (tiles.length < originalRow.length) {
        tiles.push(0);
      }
      this.board[i] = tiles.reverse();
    }
  }
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {
    //повертає поточний рахунок.
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    //повертає копію дошки, тому зовнішній код не змінить this.board напряму.
    return this.board.map((row) => [...row]);
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

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

export default Game;
