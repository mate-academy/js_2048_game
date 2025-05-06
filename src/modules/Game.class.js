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

  combineLine(line) {
    const nonZero = line.filter((val) => val !== 0);
    const newLine = [];
    let moved = false;
    let scoreGained = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newLine.push(merged);
        scoreGained += merged;
        i++;
        moved = true;
      } else {
        newLine.push(nonZero[i]);
      }
    }

    while (newLine.length < this.size) {
      newLine.push(0);
    }

    return { newLine, moved, scoreGained };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const oldRow = [...this.board[i]];
      const { newLine, scoreGained } = this.combineLine(oldRow);

      this.board[i] = newLine;

      if (!this.arraysEqual(oldRow, newLine)) {
        moved = true;
      }
      this.score += scoreGained;
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }

    return moved;
  }
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((val, i) => val === arr2[i]);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row = [...this.board[i]].reverse();
      const { newLine, scoreGained } = this.combineLine(row);
      const updatedRow = newLine.reverse();

      if (!this.arraysEqual(this.board[i], updatedRow)) {
        moved = true;
      }

      this.board[i] = updatedRow;
      this.score += scoreGained;
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      const column = this.board.map((row) => row[j]);
      const { newLine, scoreGained } = this.combineLine(column);

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== newLine[i]) {
          moved = true;
        }
        this.board[i][j] = newLine[i];
      }

      this.score += scoreGained;
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }

    return moved;
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      const column = this.board.map((row) => row[j]).reverse();
      const { newLine, scoreGained } = this.combineLine(column);
      const finalColumn = newLine.reverse();

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== finalColumn[i]) {
          moved = true;
        }
        this.board[i][j] = finalColumn[i];
      }

      this.score += scoreGained;
    }

    if (moved) {
      this.checkWin();
      this.addRandomTile();
      this.checkLose();
    }

    return moved;
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
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    if (this.status !== 'playing') {
      return false;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (
          (col < this.size - 1 &&
            this.board[row][col] === this.board[row][col + 1]) ||
          (row < this.size - 1 &&
            this.board[row][col] === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.status = 'playing';

    this.board = this.initialState.map((row) => [...row]);

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length >= 2) {
      this.addRandomTile();
      this.addRandomTile();
    } else if (emptyCells.length === 1) {
      this.addRandomTile();
    }
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
  }

  getEmptyCells() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push({ row: i, col: j });
        }
      }
    }

    return empty;
  }

  /**
   * Resets the game.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.board = this.initialState.map((row) => [...row]);
  }
}

module.exports = Game;
