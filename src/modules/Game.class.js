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
      let row = this.board[r].filter((val) => val !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          row[c + 1] = 0;
          this.score += row[c];
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[r] = row;
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
      let row = [...this.board[r]].reverse();

      row = row.filter((val) => val !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          row[c + 1] = 0;
          this.score += row[c];
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[r] = row.reverse();
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
      let row = transposed[r].filter((val) => val !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          row[c + 1] = 0;
          this.score += row[c];
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      transposed[r] = row;
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
      let row = [...transposed[r]].reverse();

      row = row.filter((val) => val !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          row[c + 1] = 0;
          this.score += row[c];
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      transposed[r] = row.reverse();
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
}

module.exports = Game;
