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
    this.initialState = initialState;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    const befor = JSON.stringify(this.board);

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const merge = [];
      const mainRow = this.board[rowIndex];
      const row = mainRow.filter((a) => a !== 0);

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          this.score += row[i] * 2;
          merge.push(row[i] * 2);
          i++;
        } else {
          merge.push(row[i]);
        }
      }

      while (merge.length < 4) {
        merge.push(0);
      }
      this.board[rowIndex] = merge;
    }

    const afte = JSON.stringify(this.board);

    if (afte !== befor) {
      this.addRandomTile();
      this.checkForWin();
    }
  }
  moveRight() {
    const befor = JSON.stringify(this.board);

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const merge = [];
      const mainRow = [...this.board[rowIndex]].reverse();
      const row = mainRow.filter((a) => a !== 0);

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          this.score += row[i] * 2;
          merge.push(row[i] * 2);
          i++;
        } else {
          merge.push(row[i]);
        }
      }

      while (merge.length < 4) {
        merge.push(0);
      }
      this.board[rowIndex] = merge.reverse();
    }

    const afte = JSON.stringify(this.board);

    if (afte !== befor) {
      this.addRandomTile();
      this.checkForWin();
    }
  }

  checkForWin() {
    for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
      for (let i = 0; i < 4; i++) {
        if (this.board[colIndex][i] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkForLose() {
    const originalBoard = JSON.parse(JSON.stringify(this.board));
    const originalScore = this.score;
    const basicBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.moveLeft();

    const afterLeft = JSON.stringify(this.board);

    this.board = JSON.parse(JSON.stringify(originalBoard));
    this.score = originalScore;

    this.moveRight();

    const afterRight = JSON.stringify(this.board);

    this.board = JSON.parse(JSON.stringify(originalBoard));
    this.score = originalScore;

    this.moveUp();

    const afterUp = JSON.stringify(this.board);

    this.board = JSON.parse(JSON.stringify(originalBoard));
    this.score = originalScore;

    this.moveDown();

    const afterbottom = JSON.stringify(this.board);

    this.board = JSON.parse(JSON.stringify(originalBoard));
    this.score = originalScore;

    if (
      JSON.stringify(basicBoard) === afterLeft &&
      JSON.stringify(basicBoard) === afterRight &&
      JSON.stringify(basicBoard) === afterUp &&
      JSON.stringify(basicBoard) === afterbottom
    ) {
      this.status = 'idle';
    } else if (
      JSON.stringify(this.board) === afterLeft &&
      JSON.stringify(this.board) === afterRight &&
      JSON.stringify(this.board) === afterUp &&
      JSON.stringify(this.board) === afterbottom
    ) {
      this.status = 'lose';
    }
  }

  transpose() {
    const transposed = [];

    for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
      const merge = [];

      for (let i = 0; i < 4; i++) {
        merge.push(this.board[i][colIndex]);
      }
      transposed.push(merge);
    }
    this.board = transposed;
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];

    if (Math.random() < 0.1) {
      this.board[randomRow][randomCol] = 4;
    } else {
      this.board[randomRow][randomCol] = 2;
    }
  }
  // Add your own methods here
}

module.exports = Game;
