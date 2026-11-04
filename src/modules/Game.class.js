'use strict';

const SIZE = 4;

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

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
  constructor(initialState = Game.emptyBoard()) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  static emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    return this.state.map((row) => [...row]);
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
    this.status = Game.STATUS.playing;

    const isEmpty = this.state.every((row) => row.every((v) => v === 0));

    if (isEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }

    if (this.hasWon()) {
      this.status = Game.STATUS.win;
    } else if (!this.hasAvailableMoves()) {
      this.status = Game.STATUS.lose;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let boardRow = 0; boardRow < SIZE; boardRow++) {
      for (let boardCol = 0; boardCol < SIZE; boardCol++) {
        if (this.state[boardRow][boardCol] === 0) {
          emptyCells.push({ row: boardRow, col: boardCol });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  move(direction) {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const previousState = JSON.stringify(this.state);

    for (let i = 0; i < SIZE; i++) {
      let line;

      if (direction === 'left' || direction === 'right') {
        line = [...this.state[i]];
      } else {
        line = this.state.map((row) => row[i]);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      const filtered = line.filter((value) => value !== 0);
      const merged = [];

      for (let j = 0; j < filtered.length; j++) {
        if (filtered[j] === filtered[j + 1]) {
          const newValue = filtered[j] * 2;

          merged.push(newValue);
          this.score += newValue;

          j++;
        } else {
          merged.push(filtered[j]);
        }
      }

      while (merged.length < SIZE) {
        merged.push(0);
      }

      if (direction === 'right' || direction === 'down') {
        merged.reverse();
      }

      if (direction === 'left' || direction === 'right') {
        this.state[i] = merged;
      } else {
        for (let j = 0; j < SIZE; j++) {
          this.state[j][i] = merged[j];
        }
      }
    }

    const changed = previousState !== JSON.stringify(this.state);

    if (!changed) {
      return;
    }

    this.addRandomTile();

    if (this.hasWon()) {
      this.status = Game.STATUS.win;

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = Game.STATUS.lose;
    }
  }

  hasWon() {
    return this.state.some((row) => row.includes(2048));
  }

  hasAvailableMoves() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const current = this.state[row][col];

        if (current === 0) {
          return true;
        }

        if (col < SIZE - 1 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < SIZE - 1 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
