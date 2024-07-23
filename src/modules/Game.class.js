'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
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
    this.board = this.generateNewTile(this.generateNewTile(this.board));
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
  }

  generateNewTile(board) {
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }

    return board;
  }

  moveLeft() {
    this.board = this.combine(this.slide(this.board));
    this.board = this.generateNewTile(this.board);
  }

  moveRight() {
    this.board = this.reverse(this.board);
    this.moveLeft();
    this.board = this.reverse(this.board);
  }

  moveUp() {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
  }

  slide(board) {
    return board.map((row) => {
      const arr = row.filter((val) => val);
      const missing = 4 - arr.length;
      const zeros = Array(missing).fill(0);

      return arr.concat(zeros);
    });
  }

  combine(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length - 1; j++) {
        if (board[i][j] === board[i][j + 1] && board[i][j] !== 0) {
          board[i][j] *= 2;
          board[i][j + 1] = 0;
          this.score += board[i][j];
        }
      }
    }

    return board;
  }

  reverse(board) {
    return board.map((row) => row.reverse());
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }
}
// control comment to commit

module.exports = Game;
