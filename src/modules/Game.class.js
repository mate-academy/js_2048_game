'use strict';

export class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  slide(row) {
    const arr = row.filter((val) => val !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr.splice(i + 1, 1);
      }
    }

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  reverseBoard() {
    this.board = this.board.map((row) => [...row].reverse());
  }

  transposeBoard() {
    this.board = this.board[0].map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    let hasChanged = false;

    for (let r = 0; r < 4; r++) {
      const oldRow = [...this.board[r]];

      this.board[r] = this.slide(this.board[r]);

      if (JSON.stringify(oldRow) !== JSON.stringify(this.board[r])) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }
    this.updateStatus();

    return hasChanged;
  }

  moveRight() {
    this.reverseBoard();

    const moved = this.moveLeft();

    this.reverseBoard();
    this.updateStatus();

    return moved;
  }

  moveUp() {
    this.transposeBoard();

    const moved = this.moveLeft();

    this.transposeBoard();
    this.updateStatus();

    return moved;
  }

  moveDown() {
    this.transposeBoard();
    this.reverseBoard();

    const moved = this.moveLeft();

    this.reverseBoard();
    this.transposeBoard();
    this.updateStatus();

    return moved;
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

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }
}
