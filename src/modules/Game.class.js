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
    // eslint-disable-next-line no-console
    const initialBoardState = initialState
      ? initialState.map((line) => [...line])
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

    this.initialBoard = initialBoardState;
    this.board = JSON.parse(JSON.stringify(initialBoardState));

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let boardChanged = false;
    const newBoard = [];

    for (const row of this.board) {
      const newRow = this._processRow(row);

      newBoard.push(newRow);

      if (row.join(',') !== newRow.join(',')) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();
    }
  }

  moveRight() {
    let boardChanged = false;
    const newBoard = [];

    for (const row of this.board) {
      const originalRow = [...row];
      const newRow = this._processRow(originalRow.reverse()).reverse();

      newBoard.push(newRow);

      if (row.join(',') !== newRow.join(',')) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.addRandomTile();
    }
  }

  moveUp() {
    let boardChanged = false;
    const boardTransposed = this._transposeBoard(this.board);
    const newBoard = [];

    for (const row of boardTransposed) {
      const newRow = this._processRow(row);

      newBoard.push(newRow);

      if (row.join(',') !== newRow.join(',')) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = this._transposeBoard(newBoard);
      this.addRandomTile();
    }
  }

  moveDown() {
    let boardChanged = false;
    const boardTransposed = this._transposeBoard(this.board);
    const newBoard = [];

    for (const row of boardTransposed) {
      const originalRow = [...row];
      const newRow = this._processRow(originalRow.reverse()).reverse();

      newBoard.push(newRow);

      if (row.join(',') !== newRow.join(',')) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = this._transposeBoard(newBoard);
      this.addRandomTile();
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
    if (this._hasWon()) {
      return 'win';
    }

    if (!this._hasMovesLeft()) {
      return 'lose';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
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
  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      // Linha
      for (let j = 0; j < 4; j++) {
        // Coluna
        if (this.board[i][j] === 0) {
          emptyCells.push({ line: i, column: j });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.line][randomCell.column] = newValue;
    }
  }

  _processRow(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow.splice(i + 1, 1);
      }
    }

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  _transposeBoard(board) {
    const newBoard = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j].push(board[i][j]);
      }
    }

    return newBoard;
  }

  _hasWon() {
    return this.board.flat().includes(2048);
  }

  _hasMovesLeft() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
