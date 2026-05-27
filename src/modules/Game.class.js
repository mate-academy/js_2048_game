'use strict';

class Game {
  constructor(initialState) {
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
      this.status = 'playing';
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
      this.status = 'idle';
    }
    this.score = 0;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  slideLeft(row) {
    let arr = row.filter((val) => val !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
        i++;
      }
    }
    arr = arr.filter((val) => val !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const oldRow = [...this.board[i]];
      const newRow = this.slideLeft(this.board[i]);

      this.board[i] = newRow;

      if (oldRow.some((val, idx) => val !== newRow[idx])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.board.forEach((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();
    this.board.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.board.forEach((row) => row.reverse());
    this.transpose();

    return moved;
  }

  transpose() {
    this.board = this.board[0].map((_, colIdx) => {
      return this.board.map((row) => row[colIdx]);
    });
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

  checkGameStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
