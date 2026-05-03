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

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const result = [];
    let scoreAddTotal = 0;

    for (let i = 0; i < this.board.length; i++) {
      const { newRow, scoreAdd } = this.slideAndMerge(this.board[i]);

      result.push(newRow);
      scoreAddTotal += scoreAdd;
    }

    let changed = false;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== result[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (!changed) {
      return false;
    }

    this.board = result;
    this.score += scoreAddTotal;
    this.addRandomTile();
    this.checkWin();
    this.checkGameOver();

    return true;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const result = [];
    let scoreAddTotal = 0;

    for (let i = 0; i < this.board.length; i++) {
      const reversed = [...this.board[i]].reverse();
      const { newRow, scoreAdd } = this.slideAndMerge(reversed);

      result.push([...newRow].reverse());
      scoreAddTotal += scoreAdd;
    }

    let changed = false;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== result[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (!changed) {
      return false;
    }

    this.board = result;
    this.score += scoreAddTotal;
    this.addRandomTile();
    this.checkWin();
    this.checkGameOver();

    return true;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const result = [];
    let totalScoreAdd = 0;

    const transposed = this.transpose(this.board);

    for (let i = 0; i < transposed.length; i++) {
      const { newRow, scoreAdd } = this.slideAndMerge(transposed[i]);

      result.push(newRow);
      totalScoreAdd += scoreAdd;
    }

    const transposedResult = this.transpose(result);

    let changed = false;

    for (let i = 0; i < transposed.length; i++) {
      for (let j = 0; j < transposed[i].length; j++) {
        if (this.board[i][j] !== transposedResult[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (!changed) {
      return false;
    }

    this.board = transposedResult;
    this.score += totalScoreAdd;

    this.addRandomTile();
    this.checkWin();
    this.checkGameOver();

    return true;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const result = [];
    let totalScoreAdd = 0;

    const transposed = this.transpose(this.board);

    for (let i = 0; i < transposed.length; i++) {
      const row = transposed[i];

      const reversed = [...row].reverse();

      const { newRow, scoreAdd } = this.slideAndMerge(reversed);

      const finalRow = [...newRow].reverse();

      result.push(finalRow);
      totalScoreAdd += scoreAdd;
    }

    const transposedResult = this.transpose(result);

    let changed = false;

    for (let i = 0; i < transposed.length; i++) {
      for (let j = 0; j < transposed[i].length; j++) {
        if (this.board[i][j] !== transposedResult[i][j]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (!changed) {
      return false;
    }

    this.board = transposedResult;
    this.score += totalScoreAdd;

    this.addRandomTile();
    this.checkWin();
    this.checkGameOver();

    return true;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getState() {
    const result = [];

    for (let i = 0; i < this.board.length; i++) {
      const keep = this.board[i];
      const copy = [...keep];

      result.push(copy);
    }

    return result;
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const keep = this.getEmptyCells();

    if (keep.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * keep.length);

    const [i, j] = keep[randomIndex];

    if (Math.random() < 0.9) {
      this.board[i][j] = 2;
    } else {
      this.board[i][j] = 4;
    }
  }

  slideAndMerge(row) {
    const nonZero = row.filter((x) => x !== 0);

    const result = [];
    let scoreAdd = 0;

    for (let i = 0; i < nonZero.length; i++) {
      const current = nonZero[i];
      const next = nonZero[i + 1];

      if (current === next) {
        result.push(current * 2);
        scoreAdd += current * 2;

        i++;
      } else {
        result.push(current);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { newRow: result, scoreAdd };
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  canMove() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const keep = this.board[i][j];
        const next = this.board[i][j + 1];
        const under = this.board[i + 1]?.[j];

        if (keep === 0) {
          return true;
        }

        if (next !== undefined) {
          if (keep === next) {
            return true;
          }
        }

        if (under !== undefined) {
          if (keep === under) {
            return true;
          }
        }
      }
    }

    return false;
  }

  checkGameOver() {
    const call = this.canMove();

    if (call === false) {
      this.status = 'lose';
    }
  }

  transpose(matrix) {
    const result = [];

    for (let j = 0; j < matrix.length; j++) {
      const words = [];

      for (let i = 0; i < matrix.length; i++) {
        words.push(matrix[i][j]);
      }

      result.push(words);
    }

    return result;
  }

  reverseRows() {
    const result = [];

    for (let i = 0; i < this.board.length; i++) {
      const keep = this.board[i];
      const reversed = keep.reverse();

      result.push(reversed);
    }

    return result;
  }
}

export default Game;
