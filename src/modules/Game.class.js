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
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();

    this.state = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    this.move((state) => this.slideStateLeft(state));
  }

  moveRight() {
    this.move((state) => this.slideStateRight(state));
  }

  moveUp() {
    this.move((state) => this.slideStateUp(state));
  }

  moveDown() {
    this.move((state) => this.slideStateDown(state));
  }

  slideStateLeft(state) {
    return state.map((row) => this.slideRowLeft(row));
  }

  slideStateRight(state) {
    return state.map((row) => this.slideRowLeft([...row].reverse()).reverse());
  }

  slideStateUp(state) {
    return this.transpose(this.slideStateLeft(this.transpose(state)));
  }

  slideStateDown(state) {
    return this.transpose(this.slideStateRight(this.transpose(state)));
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
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
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  /**
   * Applies a slide function to the board only while the game is
   * playing, and only commits the result if it actually changed
   * something (a move that changes nothing shouldn't spawn a tile
   * or affect the game status).
   */
  move(slide) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.state);
    const newState = slide(this.state);

    if (JSON.stringify(newState) === previousState) {
      return;
    }

    this.state = newState;
    this.addRandomTile();
    this.checkStatus();
  }

  slideRowLeft(row) {
    const filtered = row.filter((num) => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] = filtered[i] * 2;
        filtered.splice(i + 1, 1);
        this.score += filtered[i];
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  transpose(matrix) {
    return matrix.map((row, index) => matrix.map((r) => r[index]));
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  canMerge() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.state[r][c];

        if (c < 3 && this.state[r][c + 1] === value) {
          return true;
        }

        if (r < 3 && this.state[r + 1][c] === value) {
          return true;
        }
      }
    }

    return false;
  }

  checkStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.some((row) => row.includes(0));

    if (!hasEmptyCell && !this.canMerge()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
