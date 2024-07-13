/* eslint-disable function-paren-newline */
/* eslint-disable no-shadow */
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
    this.initialState = initialState;
    this.board = JSON.parse(JSON.stringify(initialState));
    this.score = 0;
    this.status = 'idle'; // Possible values: 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  move(direction) {
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    switch (direction) {
      case 'left':
        this.board = this.moveLeftHelper(this.board);
        break;
      case 'right':
        this.board = this.moveRightHelper(this.board);
        break;
      case 'up':
        this.board = this.moveUpHelper(this.board);
        break;
      case 'down':
        this.board = this.moveDownHelper(this.board);
        break;
      default:
        return;
    }

    // Check if board has changed
    if (JSON.stringify(originalBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkGameOver()) {
        this.status = 'lose';
      }
    }
  }

  moveLeftHelper(board) {
    return board.map((row) => this.slideTiles(row));
  }

  moveRightHelper(board) {
    return board.map((row) => this.slideTiles(row.reverse()).reverse());
  }

  moveUpHelper(board) {
    const rotatedBoard = this.rotateBoard(board);
    const movedBoard = rotatedBoard.map((row) => this.slideTiles(row));

    return this.rotateBoard(movedBoard, true);
  }

  moveDownHelper(board) {
    const rotatedBoard = this.rotateBoard(board, true);
    const movedBoard = rotatedBoard.map((row) => this.slideTiles(row));

    return this.rotateBoard(movedBoard);
  }

  slideTiles(row) {
    const newRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow.splice(i + 1, 1);
        newRow.push(0);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  rotateBoard(board, clockwise = false) {
    const rotated = board.map((row, rowIndex) =>
      row.map((val, colIndex) =>
        clockwise
          ? board[3 - colIndex][rowIndex]
          : board[colIndex][3 - rowIndex],
      ),
    );

    return rotated;
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkGameOver() {
    const directions = ['left', 'right', 'up', 'down'];

    return !directions.some((direction) => {
      const tempGame = new Game(this.board);

      tempGame.move(direction);

      return JSON.stringify(tempGame.board) !== JSON.stringify(this.board);
    });
  }
}

// Export Game class for use in browser
window.Game = Game;
