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
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = this.board.toString();

    this.board = this.board.map((row) => {
      return this.slideLeft(row);
    });

    if (this.board.toString() !== boardBeforeMove) {
      this.addRandomNumbers();
    }

    this.checkStatus();
  }

  slideLeft(row) {
    const filteredRow = row.filter((n) => {
      return n > 0;
    });

    for (let i = 0; i < filteredRow.length - 1; i++) {
      const currentNumber = filteredRow[i];

      if (currentNumber === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    const finalRow = filteredRow.filter((n) => {
      return n > 0;
    });

    while (finalRow.length < 4) {
      finalRow.push(0);
    }

    return finalRow;
  }

  transpose(board) {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard.length; col++) {
        newBoard[row][col] = board[col][row];
      }
    }

    return newBoard;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = this.board.toString();

    this.board = this.board.map((row) => {
      return this.slideLeft([...row].reverse()).reverse();
    });

    if (this.board.toString() !== boardBeforeMove) {
      this.addRandomNumbers();
    }

    this.checkStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = this.board.toString();

    this.board = this.transpose(this.board);

    this.board = this.board.map((row) => {
      return this.slideLeft(row);
    });

    this.board = this.transpose(this.board);

    if (this.board.toString() !== boardBeforeMove) {
      this.addRandomNumbers();
    }

    this.checkStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBeforeMove = this.board.toString();

    this.board = this.transpose(this.board);

    this.board = this.board.map((row) => {
      return this.slideLeft([...row].reverse()).reverse();
    });

    this.board = this.transpose(this.board);

    if (this.board.toString() !== boardBeforeMove) {
      this.addRandomNumbers();
    }

    this.checkStatus();
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
    this.addRandomNumbers();
    this.addRandomNumbers();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';

    this.board = this.initialState.map((row) => [...row]);

    this.addRandomNumbers();
    this.addRandomNumbers();
  }

  addRandomNumbers() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let cell = 0; cell < this.board.length; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push([row, cell]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const number = Math.random();

    if (number <= 0.1) {
      this.board[randomCell[0]][randomCell[1]] = 4;
    } else {
      this.board[randomCell[0]][randomCell[1]] = 2;
    }
  }

  checkStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasEmptyCells = this.board.some((row) => row.includes(0));

    if (!hasEmptyCells) {
      let hasMoves = false;

      for (let row = 0; row < this.board.length; row++) {
        for (let col = 0; col < this.board.length - 1; col++) {
          if (this.board[row][col] === this.board[row][col + 1]) {
            hasMoves = true;
          }
        }
      }

      for (let row = 0; row < this.board.length - 1; row++) {
        for (let col = 0; col < this.board.length; col++) {
          if (this.board[row][col] === this.board[row + 1][col]) {
            hasMoves = true;
          }
        }
      }

      if (hasMoves === false) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
