'use strict';
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    this.board = this.board.map((row) => this.slide(row));
    this.postMoveActions();
  }

  moveRight() {
    this.board = this.board.map((row) => this.slide(row.reverse()).reverse());
    this.postMoveActions();
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  slide(row) {
    let arr = row.filter((val) => val);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  postMoveActions() {
    this.addRandomTile();
    this.checkGameOver();
  }

  transposeBoard() {
    this.board = this.board[0].map(
      (_, colIndex) => this.board.map((row) => row[colIndex]),
      // eslint-disable-next-line
    );
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell === 0) {
          emptyCells.push([rIndex, cIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameOver() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
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
}

export default Game;
