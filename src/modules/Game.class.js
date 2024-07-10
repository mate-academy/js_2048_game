'use strict';

const { getRandomArrayIndex } = require('../scripts/utils');

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
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (!this.canMoveLeft()) {
      return;
    }

    if (this.status === 'playing') {
      this.move();

      this.addTile();
      this.isGameContinue();
    }
  }

  moveRight() {
    if (!this.canMoveRight()) {
      return;
    }

    if (this.status === 'playing') {
      this.reverseBoard();
      this.move();
      this.reverseBoard();

      this.addTile();
      this.isGameContinue();
    }
  }

  moveUp() {
    if (!this.canMoveUp()) {
      return;
    }

    if (this.status === 'playing') {
      this.transposeBoard();
      this.move();
      this.transposeBoard();

      this.addTile();
      this.isGameContinue();
    }
  }

  moveDown() {
    if (!this.canMoveDown()) {
      return;
    }

    if (this.status === 'playing') {
      this.transposeBoard();
      this.reverseBoard();
      this.move();
      this.reverseBoard();
      this.transposeBoard();

      this.addTile();
      this.isGameContinue();
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
    this.addTile();
    this.addTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  getEmptyCells() {
    return this.state.reduce((emptyCells, row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });

      return emptyCells;
    }, []);
  }

  addTile() {
    const number = Math.random() <= 0.1 ? 4 : 2;

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const emptyCellIndex = getRandomArrayIndex(emptyCells);

      const { rowIndex, colIndex } = emptyCells[emptyCellIndex];

      this.state[rowIndex][colIndex] = number;
    }
  }

  move() {
    this.state = this.state.map((row) => row.filter((v) => v !== 0));

    this.state.forEach((newRow) => {
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          this.score += newRow[i] * 2;
          newRow[i] += newRow[i + 1];
          newRow[i + 1] = 0;
          i++;
          continue;
        }
      }
    });

    this.state = this.state.map((row) => row.filter((v) => v !== 0));

    this.state.forEach((row) => {
      while (row.length < 4) {
        row.push(0);
      }
    });
  }

  isBoardHas2048() {
    return this.state.some((row) => row.includes(2048));
  }

  reverseBoard() {
    this.state = this.state.map((row) => row.reverse());
  }

  transposeBoard() {
    this.state = this.state[0].map((_, colI) => {
      return this.state.map((row) => row[colI]);
    });
  }

  canMoveLeft() {
    return this.state.some((row) => {
      const rowWithValues = row.filter((item) => item !== 0);

      if (rowWithValues.length === 0) {
        return false;
      }

      for (let i = 0; i < rowWithValues.length; i++) {
        if (rowWithValues[i] === rowWithValues[i + 1]) {
          return true;
        }

        if (
          row.indexOf(rowWithValues[i]) !==
          rowWithValues.indexOf(rowWithValues[i])
        ) {
          return true;
        }
      }
    });
  }

  canMoveRight() {
    this.reverseBoard();

    const permission = this.canMoveLeft();

    this.reverseBoard();

    return permission;
  }

  canMoveUp() {
    this.transposeBoard();

    const permission = this.canMoveLeft();

    this.transposeBoard();

    return permission;
  }

  canMoveDown() {
    this.transposeBoard();
    this.reverseBoard();

    const permission = this.canMoveLeft();

    this.reverseBoard();
    this.transposeBoard();

    return permission;
  }

  canMove() {
    return (
      this.canMoveLeft() ||
      this.canMoveRight() ||
      this.canMoveUp() ||
      this.canMoveDown()
    );
  }

  isGameContinue() {
    if (this.isBoardHas2048()) {
      this.status = 'win';

      return false;
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return false;
    }

    return true;
  }
}

module.exports = Game;
