'use strict';

class Game {
  /**
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // deep cloning is required
    this.board = initialState.map((row) => [...row]);
    this.startBoard = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'playing') {
      const copyBoard = [...this.board];

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

      // check on useless move
      if (JSON.stringify(newBoard) !== JSON.stringify(copyBoard)) {
        this.board = newBoard;

        if (this.status === 'playing') {
          this.createNewCellInBoard();
        }

        this.checkWinCell();
        this.checkGameOver();
      }
    }
  }

  moveRight() {
    const copyBoard = [...this.board];

    if (this.status === 'playing') {
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

      // check on useless move
      if (JSON.stringify(newBoard) !== JSON.stringify(copyBoard)) {
        this.board = newBoard;

        if (this.status === 'playing') {
          this.createNewCellInBoard();
        }

        this.checkWinCell();
        this.checkGameOver();
      }
    }
  }

  moveUp() {
    const copyBoard = [...this.board];

    if (this.status === 'playing') {
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

      // check on useless move
      if (JSON.stringify(newBoard) !== JSON.stringify(copyBoard)) {
        this.board = newBoard;

        if (this.status === 'playing') {
          this.createNewCellInBoard();
        }

        this.checkWinCell();
        this.checkGameOver();
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const copyBoard = [...this.board];

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

      // check on useless move
      if (JSON.stringify(newBoard) !== JSON.stringify(copyBoard)) {
        this.board = newBoard;

        if (this.status === 'playing') {
          this.createNewCellInBoard();
        }

        this.checkWinCell();
        this.checkGameOver();
      }
    }
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
    return this.status;
  }

  createNewCellInBoard() {
    const emptyCells = [];
    const board = this.board;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const newCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[newCell.row][newCell.col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * @returns {boolean}
   */
  checkWinCell() {
    const WIN_VALUE = 2048;
    const hasWinCell = this.board.some((row) => {
      return row.some((cell) => cell === WIN_VALUE);
    });

    if (hasWinCell) {
      this.status = 'win';

      return true;
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  checkGameOver() {
    // find 0 in board
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    // search availiable merge in all directions
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        const current = this.board[row][col];

        if (
          col < this.board.length - 1 &&
          current === this.board[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.board.length - 1 &&
          current === this.board[row + 1][col]
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  start() {
    this.status = 'playing';
    this.createNewCellInBoard();
    this.createNewCellInBoard();
  }

  restart() {
    this.status = 'idle';
    this.board = this.startBoard.map((row) => [...row]);
    this.score = 0;
  }
}

module.exports = Game;
