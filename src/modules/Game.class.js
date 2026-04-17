'use strict';

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
    console.log(initialState);

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.compressAndMerge(this.board[r]);
    }

    if (prevState !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.compressAndMerge(
        [...this.board[r]].reverse(),
      ).reverse();
    }

    if (prevState !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    const transposed = this.transpose();

    for (let r = 0; r < 4; r++) {
      transposed[r] = this.compressAndMerge(transposed[r]);
    }

    const newBoard = this.transpose(transposed);

    if (prevState !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.addRandomTile();
      this.getStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.board);

    const transposed = this.transpose();

    for (let r = 0; r < 4; r++) {
      transposed[r] = this.compressAndMerge(
        [...transposed[r]].reverse(),
      ).reverse();
    }

    const newBoard = this.transpose(transposed);

    if (prevState !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.addRandomTile();
      this.getStatus();
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
    return {
      board: this.board,
      score: this.getScore(),
      status: this.getStatus(),
    };
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
    if (this.doesBoardHas2048()) {
      this.status = 'win';

      return this.status;
    }

    if (!this.hasMoves() && this.isBoardFull()) {
      this.status = 'lose';

      return this.status;
    }

    this.status = 'playing';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'playing') {
      throw new Error('Game is already in progress');
    }

    this.status = 'playing';

    const isBoardEmpty = this.board.every((row) => {
      return row.every((cell) => cell === 0);
    });

    if (isBoardEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.status = 'idle';
    this.score = 0;
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push({ r: rowIndex, c: colIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const valueGenerated = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.r][randomCell.c] = valueGenerated;
  }

  transpose(board = this.board) {
    if (!board || !board[0]) {
      return [];
    }

    return board[0].map((_, cInd) => board.map((row) => row[cInd]));
  }

  hasMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c + 1 < 4 && this.board[r][c + 1] === current) {
          return true;
        }

        if (r + 1 < 4 && this.board[r + 1][c] === current) {
          return true;
        }
      }
    }

    return false;
  }

  compressAndMerge(row) {
    let filtered = row.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;

        this.score += filtered[i];
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  doesBoardHas2048() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardFull() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 0) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
