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
    this.status = 'idle';
  }

  is2048(cell) {
    if (cell === 2048) {
      this.status = 'win';
    }
  }

  boardIsEmpty() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  addRandomNumber() {
    const boardLength = this.board.length;

    const emptyCells = [];

    for (let row = 0; row < boardLength; row++) {
      for (let col = 0; col < boardLength; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({
            row,
            col,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row: r, col: c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  gameLost() {
    const movesAllowed = [true, true, true, true];

    const currentGame = new Game();

    currentGame.board = JSON.parse(JSON.stringify(this.board));

    movesAllowed[0] = currentGame.moveLeft();
    movesAllowed[1] = currentGame.moveRight();
    movesAllowed[2] = currentGame.moveDown();
    movesAllowed[3] = currentGame.moveUp();

    if (movesAllowed.every((move) => move === false)) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    const prevBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const valuesIsNotZero = row.filter((r) => r !== 0);
      const newRow = [];

      for (let i = 0; i < valuesIsNotZero.length; i++) {
        if (valuesIsNotZero[i] === valuesIsNotZero[i + 1]) {
          const addedCells = valuesIsNotZero[i] * 2;

          newRow.push(addedCells);

          this.score += addedCells;

          this.is2048(addedCells);

          i++;
        } else {
          newRow.push(valuesIsNotZero[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow;
    });

    if (JSON.stringify(this.board) !== prevBoard || this.boardIsEmpty()) {
      return true;
    } else if (
      JSON.stringify(this.board) !== prevBoard ||
      !this.boardIsEmpty()
    ) {
      this.addRandomNumber();

      return true;
    } else {
      return false;
    }
  }
  moveRight() {
    const prevBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();
      const valuesIsNotZero = reversedRow.filter((cell) => cell !== 0);
      const newRow = [];
      const valuesIsNotZeroLength = valuesIsNotZero.length;

      for (let i = 0; i < valuesIsNotZeroLength; i++) {
        if (valuesIsNotZero[i] === valuesIsNotZero[i + 1]) {
          const addedCells = valuesIsNotZero[i] * 2;

          newRow.push(addedCells);
          this.score += addedCells;

          this.is2048(addedCells);
          i++;
        } else {
          newRow.push(valuesIsNotZero[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow.reverse();
    });

    if (JSON.stringify(this.board) !== prevBoard || this.boardIsEmpty()) {
      return true;
    } else if (
      JSON.stringify(this.board) !== prevBoard ||
      !this.boardIsEmpty()
    ) {
      this.addRandomNumber();

      return true;
    } else {
      return false;
    }
  }
  moveUp() {
    const prevBoard = JSON.stringify(this.board);

    const newBoard = [];
    const boardLength = this.board.length;

    for (let i = 0; i < boardLength; i++) {
      newBoard[i] = new Array(boardLength).fill(0);
    }

    for (let col = 0; col < boardLength; col++) {
      const column = [];

      for (let row = 0; row < boardLength; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      const newCol = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          const addedCells = column[i] * 2;

          newCol.push(addedCells);

          this.score += addedCells;

          this.is2048(addedCells);
          i++;
        } else {
          newCol.push(column[i]);
        }
      }

      while (newCol.length < boardLength) {
        newCol.push(0);
      }

      for (let row = 0; row < boardLength; row++) {
        newBoard[row][col] = newCol[row];
      }
    }

    this.board = newBoard;

    if (JSON.stringify(this.board) !== prevBoard || this.boardIsEmpty()) {
      this.addRandomNumber();

      return true;
    } else {
      return false;
    }
  }
  moveDown() {
    const prevBoard = JSON.stringify(this.board);

    const boardLength = this.board.length;
    const newBoard = [];

    for (let i = 0; i < boardLength; i++) {
      newBoard[i] = new Array(boardLength).fill(0);
    }

    for (let col = 0; col < boardLength; col++) {
      const column = [];

      for (let row = 0; row < boardLength; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      const reversedCol = [...column].reverse();
      const newCol = [];

      for (let i = 0; i < reversedCol.length; i++) {
        if (reversedCol[i] === reversedCol[i + 1]) {
          const addedCells = reversedCol[i] * 2;

          newCol.push(addedCells);
          this.score += addedCells;
          this.is2048(addedCells);
          i++;
        } else {
          newCol.push(reversedCol[i]);
        }
      }

      while (newCol.length < boardLength) {
        newCol.push(0);
      }

      newCol.reverse();

      for (let row = 0; row < boardLength; row++) {
        newBoard[row][col] = newCol[row];
      }
    }
    this.board = newBoard;

    if (JSON.stringify(this.board) !== prevBoard || this.boardIsEmpty()) {
      this.addRandomNumber();

      return true;
    } else {
      return false;
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
    this.status = 'playing';
    this.addRandomNumber();
    this.addRandomNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    Object.assign(this, new this.constructor());
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
