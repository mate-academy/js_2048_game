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
    this.initialState = this._copyState(
      initialState || [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    );
    this.state = this._copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this._move('left');
  }

  moveRight() {
    this._move('right');
  }

  moveUp() {
    this._move('up');
  }

  moveDown() {
    this._move('down');
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
    return this._copyState(this.state);
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
    this._addRandomTile();
    this._addRandomTile();
    this._updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this._copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  _copyState(state) {
    return state.map((row) => [...row]);
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';
    const nextState = this._copyState(this.state);
    let scoreIncrease = 0;

    for (let lineIndex = 0; lineIndex < 4; lineIndex++) {
      const line = [];

      for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
        line.push(
          isVertical
            ? this.state[cellIndex][lineIndex]
            : this.state[lineIndex][cellIndex],
        );
      }

      if (isReversed) {
        line.reverse();
      }

      const tiles = line.filter(Boolean);
      const merged = [];

      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === tiles[i + 1]) {
          const value = tiles[i] * 2;

          merged.push(value);
          scoreIncrease += value;
          i++;
        } else {
          merged.push(tiles[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      if (isReversed) {
        merged.reverse();
      }

      for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
        if (isVertical) {
          nextState[cellIndex][lineIndex] = merged[cellIndex];
        } else {
          nextState[lineIndex][cellIndex] = merged[cellIndex];
        }
      }
    }

    const currentCells = this.state.flat();
    const nextCells = nextState.flat();

    if (nextCells.every((value, index) => value === currentCells[index])) {
      return;
    }

    this.state = nextState;
    this.score += scoreIncrease;
    this._addRandomTile();
    this._updateStatus();
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randomRow, randomColumn] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[randomRow][randomColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  _updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.flat().includes(0);
    let hasMergeableNeighbors = false;

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const value = this.state[row][column];

        if (
          value > 0 &&
          ((row < 3 && this.state[row + 1][column] === value) ||
            (column < 3 && this.state[row][column + 1] === value))
        ) {
          hasMergeableNeighbors = true;
          break;
        }
      }

      if (hasMergeableNeighbors) {
        break;
      }
    }

    if (!hasEmptyCell && !hasMergeableNeighbors) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
