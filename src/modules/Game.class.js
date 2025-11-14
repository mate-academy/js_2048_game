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
   * [0, 0, 0, 0],
   * [0, 0, 0, 0],
   * [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState || defaultBoard;
    this.initialBoard = JSON.parse(JSON.stringify(this.board));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let scoreGained = 0;

    const originalBoardString = JSON.stringify(this.board);

    this.board.forEach((row, rowIndex) => {
      const { newRow, points } = this.processRowLeft(row);

      this.board[rowIndex] = [...newRow];
      scoreGained += points;
    });

    if (JSON.stringify(this.board) === originalBoardString) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();
    this.checkStatus();
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let scoreGained = 0;

    const originalBoardString = JSON.stringify(this.board);

    this.board.forEach((row, rowIndex) => {
      const { newRow, points } = this.processRowLeft([...row].reverse());

      this.board[rowIndex] = [...newRow].reverse();
      scoreGained += points;
    });

    if (JSON.stringify(this.board) === originalBoardString) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();
    this.checkStatus();
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let scoreGained = 0;

    const originalBoardString = JSON.stringify(this.board);

    const transposedBoard = this.transpose(this.board);

    transposedBoard.forEach((row, rowIndex) => {
      const { newRow, points } = this.processRowLeft(row);

      transposedBoard[rowIndex] = newRow;
      scoreGained += points;
    });

    this.board = this.transpose(transposedBoard);

    if (JSON.stringify(this.board) === originalBoardString) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();
    this.checkStatus();
  }

  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let scoreGained = 0;

    const originalBoardString = JSON.stringify(this.board);

    const transposedBoard = this.transpose(this.board);

    transposedBoard.forEach((row, rowIndex) => {
      const { newRow, points } = this.processRowLeft([...row].reverse());

      transposedBoard[rowIndex] = [...newRow].reverse();
      scoreGained += points;
    });

    this.board = this.transpose(transposedBoard);

    if (JSON.stringify(this.board) === originalBoardString) {
      return;
    }

    this.score += scoreGained;
    this.addRandomTile();
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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[index];
    let newValue;

    if (Math.random() >= 0.9) {
      newValue = 4;
    } else {
      newValue = 2;
    }

    this.board[row][col] = newValue;

    return true;
  }

  checkStatus() {
    if (this.status === 'win') {
      return;
    }

    const isWin = this.board.some((row) => {
      return row.some((cell) => cell >= 2048);
    });

    if (isWin) {
      this.status = 'win';

      return;
    }

    if (!isWin && !this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    const isAvailable = this.board.some((row) => {
      return row.some((cell) => cell === 0);
    });

    if (isAvailable) {
      return true;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        // Horizontal
        if (
          j < this.board[i].length - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }

        // Vertical
        if (
          i < this.board.length - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  processRowLeft(row) {
    let points = 0;
    const compressed = row.filter((val) => val !== 0);

    for (let i = 0; i < compressed.length; i++) {
      if (compressed[i] === compressed[i + 1]) {
        compressed[i] *= 2;
        points += compressed[i];
        compressed[i + 1] = 0;
        i++;
      }
    }

    const newRow = compressed.filter((val) => val !== 0);

    while (newRow.length !== 4) {
      newRow.push(0);
    }

    return { newRow, points };
  }

  transpose(boardToTranspose) {
    const board = boardToTranspose || this.board;

    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        newBoard[j][i] = board[i][j];
      }
    }

    return newBoard;
  }
}

export default Game;
