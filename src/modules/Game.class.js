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
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : null;

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      // eslint-disable-next-line no-useless-return
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const currentRow = this.board[r];
      const newRow = this.combineRow(currentRow);

      for (let i = 0; i < this.size; i++) {
        if (currentRow[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const reversedRow = this.board[r].slice().reverse();
      const newRow = this.combineRow(reversedRow).reverse();

      for (let i = 0; i < this.size; i++) {
        if (this.board[r][i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]);
      const newCol = this.combineRow(col);

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
          break;
        }
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = this.board.map((row) => row[c]).reverse();
      const newCol = this.combineRow(col).reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
          break;
        }
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (moved) {
      this.afterMove();
    }
  }

  combineRow(row) {
    const nonZero = row.filter((val) => val !== 0); // очищення від нулів
    const merged = [];

    let skipNext = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const sum = nonZero[i] * 2;

        merged.push(sum);
        this.score += sum;
        skipNext = true; // пропускаємо наступну плитку
      } else {
        merged.push(nonZero[i]);
      }
    }

    // доповнюємо до 4 елементів
    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  // combineRow(row) {
  //   const nonZero = row.filter((val) => val !== 0);

  //   const merged = [];
  //   let i = 0;

  //   while (i < nonZero.length) {
  //     if (nonZero[i] === nonZero[i + 1]) {
  //       const sum = nonZero[i] * 2;

  //       merged.push(sum);
  //       this.score += sum;
  //       i += 2;
  //     } else {
  //       merged.push(nonZero[i]);
  //       i++;
  //     }
  //   }

  //   while (merged.length < this.size) {
  //     merged.push(0);
  //   }

  //   return merged;
  // }

  afterMove() {
    this.addRandomTile();

    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.board.flat().includes(2048);
  }

  checkLose() {
    return !this.board.flat().includes(0) && !this.canMove();
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
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
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    // this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }
  // Add your own methods here
}

// export default Game;

module.exports = Game;
