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

  moveLeft() {
    const prevBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const valuesNotZero = row.filter((a) => a !== 0);
      const newRow = [];

      for (let i = 0; i < valuesNotZero.length; i++) {
        if (valuesNotZero[i] === valuesNotZero[i + 1]) {
          const mergedCells = valuesNotZero[i] * 2;

          newRow.push(mergedCells);
          this.score += mergedCells;

          this.checkWin(mergedCells);

          i++;
        } else {
          newRow.push(valuesNotZero[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow;
    });

    if (JSON.stringify(this.board) !== prevBoard || this.isEmptyBoard()) {
      this.addRandomCell();

      return true;
    } else {
      return false;
    }
  }

  moveRight() {
    const prevBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();
      const valuesNotZero = reversedRow.filter((a) => a !== 0);
      const newRow = [];

      for (let i = 0; i < valuesNotZero.length; i++) {
        if (valuesNotZero[i] === valuesNotZero[i + 1]) {
          const mergedCells = valuesNotZero[i] * 2;

          newRow.push(mergedCells);
          this.score += mergedCells;

          this.checkWin(mergedCells);

          i++;
        } else {
          newRow.push(valuesNotZero[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      return newRow.reverse();
    });

    if (JSON.stringify(this.board) !== prevBoard || this.isEmptyBoard()) {
      this.addRandomCell();

      return true;
    } else {
      return false;
    }
  }

  moveUp() {
    const prevBoard = JSON.stringify(this.board);

    const newBoard = [];
    const boardSize = this.board.length;

    for (let i = 0; i < boardSize; i++) {
      newBoard[i] = new Array(boardSize).fill(0);
    }

    for (let col = 0; col < boardSize; col++) {
      const column = [];

      for (let row = 0; row < boardSize; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      const newCol = [];

      for (let i = 0; i < column.length; i++) {
        if (column[i] === column[i + 1]) {
          const mergedCells = column[i] * 2;

          newCol.push(mergedCells);
          this.score += mergedCells;

          this.checkWin(mergedCells);

          i++;
        } else {
          newCol.push(column[i]);
        }
      }

      while (newCol.length < boardSize) {
        newCol.push(0);
      }

      for (let row = 0; row < boardSize; row++) {
        newBoard[row][col] = newCol[row];
      }
    }

    this.board = newBoard;

    if (JSON.stringify(this.board) !== prevBoard || this.isEmptyBoard()) {
      this.addRandomCell();

      return true;
    } else {
      return false;
    }
  }

  moveDown() {
    const prevBoard = JSON.stringify(this.board);

    const newBoard = [];
    const boardSize = this.board.length;

    for (let i = 0; i < boardSize; i++) {
      newBoard[i] = new Array(boardSize).fill(0);
    }

    for (let col = 0; col < boardSize; col++) {
      const column = [];

      for (let row = 0; row < boardSize; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      const reversedCol = [...column].reverse();
      const newCol = [];

      for (let i = 0; i < reversedCol.length; i++) {
        if (reversedCol[i] === reversedCol[i + 1]) {
          const mergedCells = reversedCol[i] * 2;

          newCol.push(mergedCells);
          this.score += mergedCells;

          this.checkWin(mergedCells);

          i++;
        } else {
          newCol.push(reversedCol[i]);
        }
      }

      while (newCol.length < boardSize) {
        newCol.push(0);
      }

      newCol.reverse();

      for (let row = 0; row < boardSize; row++) {
        newBoard[row][col] = newCol[row];
      }
    }

    this.board = newBoard;

    if (JSON.stringify(this.board) !== prevBoard || this.isEmptyBoard()) {
      this.addRandomCell();

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
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    Object.assign(this, new this.constructor());
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomCell() {
    const boardSize = this.board.length;
    const emptyCells = [];

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    const { row: r, col: c } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  isEmptyBoard() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  checkLose() {
    const canMove = [true, true, true, true];

    const tempGame = new Game();

    tempGame.board = JSON.parse(JSON.stringify(this.board));

    canMove[0] = tempGame.moveLeft();
    canMove[1] = tempGame.moveRight();
    canMove[2] = tempGame.moveUp();
    canMove[3] = tempGame.moveDown();

    if (canMove.every((move) => move === false)) {
      this.status = 'lose';
    }
  }

  checkWin(cell) {
    if (cell === 2048) {
      this.status = 'win';
    }
  }
}

module.exports = Game;
