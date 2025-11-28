'use strict';
class Game {
  deepCopy(arr) {
    return arr.map((row) => row.slice());
  }

  constructor(initialState) {
    const EMPTY_BOARD = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState
      ? this.deepCopy(initialState)
      : this.deepCopy(EMPTY_BOARD);

    this.initialBoardState = this.deepCopy(this.board);

    this.score = 0;

    this.status = 'idle';

    this.isStarted = false;
  }

  generateNewTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newValue = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = newValue;

    return true;
  }

  processLine(line) {
    let scoreChange = 0;

    let filteredLine = line.filter((value) => value !== 0);

    for (let i = 0; i < filteredLine.length - 1; i++) {
      if (filteredLine[i] === filteredLine[i + 1]) {
        filteredLine[i] *= 2;
        scoreChange += filteredLine[i];

        filteredLine[i + 1] = 0;
      }
    }

    filteredLine = filteredLine.filter((value) => value !== 0);

    while (filteredLine.length < 4) {
      filteredLine.push(0);
    }

    return { newLine: filteredLine, scoreChange };
  }

  transposeBoard(board) {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[r][c] = board[c][r];
      }
    }

    return newBoard;
  }

  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        const current = this.board[r][c];

        if (c < 3 && this.board[r][c + 1] === current) {
          return true;
        }

        if (r < 3 && this.board[r + 1][c] === current) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    if (this.checkWin()) {
      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = this.deepCopy(this.board);
    let boardChanged = false;

    for (let row = 0; row < 4; row++) {
      const { newLine, scoreChange } = this.processLine(this.board[row]);

      this.score += scoreChange;

      if (oldBoard[row].join(',') !== newLine.join(',')) {
        boardChanged = true;
      }

      this.board[row] = newLine;
    }

    if (boardChanged) {
      this.generateNewTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = this.deepCopy(this.board);
    let boardChanged = false;

    for (let row = 0; row < 4; row++) {
      const line = this.board[row];

      line.reverse();

      const { newLine, scoreChange } = this.processLine(line);

      this.score += scoreChange;

      newLine.reverse();

      if (oldBoard[row].join(',') !== newLine.join(',')) {
        boardChanged = true;
      }

      this.board[row] = newLine;
    }

    if (boardChanged) {
      this.generateNewTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = this.deepCopy(this.board);
    let boardChanged = false;

    this.board = this.transposeBoard(this.board);

    for (let row = 0; row < 4; row++) {
      const { newLine, scoreChange } = this.processLine(this.board[row]);

      this.score += scoreChange;
      this.board[row] = newLine;
    }

    this.board = this.transposeBoard(this.board);

    for (let r = 0; r < 4; r++) {
      if (oldBoard[r].join(',') !== this.board[r].join(',')) {
        boardChanged = true;
        break;
      }
    }

    if (boardChanged) {
      this.generateNewTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = this.deepCopy(this.board);
    let boardChanged = false;

    this.board = this.transposeBoard(this.board);

    for (let row = 0; row < 4; row++) {
      const line = this.board[row];

      line.reverse();

      const { newLine, scoreChange } = this.processLine(line);

      this.score += scoreChange;
      newLine.reverse();
      this.board[row] = newLine;
    }

    this.board = this.transposeBoard(this.board);

    for (let r = 0; r < 4; r++) {
      if (oldBoard[r].join(',') !== this.board[r].join(',')) {
        boardChanged = true;
        break;
      }
    }

    if (boardChanged) {
      this.generateNewTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.generateNewTile();
    this.generateNewTile();

    this.status = 'playing';

    this.isStarted = true;
  }

  restart() {
    this.board = this.initialBoardState.map((row) => row.slice());

    this.score = 0;

    this.status = 'idle';

    this.start();
  }
}

module.exports = Game;
