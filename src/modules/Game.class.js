'use strict';

export default class Game {
  constructor(initialState) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle';
  }

  isPlaying() {
    return this.status === 'playing';
  }

  processRow(row) {
    const newRow = row.filter((num) => num !== 0);
    const result = [];

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        const mergedValue = newRow[i] * 2;

        result.push(mergedValue);
        i += 1;
        this.score += mergedValue;
      } else {
        result.push(newRow[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  checkWin() {
    if (this.board.some(row => row.includes(2048))) {
      this.status = 'win';
    }
  }

  checkLose() {
    const hasEmpty = this.board.some(row => row.includes(0));

    if (hasEmpty) return;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (col < 3 && current === this.board[row][col + 1]) return;
        if (row < 3 && current === this.board[row + 1][col]) return;
      }
    }

    this.status = 'lose';
  }

  applyMove(newBoard) {
    const changed = JSON.stringify(newBoard) !== JSON.stringify(this.board);

    if (!changed) return;

    this.board = newBoard;
    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  moveLeft() {
    if (!this.isPlaying()) return;

    const newBoard = this.board.map(row => this.processRow(row));
    this.applyMove(newBoard);
  }

  moveRight() {
    if (!this.isPlaying()) return;

    const newBoard = this.board.map(row => {
      const reversed = [...row].reverse();
      return this.processRow(reversed).reverse();
    });

    this.applyMove(newBoard);
  }

  transpose(matrix) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];
      for (let row = 0; row < 4; row++) {
        result[col][row] = matrix[row][col];
      }
    }

    return result;
  }

  moveUp() {
    if (!this.isPlaying()) return;

    const transposed = this.transpose(this.board);
    const moved = transposed.map(row => this.processRow(row));

    this.applyMove(this.transpose(moved));
  }

  moveDown() {
    if (!this.isPlaying()) return;

    const transposed = this.transpose(this.board);

    const moved = transposed.map(row => {
      const reversed = [...row].reverse();
      return this.processRow(reversed).reverse();
    });

    this.applyMove(this.transpose(moved));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map(row => [...row]);
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (!empty.length) return;

    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
} 