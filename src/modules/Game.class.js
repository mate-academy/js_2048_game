'use strict';

class Game {
  constructor(initialState = null, onChange = () => {}) {
    this.boardSize = 4;
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.onChange = onChange;

    this.spawnTile();
    this.spawnTile();
  }

  createEmptyBoard() {
    return Array.from({ length: this.boardSize }, () => {
      return Array(this.boardSize).fill(0);
    });
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

  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
  }

  makeMove(direction) {
    if (this.status !== 'playing') return;

    const original = this.serialize(this.board);
    let newBoard = this.copyBoard(this.board);

    if (direction === 'up') newBoard = this.transpose(newBoard);
    if (direction === 'right') newBoard = newBoard.map((row) => row.reverse());

    if (direction === 'down') {
      newBoard = this.transpose(newBoard);
      newBoard = newBoard.map((row) => row.reverse());
    }

    newBoard = newBoard.map((row) => this.slideAndMerge(row));

    if (direction === 'right') newBoard = newBoard.map((row) => row.reverse());
    if (direction === 'up') newBoard = this.transpose(newBoard);

    if (direction === 'down') {
      newBoard = newBoard.map((row) => row.reverse());
      newBoard = this.transpose(newBoard);
    }

    if (this.serialize(newBoard) !== original) {
      this.board = newBoard;
      this.spawnTile();

      // Перевірка на виграш
      if (this.board.flat().includes(2048)) {
        this.status = 'win';
      }

      if (this.isGameOver()) {
        this.status = 'lose';
      }

      this.onChange();
    }
  }

  slideAndMerge(row) {
    const filtered = row.filter((n) => n);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < this.boardSize) {
      merged.push(0);
    }

    return merged;
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  serialize(board) {
    return board.map((row) => row.join(',')).join('|');
  }

  spawnTile() {
    const empty = [];

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
    this.onChange();
  }

  restart() {
    this.start();
  }

  isGameOver() {
    const hasEmpty = this.board.some((row) => row.includes(0));

    if (hasEmpty) return false;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) return false;
      }
    }

    for (let j = 0; j < this.boardSize; j++) {
      for (let i = 0; i < this.boardSize - 1; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) return false;
      }
    }

    return true;
  }
}

export default Game;
