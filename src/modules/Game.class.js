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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.initialState = this.boardDeepCopy(initialState);
    this.board = this.boardDeepCopy(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.performMove((board) => this.joinTiles(board));
  }

  moveRight() {
    this.performMove((board) => {
      return this.reverse(this.joinTiles(this.reverse(board)));
    });
  }

  moveUp() {
    this.performMove((board) => {
      const transposed = this.transpose(board);
      const joined = this.joinTiles(transposed);

      return this.transpose(joined);
    });
  }

  moveDown() {
    this.performMove((board) => {
      const transposed = this.transpose(board);
      const reversed = this.reverse(transposed);
      const joined = this.joinTiles(reversed);
      const restored = this.reverse(joined);

      return this.transpose(restored);
    });
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
    return this.boardDeepCopy(this.board);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.board = this.boardDeepCopy(this.initialState);
    this.score = 0;
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = this.board.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push({ row: rowIndex, col: colIndex });
        }
      });

      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    }
  }

  joinTiles(board) {
    return board.map((line) => {
      const filteredLine = line.filter((value) => value !== 0);

      for (let i = 0; i < filteredLine.length; i++) {
        if (filteredLine[i] === filteredLine[i + 1]) {
          filteredLine[i] *= 2;
          this.score += filteredLine[i];

          if (filteredLine[i] === 2048) {
            this.status = 'win';
          }

          filteredLine.splice(i + 1, 1);
        }
      }

      while (filteredLine.length < 4) {
        filteredLine.push(0);
      }

      return filteredLine;
    });
  }

  transpose(board) {
    return board[0].map((_, colInd) => board.map((row) => row[colInd]));
  }

  reverse(board) {
    return board.map((line) => line.reverse());
  }

  boardDeepCopy(toCopy) {
    return JSON.parse(JSON.stringify(toCopy));
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];

        if (
          this.board[i][j] === 0 ||
          (i < 3 && current === this.board[i + 1][j]) ||
          (j < 3 && current === this.board[i][j + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  performMove(moveFunction) {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    this.board = moveFunction(this.board);

    if (JSON.stringify(this.board) !== boardBeforeMove) {
      this.addRandomTile();
    }
  }
}

module.exports = Game;
