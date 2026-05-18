'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;

    this.initialState = initialState || this.createEmptyBoard();

    this.board = this.cloneBoard(this.initialState);

    this.score = 0;

    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  boardsEqual(board1, board2) {
    return JSON.stringify(board1) === JSON.stringify(board2);
  }

  compress(row) {
    return row.filter((cell) => cell !== 0);
  }

  merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;

        this.score += row[i];

        row[i + 1] = 0;
      }
    }

    return row;
  }

  moveRowLeft(row) {
    let newRow = this.compress(row);

    newRow = this.merge(newRow);

    newRow = this.compress(newRow);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  rotateRight(matrix) {
    return matrix[0].map(
      (_, index) => matrix.map((row) => row[index]).reverse(),
      // eslint-disable-next-line function-paren-newline
    );
  }

  rotateLeft(matrix) {
    return matrix[0].map((_, index) =>
      // eslint-disable-next-line prettier/prettier
      matrix.map((row) => row[row.length - 1 - index]));
  }

  // ======================
  // GETTERS
  // ======================

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  // ======================
  // GAME CONTROL
  // ======================

  start() {
    this.status = 'playing';

    this.score = 0;

    this.board = this.createEmptyBoard();

    this.addRandomTile();

    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  // ======================
  // RANDOM TILE
  // ======================

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row: randomRow, col: randomCol } = emptyCells[randomIndex];

    this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
  }

  // ======================
  // MOVES
  // ======================

  moveLeft() {
    this.move((board) => board.map((row) => this.moveRowLeft(row)));
  }

  moveRight() {
    this.move((board) =>
      // eslint-disable-next-line prettier/prettier
      board.map((row) => this.moveRowLeft([...row].reverse()).reverse()));
  }

  moveUp() {
    this.move((board) => {
      let rotated = this.rotateLeft(board);

      rotated = rotated.map((row) => this.moveRowLeft(row));

      return this.rotateRight(rotated);
    });
  }

  moveDown() {
    this.move((board) => {
      let rotated = this.rotateRight(board);

      rotated = rotated.map((row) => this.moveRowLeft(row));

      return this.rotateLeft(rotated);
    });
  }

  move(callback) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.cloneBoard(this.board);

    this.board = callback(this.board);

    const boardChanged = !this.boardsEqual(oldBoard, this.board);

    if (boardChanged) {
      this.addRandomTile();

      if (this.hasWon()) {
        this.status = 'win';
      }
    }

    if (!this.canMove() && !this.hasWon()) {
      this.status = 'lose';
    }
  }

  hasWon() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          return true;
        }

        if (col < this.size - 1 && current === this.board[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && current === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
