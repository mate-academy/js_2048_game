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
    const merged = [];
    let scoreIncrement = 0;

    // eslint-disable-next-line no-param-reassign
    row = row.filter((val) => val !== 0);

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        scoreIncrement += row[i] * 2;
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    this.score += scoreIncrement;

    return merged;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const rotateBoard = (board) =>
      board[0].map((_, col) => board.map((row) => row[col]));
    let moved = false;

    if (['up', 'down'].includes(direction)) {
      this.board = rotateBoard(this.board);
    }

    this.board = this.board.map((row) => {
      const processedRow =
        direction === 'right' || direction === 'down'
          ? [...row].reverse()
          : [...row];
      const newRow = this.slideAndMerge(processedRow);

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      if (JSON.stringify(row) !== JSON.stringify(newRow)) {
        moved = true;
      }

      return newRow;
    });

    if (['up', 'down'].includes(direction)) {
      this.board = rotateBoard(this.board);
    }

    if (moved) {
      this.addRandomTile();
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
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    return this.board.some(
      (row, i) =>
        row.includes(0) ||
        row.some(
          (val, j) =>
            (j < 3 && val === row[j + 1]) ||
            (i < 3 && val === this.board[i + 1][j]),
        ),
    );
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyCells.length) {
      const { rowIndex, colIndex } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.cells.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
