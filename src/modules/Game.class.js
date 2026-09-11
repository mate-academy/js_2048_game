'use strict';

const BOARD_SIZE = 4;

/**
 * This class represents the game.
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
    this.initialState = this.copyState(initialState || Game.createEmptyState());
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
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
    return this.copyState(this.state);
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

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Moves the board in one of the four available directions.
   *
   * @param {string} direction
   * @returns {boolean} Whether the board was changed.
   */
  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const { state, score } = this.getMovedState(direction);

    if (this.statesAreEqual(this.state, state)) {
      this.updateStatus();

      return false;
    }

    this.state = state;
    this.score += score;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  /**
   * Creates a board after moving it in the selected direction.
   *
   * @param {string} direction
   * @returns {{ state: number[][], score: number }}
   */
  getMovedState(direction) {
    const state = Game.createEmptyState();
    let score = 0;
    const isHorizontal = direction === 'left' || direction === 'right';
    const movesToEnd = direction === 'right' || direction === 'down';

    for (let index = 0; index < BOARD_SIZE; index++) {
      const line = isHorizontal
        ? this.state[index]
        : this.state.map((row) => row[index]);
      const result = this.mergeLine(line, movesToEnd);

      score += result.score;

      for (let cell = 0; cell < BOARD_SIZE; cell++) {
        if (isHorizontal) {
          state[index][cell] = result.line[cell];
        } else {
          state[cell][index] = result.line[cell];
        }
      }
    }

    return { state, score };
  }

  /**
   * Compacts and merges a single row or column.
   *
   * @param {number[]} line
   * @param {boolean} movesToEnd
   * @returns {{ line: number[], score: number }}
   */
  mergeLine(line, movesToEnd) {
    const tiles = line.filter(Boolean);
    const merged = [];
    let score = 0;

    if (movesToEnd) {
      tiles.reverse();
    }

    for (let index = 0; index < tiles.length; index++) {
      const currentTile = tiles[index];
      const nextTile = tiles[index + 1];

      if (currentTile === nextTile) {
        const tile = currentTile * 2;

        merged.push(tile);
        score += tile;
        index++;
      } else {
        merged.push(currentTile);
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0);
    }

    if (movesToEnd) {
      merged.reverse();
    }

    return { line: merged, score };
  }

  /**
   * Adds a new tile to an empty cell.
   */
  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
      for (let columnIndex = 0; columnIndex < BOARD_SIZE; columnIndex++) {
        if (this.state[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const [row, column] = randomCell;

    this.state[row][column] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Updates status after the board changes.
   */
  updateStatus() {
    if (this.state.flat().some((tile) => tile >= 2048)) {
      this.status = 'win';

      return;
    }

    this.status = this.hasAvailableMoves() ? 'playing' : 'lose';
  }

  /**
   * @returns {boolean}
   */
  hasAvailableMoves() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        const tile = this.state[row][column];

        if (
          tile === 0 ||
          this.state[row][column + 1] === tile ||
          (this.state[row + 1] && this.state[row + 1][column] === tile)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @param {number[][]} firstState
   * @param {number[][]} secondState
   * @returns {boolean}
   */
  statesAreEqual(firstState, secondState) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        if (firstState[row][column] !== secondState[row][column]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * @param {number[][]} state
   * @returns {number[][]}
   */
  copyState(state) {
    return state.map((row) => [...row]);
  }

  /**
   * @returns {number[][]}
   */
  static createEmptyState() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  }
}

module.exports = Game;
