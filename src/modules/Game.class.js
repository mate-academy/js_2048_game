/* eslint-disable function-paren-newline */
'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4; // Поле 4x4
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // Стани: idle, playing, win, lose
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill(0)
      .map(() => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (row > 0 && this.board[row][col] === this.board[row - 1][col]) {
          return true;
        }

        if (col > 0 && this.board[row][col] === this.board[row][col - 1]) {
          return true;
        }
      }
    }

    return false;
  }

  slideRowLeft(row) {
    const filtered = row.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    return [
      ...filtered.filter((val) => val !== 0),
      ...Array(this.size - filtered.length).fill(0),
    ];
  }

  move(direction) {
    const rotateBoard = (board, times) => {
      // eslint-disable-next-line no-shadow
      let rotated = board;

      for (let i = 0; i < times; i++) {
        rotated = rotated[0].map((_, col) =>
          rotated.map((row) => row[col]).reverse(),
        );
      }

      return rotated;
    };

    let rotated = 0;

    if (direction === 'up') {
      rotated = 1;
    } else if (direction === 'right') {
      rotated = 2;
    } else if (direction === 'down') {
      rotated = 3;
    }

    const rotatedBoard = rotateBoard(this.board, rotated);
    const newBoard = rotatedBoard.map(this.slideRowLeft.bind(this));
    const restoredBoard = rotateBoard(newBoard, 4 - rotated);

    const boardChanged =
      JSON.stringify(this.board) !== JSON.stringify(restoredBoard);

    if (boardChanged) {
      this.board = restoredBoard;
      this.addRandomTile();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return boardChanged;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.start();
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
}

export { Game };
