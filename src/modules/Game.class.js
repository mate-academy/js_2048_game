'use strict';

class Game {
  constructor(initialState = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) {
    this.state = {
      board: initialState,
      score: 0,
      status: 'idle',
      isAnimating: false,
    };
  }

  moveLeft() {
    const previousState = JSON.stringify(this.state.board);
    this.state.board = this.state.board.map(row => this.slide(row));
    if (previousState !== JSON.stringify(this.state.board)) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveRight() {
    const previousState = JSON.stringify(this.state.board);
    this.state.board = this.state.board.map(row => this.slide(row.reverse()).reverse());
    if (previousState !== JSON.stringify(this.state.board)) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveUp() {
    const previousState = JSON.stringify(this.state.board);
    this.state.board = this.transpose(this.state.board).map(row => this.slide(row));
    this.state.board = this.transpose(this.state.board);
    if (previousState !== JSON.stringify(this.state.board)) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveDown() {
    const previousState = JSON.stringify(this.state.board);
    this.state.board = this.transpose(this.state.board).map(row => this.slide(row.reverse()).reverse());
    this.state.board = this.transpose(this.state.board);
    if (previousState !== JSON.stringify(this.state.board)) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  slide(row) {
    let arr = row.filter(val => val);
    let missing = 4 - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);

    for (let i = 0; i < 3; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        this.state.score += arr[i];
      }
    }

    arr = arr.filter(val => val);
    missing = 4 - arr.length;
    zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);

    return arr;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      let [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.state.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  getScore() {
    return this.state.score;
  }

  getState() {
    return this.state.board;
  }

  getStatus() {
    return this.state.status;
  }

  start() {
    this.state.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state.board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.state.score = 0;
    this.state.status = 'idle';
    this.start();
  }

  checkGameOver() {
    if (!this.canMove()) {
      this.state.status = 'gameover';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state.board[i][j] === 0) return true;
        if (j < 3 && this.state.board[i][j] === this.state.board[i][j + 1]) return true;
        if (i < 3 && this.state.board[i][j] === this.state.board[i + 1][j]) return true;
      }
    }
    return false;
  }
}

module.exports = Game;
