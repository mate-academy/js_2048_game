/* eslint-disable function-paren-newline */
'use strict';

export default class Game {
  constructor(initialState) {
    this.board =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let tileRow = 0; tileRow < 4; tileRow++) {
      for (let tileCol = 0; tileCol < 4; tileCol++) {
        if (this.board[tileRow][tileCol] === 0) {
          emptyCells.push([tileRow, tileCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    this.board = this.board.map((row) => this.combineRow(row));
    this.finalizeMove();
  }

  moveRight() {
    this.board = this.board.map((row) =>
      this.combineRow(row.reverse()).reverse(),
    );
    this.finalizeMove();
  }

  moveUp() {
    this.board = this.transpose(this.board).map((row) => this.combineRow(row));
    this.board = this.transpose(this.board);
    this.finalizeMove();
  }

  moveDown() {
    this.board = this.transpose(this.board).map((row) =>
      this.combineRow(row.reverse()).reverse(),
    );
    this.board = this.transpose(this.board);
    this.finalizeMove();
  }

  combineRow(row) {
    const nonZero = row.filter((cell) => cell !== 0);
    const combined = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        combined.push(nonZero[i] * 2);
        this.score += nonZero[i] * 2;
        i++;
      } else {
        combined.push(nonZero[i]);
      }
    }

    this.setBestScore(this.score);
    this.updateScoreDisplay();

    return [...combined, ...Array(4 - combined.length).fill(0)];
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  finalizeMove() {
    if (this.checkWin()) {
      this.status = 'win';

      return;
    }

    if (this.checkLose()) {
      this.status = 'lose';

      return;
    }

    this.addRandomTile();
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (
          (col < 3 && value === this.board[row][col + 1]) ||
          (row < 3 && value === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  updateScoreDisplay() {
    const scoreElement = document.querySelector('.current-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  getBestScore() {
    return localStorage.getItem('bestScore') || 0;
  }

  setBestScore(score) {
    const bestScore = this.getBestScore();

    if (score > bestScore) {
      localStorage.setItem('bestScore', score);
      this.updateBestScoreDisplay();
    }
  }

  updateBestScoreDisplay() {
    const bestScoreElement = document.querySelector('.best-score');

    if (bestScoreElement) {
      bestScoreElement.textContent = this.getBestScore();
    }
  }
}
