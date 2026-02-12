'use strict';

export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();
  }

  // Створюємо порожню дошку
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  // Фіксоване встановлення дошки (для тестів)
  setBoard(newBoard) {
    this.board = newBoard.map((row) => [...row]);
    this.updateStatus();
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Додаємо плитку 2 або 4 на випадкове порожнє місце
  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  // Рухи
  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let row = this.board[r].filter((n) => n !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
        }
      }

      row = row.filter((n) => n !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (row.toString() !== this.board[r].toString()) {
        moved = true;
      }

      this.board[r] = row;
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    this.reflectHorizontally();
    this.moveLeft();
    this.reflectHorizontally();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  reflectHorizontally() {
    this.board = this.board.map((row) => row.slice().reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, c) => this.board.map((r) => r[c]));
  }

  // Перевірка статусу гри
  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const movesLeft = this.board.flat().includes(0) || this.canMerge();

    this.status = movesLeft ? 'playing' : 'lose';
  }

  // Перевірка можливості об'єднати плитки
  canMerge() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (this.board[c][r] === this.board[c + 1][r]) {
          return true;
        }
      }
    }

    return false;
  }
}
