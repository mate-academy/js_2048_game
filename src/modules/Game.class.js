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
  board;
  status;
  score;

  constructor(initialState) {
    this.board = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    for (let row = 0; row < 16; row += 4) {
      const cellValues = [
        this.board[row],
        this.board[row + 1],
        this.board[row + 2],
        this.board[row + 3],
      ];

      this.moveCells(cellValues, 0, 4, 'asc');

      this.mergeCells(cellValues);

      this.moveCells(cellValues, 0, 4, 'asc');

      this.board[row] = cellValues[0];
      this.board[row + 1] = cellValues[1];
      this.board[row + 2] = cellValues[2];
      this.board[row + 3] = cellValues[3];
    }
  }

  moveRight() {
    for (let row = 0; row < 16; row += 4) {
      const cellValues = [
        this.board[row],
        this.board[row + 1],
        this.board[row + 2],
        this.board[row + 3],
      ];

      this.moveCells(cellValues, 4, -1, 'desc');

      this.mergeCells(cellValues);

      this.moveCells(cellValues, 4, -1, 'desc');

      this.board[row] = cellValues[0];
      this.board[row + 1] = cellValues[1];
      this.board[row + 2] = cellValues[2];
      this.board[row + 3] = cellValues[3];
    }
  }

  moveUp() {
    for (let column = 0; column < 4; column++) {
      const cellValues = [
        this.board[column],
        this.board[column + 4],
        this.board[column + 8],
        this.board[column + 12],
      ];

      this.moveCells(cellValues, 0, 4, 'asc');

      this.mergeCells(cellValues);

      this.moveCells(cellValues, 0, 4, 'asc');

      this.board[column] = cellValues[0];
      this.board[column + 4] = cellValues[1];
      this.board[column + 8] = cellValues[2];
      this.board[column + 12] = cellValues[3];
    }
  }

  moveDown() {
    for (let column = 0; column < 4; column++) {
      const cellValues = [
        this.board[column],
        this.board[column + 4],
        this.board[column + 8],
        this.board[column + 12],
      ];

      this.moveCells(cellValues, 4, -1, 'desc');

      this.mergeCells(cellValues);

      this.moveCells(cellValues, 4, -1, 'desc');

      this.board[column] = cellValues[0];
      this.board[column + 4] = cellValues[1];
      this.board[column + 8] = cellValues[2];
      this.board[column + 12] = cellValues[3];
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
    const initialRange = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const initialBoard = [];
    let numbersInBoard = 0;
    let cell = 0;

    do {
      const probability = Math.min(0.1 + cell * 0.05, 0.8);

      if (Math.random() < probability && numbersInBoard < 2) {
        initialBoard[cell] = this.getRandomElement(initialRange);
        numbersInBoard++;
      } else {
        initialBoard[cell] = 0;
      }
      cell++;
    } while (cell < 16);

    this.status = 'playing';

    return initialBoard;
  }

  restart() {
    this.start();
    this.score = 0;
  }

  getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
  }

  getNewCell() {
    const initialRange = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const selectedValue = this.getRandomElement(initialRange);
    let success = false;

    do {
      const randomIndex = Math.floor(Math.random() * this.board.length);

      if (this.board[randomIndex] === 0) {
        this.board[randomIndex] = selectedValue;
        success = true;
      }
    } while (success === false);
  }

  checkIfWon() {
    return this.board.some((cell) => cell === 2048);
  }

  checkIfMoved(boardBeforeMove) {
    for (let i = 0; i < this.board.length; i++) {
      if (boardBeforeMove[i] !== this.board[i]) {
        return true;
      }
    }

    return false;
  }

  checkIfLose() {
    if (this.board.some((cellValue) => cellValue === 0)) {
      return false;
    }

    for (let column = 0; column < 4; column++) {
      const cellValues = [
        this.board[column],
        this.board[column + 4],
        this.board[column + 8],
        this.board[column + 12],
      ];

      for (let i = 0; i < 2; i++) {
        if (cellValues[i] === cellValues[i + 1]) {
          return false;
        }
      }
    }

    for (let row = 0; row < 16; row += 4) {
      const cellValues = [
        this.board[row],
        this.board[row + 1],
        this.board[row + 2],
        this.board[row + 3],
      ];

      for (let i = 0; i < 2; i++) {
        if (cellValues[i] === cellValues[i + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  moveCells(cellValues, start, end, way) {
    const step = way === 'asc' ? 1 : -1;

    for (let i = start; i !== end; i += step) {
      if (cellValues[i] === 0) {
        for (let j = i + step; j !== end; j += step) {
          if (cellValues[j] !== 0) {
            cellValues[i] = cellValues[j];
            cellValues[j] = 0;
            break;
          }
        }
      }
    }
  }

  mergeCells(cellValues) {
    for (let i = 0; i < 3; i++) {
      if (cellValues[i] !== 0 && cellValues[i] === cellValues[i + 1]) {
        cellValues[i] *= 2;
        cellValues[i + 1] = 0;
        this.score += cellValues[i];
      }
    }
  }
}

module.exports = Game;
