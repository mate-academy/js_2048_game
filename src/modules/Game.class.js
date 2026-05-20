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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    // eslint-disable-next-line no-console

    this.score = 0;
    this.status = 'idle';
  }

  slideRow(row) {
    const nonZeroTiles = row.filter((tile) => tile !== 0);
    const mergedRow = [];

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (
        i < nonZeroTiles.length - 1 &&
        nonZeroTiles[i] === nonZeroTiles[i + 1]
      ) {
        mergedRow.push(nonZeroTiles[i] * 2);
        this.score += nonZeroTiles[i] * 2;
        i++;
      } else {
        mergedRow.push(nonZeroTiles[i]);
      }
    }

    for (let i = mergedRow.length; i < 4; i++) {
      mergedRow.push(0);
    }

    return mergedRow;
  }
  moveLeft() {
    for (let row = 0; row < 4; row++) {
      this.board[row] = this.slideRow(this.board[row]);
    }
  }
  moveRight() {
    for (let row = 0; row < 4; row++) {
      this.board[row] = this.slideRow(
        this.board[row].slice().reverse(),
      ).reverse();
    }
  }
  moveUp() {
    for (let c = 0; c < 4; c++) {
      const column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];
      const mergedColumn = this.slideRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][c] = mergedColumn[row];
      }
    }
  }
  moveDown() {
    for (let c = 0; c < 4; c++) {
      const column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];
      const mergedColumn = this.slideRow(column.slice().reverse()).reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = mergedColumn[r];
      }
    }
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
  spawnTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
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

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    let hasEmpty = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          hasEmpty = true;
        }
      }
    }

    if (!hasEmpty) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (
            (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
            (r < 3 && this.board[r][c] === this.board[r + 1][c])
          ) {
            return;
          }
        }
      }
      this.status = 'lose';
    }
  }
  start() {
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }
}
module.exports = Game;
