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
    this.score = 0;
    this.history = [];
  }
  saveState() {
    if (!this.board) {
      return;
    }

    this.history.push({
      board: this.board.map((row) => [...row]),
      score: this.score,
    });
  }

  moveLeft() {
    this.saveState();

    let hasChanged = false;

    this.board = this.board.map((row) => {
      const rowWithoutZeros = row.filter((cell) => cell !== 0);

      for (let i = 0; i < rowWithoutZeros.length; i++) {
        if (rowWithoutZeros[i] === rowWithoutZeros[i + 1]) {
          rowWithoutZeros[i] *= 2;
          rowWithoutZeros[i + 1] = 0;
          this.score += rowWithoutZeros[i];
          hasChanged = true;
        }
      }

      const rowAfterMove = rowWithoutZeros.filter((cell) => cell !== 0);

      while (rowAfterMove.length < 4) {
        rowAfterMove.push(0);
      }

      if (rowAfterMove.join('') !== row.join('')) {
        hasChanged = true;
      }

      return rowAfterMove;
    });

    if (hasChanged) {
      this.addRandomCell();
    }
  }
  moveRight() {
    this.saveState();

    let hasChanged = false;

    this.board = this.board.map((row) => {
      const rowWithoutZeros = row.filter((cell) => cell !== 0);

      for (let i = rowWithoutZeros.length - 1; i >= 0; i--) {
        if (rowWithoutZeros[i] === rowWithoutZeros[i - 1]) {
          rowWithoutZeros[i] *= 2;
          rowWithoutZeros[i - 1] = 0;
          this.score += rowWithoutZeros[i];
          hasChanged = true;
        }
      }

      const rowAfterMove = rowWithoutZeros.filter((cell) => cell !== 0);

      while (rowAfterMove.length < 4) {
        rowAfterMove.unshift(0);
      }

      if (rowAfterMove.join('') !== row.join('')) {
        hasChanged = true;
      }

      return rowAfterMove;
    });

    if (hasChanged) {
      this.addRandomCell();
    }
  }
  moveUp() {
    this.saveState();

    let hasChanged = false;
    let transonatedBoard = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        transonatedBoard[col][row] = this.board[row][col];
      }
    }

    transonatedBoard = transonatedBoard.map((row) => {
      const rowWithoutZeros = row.filter((cell) => cell !== 0);

      for (let i = 0; i < rowWithoutZeros.length; i++) {
        if (rowWithoutZeros[i - 1] === rowWithoutZeros[i]) {
          rowWithoutZeros[i - 1] *= 2;
          rowWithoutZeros[i] = 0;
          this.score += rowWithoutZeros[i - 1];
          hasChanged = true;
        }
      }

      const rowAfterMove = rowWithoutZeros.filter((cell) => cell !== 0);

      while (rowAfterMove.length < 4) {
        rowAfterMove.push(0);
      }

      if (rowAfterMove.join('') !== row.join('')) {
        hasChanged = true;
      }

      return rowAfterMove;
    });

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = transonatedBoard[col][row];
      }
    }

    if (hasChanged) {
      this.addRandomCell();
    }
  }

  moveDown() {
    this.saveState();

    let hasChanged = false;
    let transonatedBoard = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        transonatedBoard[col][row] = this.board[row][col];
      }
    }

    transonatedBoard = transonatedBoard.map((row) => {
      const rowWithoutZeros = row.filter((cell) => cell !== 0);

      for (let i = rowWithoutZeros.length - 1; i >= 0; i--) {
        if (rowWithoutZeros[i] === rowWithoutZeros[i - 1]) {
          rowWithoutZeros[i] *= 2;
          rowWithoutZeros[i - 1] = 0;
          this.score += rowWithoutZeros[i];
          hasChanged = true;
        }
      }

      const rowAfterMove = rowWithoutZeros.filter((cell) => cell !== 0);

      while (rowAfterMove.length < 4) {
        rowAfterMove.unshift(0);
      }

      if (rowAfterMove.join('') !== row.join('')) {
        hasChanged = true;
      }

      return rowAfterMove;
    });

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = transonatedBoard[col][row];
      }
    }

    if (hasChanged) {
      this.addRandomCell();
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
    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    if (this.board.some((row) => row.includes(0))) {
      return 'playing';
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (
          (row < 3 && cell === this.board[row + 1][col]) ||
          (col < 3 && cell === this.board[row][col + 1])
        ) {
          return 'playing';
        }
      }
    }

    return 'lose';
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
    this.addRandomCell();
    this.addRandomCell();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  addRandomCell() {
    const emtyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emtyCells.push({ row, col });
        }
      }
    }

    if (emtyCells.length > 0) {
      const randomCell = Math.floor(Math.random() * emtyCells.length);
      const { row, col } = emtyCells[randomCell];
      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = newValue;
    }
  }

  undo() {
    if (this.history.length > 0) {
      const lastState = this.history.pop();

      this.board = lastState.board;
      this.score = lastState.score;
    } else {
      alert('Undo is not available');
    }
  }
}

module.exports = Game;
