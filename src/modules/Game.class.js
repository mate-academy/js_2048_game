'use strict';
class Game {
  constructor(
    cells = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.cells = cells;
    this.restart();
  }

  slideAndMerge(row) {
    const filteredRow = row.filter((val) => val !== 0);
    const newRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        newRow.push(filteredRow[i] * 2);
        this.score += filteredRow[i] * 2;
        i++;
      } else {
        newRow.push(filteredRow[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const rotated = (board) => {
      return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
    };

    let moved = false;

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    for (let i = 0; i < 4; i++) {
      const row =
        direction === 'right' || direction === 'down'
          ? [...this.board[i]].reverse()
          : [...this.board[i]];

      const newRow = this.slideAndMerge(row);

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      if (this.board[i].toString() !== newRow.toString()) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (direction === 'up' || direction === 'down') {
      this.board = rotated(this.board);
    }

    if (moved) {
      this.addRandomTitle();
    }
    this.checkGameOver();
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

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTitle() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTitle();
    this.addRandomTitle();
  }

  restart() {
    this.board = this.cells.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
