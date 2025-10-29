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

  #initialBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  size = 4;
  #winScrore = 2048;

  constructor(initialState) {
    if (initialState) {
      this.#initialBoard = structuredClone(initialState);
    }
    this.board = structuredClone(this.#initialBoard);
    this.score = 0;
  }

  moveLeft() {
    this.#move('left');
  }
  moveRight() {
    this.#move('right');
  }
  moveUp() {
    this.#move('up');
  }
  moveDown() {
    this.#move('down');
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
    if (this.#checkInitial()) {
      return 'idle';
    }

    if (this.#checkWin()) {
      return 'win';
    }

    if (this.#checkLose()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.#initGame();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = structuredClone(this.#initialBoard);
    this.score = 0;
    this.#initGame();
  }

  #checkInitial() {
    return JSON.stringify(this.board) === JSON.stringify(this.#initialBoard);
  }

  #checkWin() {
    return this.board.flat().includes(this.#winScrore);
  }

  #checkLose() {
    return !this.#canMakeMove();
  }

  #canMakeMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (
          (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  #initGame() {
    this.#pushNumber();
    this.#pushNumber();
  }

  #move(direction) {
    let newBoard = structuredClone(this.board);
    let isMoved = false;

    if (direction === 'up') {
      newBoard = this.#transpose(newBoard);
    } else if (direction === 'down') {
      newBoard = this.#transpose(newBoard).map((row) => row.reverse());
    } else if (direction === 'right') {
      newBoard = newBoard.map((row) => row.reverse());
    }

    // console.log('newBoard', structuredClone(newBoard));

    for (let i = 0; i < this.size; i++) {
      const row = newBoard[i].filter((v) => v !== 0);
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      // console.log('newRow', structuredClone(newRow));

      if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) {
        isMoved = true;
        newBoard[i] = newRow;
      }
    }

    if (direction === 'up') {
      newBoard = this.#transpose(newBoard);
    } else if (direction === 'down') {
      newBoard = this.#transpose(newBoard.map((row) => row.reverse()));
    } else if (direction === 'right') {
      newBoard = newBoard.map((row) => row.reverse());
    }
    this.board = newBoard;

    if (this.#findEmptyRows().length !== 0 && isMoved) {
      this.#pushNumber();
    }
  }

  #transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  #pushNumber() {
    const indexRow = this.#generateRandomIndex(
      0,
      this.size,
      this.#findEmptyRows(),
    );
    const indexCell = this.#generateRandomIndex(
      0,
      this.size,
      this.#findEmptyCells(indexRow),
    );
    const value = this.#generateRandomNumber();

    this.board[indexRow][indexCell] = value;
  }

  #generateRandomIndex(min, max, excluded = []) {
    let num;

    do {
      num = Math.floor(Math.random() * (max - min)) + min;
    } while (!excluded.includes(num));

    return num;
  }

  #findEmptyRows() {
    return this.board
      .map((row, index) => {
        if (row.some((cell) => cell === 0)) {
          return index;
        }
      })
      .filter((el) => el !== undefined);
  }

  #findEmptyCells(indexRow) {
    return this.board[indexRow]
      .map((cell, index) => {
        if (cell === 0) {
          return index;
        }
      })
      .filter((el) => el !== undefined);
  }

  #generateRandomNumber() {
    const min = 0;
    const max = 100;
    // From 0% to 100%
    const randomInRange = Math.floor(Math.random() * (max - min + 1)) + min;

    if (randomInRange <= 10) {
      return 4;
    }

    return 2;
  }
}

module.exports = Game;
