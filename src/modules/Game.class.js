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
    this.board = initialState;
    this.startBoard = initialState;
    this.score = 0;
  }

  moveLeft() {
    const newBoard = new Array(this.board.length)
      .fill(null)
      .map(() => new Array(this.board.length).fill(0));

    this.board.forEach((row, rowIndex) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      let insertIndex = 0;

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          newBoard[rowIndex][insertIndex] = filteredRow[i] * 2;
          this.addScore(filteredRow[i] * 2);

          i++;
        } else {
          newBoard[rowIndex][insertIndex] = filteredRow[i];
        }
        insertIndex++;
      }
    });

    this.board = newBoard;
  }

  moveRight() {
    const newBoard = new Array(this.board.length)
      .fill(null)
      .map(() => new Array(this.board.length).fill(0));

    this.board.forEach((row, rowIndex) => {
      let insertIndex = this.board.length - 1;
      const filteredRow = row.filter((cell) => cell !== 0);

      for (let i = filteredRow.length - 1; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          newBoard[rowIndex][insertIndex] = filteredRow[i] * 2;
          this.addScore(filteredRow[i] * 2);

          i--;
        } else {
          newBoard[rowIndex][insertIndex] = filteredRow[i];
        }
        insertIndex--;
      }
    });

    this.board = newBoard;
  }

  moveUp() {
    const newBoard = new Array(this.board.length)
      .fill(null)
      .map(() => new Array(this.board.length).fill(0));

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const newCol = [];
      let insertIndex = 0;

      for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
        newCol.push(this.board[colIndex][rowIndex]);
      }

      const filteredCol = newCol.filter((cell) => cell !== 0);

      for (let i = 0; i < filteredCol.length; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          newBoard[insertIndex][rowIndex] = filteredCol[i] * 2;
          this.addScore(filteredCol[i] * 2);

          i++;
        } else {
          newBoard[insertIndex][rowIndex] = filteredCol[i];
        }
        insertIndex++;
      }
    }

    this.board = newBoard;
  }

  moveDown() {
    const newBoard = new Array(this.board.length)
      .fill(null)
      .map(() => new Array(this.board.length).fill(0));

    for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      const newCol = [];
      let insertIndex = this.board.length - 1;

      for (let colIndex = 0; colIndex < this.board.length; colIndex++) {
        newCol.push(this.board[colIndex][rowIndex]);
      }

      const filteredCol = newCol.filter((cell) => cell !== 0);

      for (let i = filteredCol.length - 1; i >= 0; i--) {
        if (filteredCol[i] === filteredCol[i - 1]) {
          newBoard[insertIndex][rowIndex] = filteredCol[i] * 2;
          this.addScore(filteredCol[i] * 2);

          i--;
        } else {
          newBoard[insertIndex][rowIndex] = filteredCol[i];
        }
        insertIndex--;
      }
    }

    this.board = newBoard;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  addScore(value) {
    this.score += value;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return [...this.board];
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
    switch (true) {
      case this.isBoardEpmty(): {
        return 'idle';
      }

      case this.hasBoardWinCell(2048): {
        return 'win';
      }

      case this.hasBoardEmptySpace(): {
        return 'playing';
      }

      case this.checkGameOver(): {
        return 'lose';
      }
    }
  }

  isBoardEpmty() {
    return this.board.every((row) => {
      return row.every((cell) => cell === 0);
    });
  }

  hasBoardEmptySpace() {
    return this.board.some((row) => {
      return row.some((cell) => cell === 0);
    });
  }

  hasBoardWinCell(value) {
    return this.board.some((row) => {
      return row.some((cell) => cell === value);
    });
  }

  checkGameOver() {
    const board = this.board;

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        const current = board[row][col];

        if (col < this.board.length - 1 && current === board[row][col + 1]) {
          return false;
        }

        if (row < this.board.length - 1 && current === board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
  /**
   * Starts the game.
   */
  start() {
    this.createNewCellInBoard();
    this.createNewCellInBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.startBoard;
    this.score = 0;
  }

  createNewCellInBoard() {
    const emptyCells = [];
    const board = this.board;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ col, row });
        }
      }
    }

    const newCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[newCell.row][newCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
