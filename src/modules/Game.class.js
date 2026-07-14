'use strict';

class Game {
  constructor(initialState) {
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : defaultBoard;

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.checkGameStatus();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[targetCell.r][targetCell.c] = value;
  }

  mergeLine(line) {
    const nonZeros = line.filter((n) => n !== 0);
    const newLine = [];
    let scoreAdded = 0;

    for (let i = 0; i < nonZeros.length; i++) {
      if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
        const mergedVal = nonZeros[i] * 2;

        newLine.push(mergedVal);
        scoreAdded += mergedVal;
        i++;
      } else {
        newLine.push(nonZeros[i]);
      }
    }

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return { newLine, scoreAdded };
  }

  transpose(grid) {
    const result = [];

    for (let c = 0; c < 4; c++) {
      result[c] = [];

      for (let r = 0; r < 4; r++) {
        result[c].push(grid[r][c]);
      }
    }

    return result;
  }

  areGridsDifferent(grid1, grid2) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid1[r][c] !== grid2[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  handleMoveResult(newBoard, scoreAdded) {
    if (this.areGridsDifferent(this.board, newBoard)) {
      this.board = newBoard;
      this.score += scoreAdded;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = [];
    let totalScoreAdded = 0;

    for (let r = 0; r < 4; r++) {
      const { newLine, scoreAdded } = this.mergeLine(this.board[r]);

      newBoard.push(newLine);
      totalScoreAdded += scoreAdded;
    }

    this.handleMoveResult(newBoard, totalScoreAdded);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = [];
    let totalScoreAdded = 0;

    for (let r = 0; r < 4; r++) {
      const reversed = this.board[r].slice().reverse();
      const { newLine, scoreAdded } = this.mergeLine(reversed);

      newBoard.push(newLine.reverse());
      totalScoreAdded += scoreAdded;
    }

    this.handleMoveResult(newBoard, totalScoreAdded);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const newTransposed = [];
    let totalScoreAdded = 0;

    for (let r = 0; r < 4; r++) {
      const { newLine, scoreAdded } = this.mergeLine(transposed[r]);

      newTransposed.push(newLine);
      totalScoreAdded += scoreAdded;
    }

    const newBoard = this.transpose(newTransposed);

    this.handleMoveResult(newBoard, totalScoreAdded);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const newTransposed = [];
    let totalScoreAdded = 0;

    for (let r = 0; r < 4; r++) {
      const reversed = transposed[r].slice().reverse();
      const { newLine, scoreAdded } = this.mergeLine(reversed);

      newTransposed.push(newLine.reverse());
      totalScoreAdded += scoreAdded;
    }

    const newBoard = this.transpose(newTransposed);

    this.handleMoveResult(newBoard, totalScoreAdded);
  }

  hasAvailableMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] >= 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
