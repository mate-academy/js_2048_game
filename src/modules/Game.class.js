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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = this.createEmptyBoard();

    if (this.isValidState(initialState)) {
      this.board = this.cloneBoard(initialState);
    }
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const result = this.moveBoardLeft(this.board);

    if (!result.changed) {
      return;
    }

    this.board = result.board;
    this.score += result.gainedScore;

    this.addRandomTile();
    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const reversedBoard = this.reverseRows(this.board);
    const result = this.moveBoardLeft(reversedBoard);

    if (!result.changed) {
      return;
    }

    this.board = this.reverseRows(result.board);
    this.score += result.gainedScore;

    this.addRandomTile();
    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposedBoard = this.transpose(this.board);
    const result = this.moveBoardLeft(transposedBoard);

    if (!result.changed) {
      return;
    }

    this.board = this.transpose(result.board);
    this.score += result.gainedScore;

    this.addRandomTile();
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposedBoard = this.transpose(this.board);
    const reversedBoard = this.reverseRows(transposedBoard);

    const result = this.moveBoardLeft(reversedBoard);

    if (!result.changed) {
      return;
    }

    const restoredBoard = this.reverseRows(result.board);

    this.board = this.transpose(restoredBoard);
    this.score += result.gainedScore;

    this.addRandomTile();
    this.updateStatus();
  }

  reverseRows(board) {
    return board.map((row) => [...row].reverse());
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
    return this.cloneBoard(this.board);
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
    if (this.status !== 'idle') {
      return;
    }

    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();

    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  isValidState(state) {
    if (!Array.isArray(state) || state.length !== this.size) {
      return false;
    }

    return state.every(
      (row) =>
        Array.isArray(row) &&
        row.length === this.size &&
        row.every((cell) => Number.isInteger(cell) && cell >= 0),
    );
  }

  getEmptyCells() {
    const cells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (empty.length === 0) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;

    return true;
  }

  has2048() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  hasMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c];

        if (c + 1 < this.size && this.board[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < this.size && this.board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  boardsEqual(a, b) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  compressRowLeft(row) {
    const filterd = row.filter((cell) => cell !== 0);
    const result = [];

    let gainedScore = 0;

    for (let i = 0; i < filterd.length; i++) {
      if (filterd[i] === filterd[i + 1]) {
        const mergedValue = filterd[i] * 2;

        result.push(mergedValue);
        gainedScore += mergedValue;
        i++;
      } else {
        result.push(filterd[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return {
      row: result,
      gainedScore,
    };
  }

  moveBoardLeft(board) {
    const newBoard = [];
    let totalScore = 0;

    for (const row of board) {
      const result = this.compressRowLeft(row);

      newBoard.push(result.row);
      totalScore += result.gainedScore;
    }

    return {
      board: newBoard,
      gainedScore: totalScore,
      changed: !this.boardsEqual(board, newBoard),
    };
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }
}

export default Game;
