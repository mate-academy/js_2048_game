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
    this.initialState = this._cloneState(
      initialState || this._createEmptyState(),
    );
    this.state = this._cloneState(this.initialState);
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
    return this._cloneState(this.state);
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
    this.state = this._cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  _createEmptyState() {
    const state = [];

    for (let i = 0; i < 4; i++) {
      state[i] = [0, 0, 0, 0];
    }

    return state;
  }

  _cloneState(state) {
    const cloned = [];

    for (let i = 0; i < state.length; i++) {
      cloned[i] = [];

      for (let j = 0; j < state[i].length; j++) {
        cloned[i][j] = state[i][j];
      }
    }

    return cloned;
  }

  _getEmptyCells(state) {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!state[row][col]) {
          empty.push([row, col]);
        }
      }
    }

    return empty;
  }

  _addRandomTile() {
    const empty = this._getEmptyCells(this.state);

    if (!empty.length) {
      return false;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[row][col] = value;

    return true;
  }

  _mergeLine(line) {
    const nonZero = [];

    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0) {
        nonZero.push(line[i]);
      }
    }
    const result = [];
    let scoreGain = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        result.push(merged);
        scoreGain += merged;
        i += 1;
      } else {
        result.push(nonZero[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { line: result, scoreGain };
  }

  _statesEqual(stateA, stateB) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (stateA[row][col] !== stateB[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this._cloneState(this.state);
    let totalScoreGain = 0;

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const current = [];

        for (let i = 0; i < 4; i++) {
          current[i] = this.state[row][i];
        }

        let line = current;

        if (direction === 'right') {
          line = current.reverse();
        }

        const mergeResult = this._mergeLine(line);
        let finalLine = mergeResult.line;

        if (direction === 'right') {
          finalLine = mergeResult.line.reverse();
        }

        this.state[row] = finalLine;
        totalScoreGain += mergeResult.scoreGain;
      }
    } else {
      for (let col = 0; col < 4; col++) {
        const current = [];

        for (let row = 0; row < 4; row++) {
          current.push(this.state[row][col]);
        }

        let line = current;

        if (direction === 'down') {
          line = current.reverse();
        }

        const mergeResult = this._mergeLine(line);
        let finalLine = mergeResult.line;

        if (direction === 'down') {
          finalLine = mergeResult.line.reverse();
        }

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = finalLine[row];
        }

        totalScoreGain += mergeResult.scoreGain;
      }
    }

    if (this._statesEqual(prevState, this.state)) {
      this._updateStatus();

      return;
    }

    this.score += totalScoreGain;
    this._addRandomTile();
    this._updateStatus();
  }

  _hasAvailableMoves() {
    if (this._getEmptyCells(this.state).length) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.state[row][col];

        if (row < 3 && this.state[row + 1][col] === value) {
          return true;
        }

        if (col < 3 && this.state[row][col + 1] === value) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    let hasWon = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          hasWon = true;
          break;
        }
      }

      if (hasWon) {
        break;
      }
    }

    if (hasWon) {
      this.status = 'win';

      return;
    }

    if (!this._hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  // Add your own methods here
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
} else if (typeof window !== 'undefined') {
  window.Game = Game;
}
