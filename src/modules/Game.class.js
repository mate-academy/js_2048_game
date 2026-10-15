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

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => this.slideRow(row));
    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newBoard[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = this.board.map((row) => {
      const reversed = [...row].reverse();

      return this.slideRow(reversed).reverse();
    });

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newBoard[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const move = transposed.map((row) => this.slideRow(row));
    const newBoard = this.transpose(move);

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newBoard[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const move = transposed.map((row) => {
      const reversed = [...row].reverse();

      return this.slideRow(reversed).reverse();
    });
    const newBoard = this.transpose(move);

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== newBoard[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkStatus();
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
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCell.row][randomCell.col] = value;
  }

  slideRow(row) {
    let line = row.filter((num) => num !== 0);

    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        this.score += line[i];
        line[i + 1] = 0;
        i++;
      }
    }

    line = line.filter((num) => num !== 0);

    while (line.length < 4) {
      line.push(0);
    }

    return line;
  }

  transpose(matrix) {
    const emptyTable = [];

    for (let col = 0; col < 4; col++) {
      const newRow = [];

      for (let row = 0; row < 4; row++) {
        newRow.push(matrix[row][col]);
      }
      emptyTable.push(newRow);
    }

    return emptyTable;
  }

  checkStatus() {
    const ifWin = this.board.some((row) => row.includes(2048));

    if (ifWin) {
      this.status = 'win';

      return;
    }

    const hasZero = this.board.some((row) => row.includes(0));

    if (hasZero) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}

export default Game;
