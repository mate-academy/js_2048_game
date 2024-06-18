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

  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.INITIAL_STATE) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    this.moveHorizontal(false);
  }

  moveRight() {
    this.moveHorizontal(true);
  }

  moveUp() {
    this.moveVertical(false);
  }

  moveDown() {
    this.moveVertical(true);
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
    this.setBoard();
    this.setStatus('playing');
  }

  /**
   * Resets the game.
   */
  restart() {
    // this.initialState = [...Game.INITIAL_STATE.map((row) => [...row])];
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  // Add your own methods here
  setBoard() {
    this.addRandomNumber();
    this.addRandomNumber();
  }

  setScore(newScore) {
    this.score += newScore;
  }

  setStatus(newStatus) {
    this.status = newStatus;
  }

  setState(newState) {
    this.state = newState;
  }

  addRandomNumber(row = null, col = null, number = null) {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length) {
      const index = Math.floor(Math.random() * emptyCells.length);
      const randomCellCoordinate = emptyCells[index];
      const targetRow = row !== null ? row : randomCellCoordinate.row;
      const targetCol = col !== null ? col : randomCellCoordinate.col;
      const targetNumber =
        number !== null ? number : Math.random() < 0.9 ? 2 : 4;

      this.state[targetRow][targetCol] = targetNumber;
    }
  }

  combine(cells) {
    const combined = [];
    let scoreToAdd = 0;
    let skip = false;

    for (let i = 0; i < cells.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (cells[i] !== 0) {
        if (cells[i] === cells[i + 1]) {
          combined.push(cells[i] * 2);
          scoreToAdd += cells[i] * 2;
          skip = true;
        } else {
          combined.push(cells[i]);
        }
      }
    }

    while (combined.length < 4) {
      combined.push(0);
    }

    this.setScore(scoreToAdd);

    return combined;
  }

  moveHorizontal(right = false) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = [...this.state[i]];

      if (right) {
        row.reverse();
      }

      const newRow = this.combine(row);

      if (right) {
        newRow.reverse();
      }

      if (this.state[i].toString() !== newRow.toString()) {
        moved = true;
      }
      this.state[i] = newRow;
    }

    if (moved) {
      this.addRandomNumber();

      if (this.checkWin()) {
        this.setStatus('win');
      } else if (this.checkLose()) {
        this.setStatus('lose');
      }
    }
  }
   
  moveVertical(down = false) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const col = [];

      for (let j = 0; j < 4; j++) {
        col.push(this.state[j][i]);
      }

      if (down) {
        col.reverse();
      }

      const newCol = this.combine(col);

      if (down) {
        newCol.reverse();
      }

      for (let j = 0; j < 4; j++) {
        if (this.state[j][i] !== newCol[j]) {
          moved = true;
        }
        this.state[j][i] = newCol[j];
      }
    }

    if (moved) {
      this.addRandomNumber();

      if (this.checkWin()) {
        this.setStatus('win');
      } else if (this.checkLose()) {
        this.setStatus('lose');
      }
    }
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
