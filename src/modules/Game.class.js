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
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.addRandomTiles();
    this.addRandomTiles();
    this.updateUI();
  }

  restart() {
    this.score = 0;
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.updateUI();
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

  move(direction) {
    if (this.status !== 'playing' || !this.checkForMove(direction)) {
      return;
    }

    if (direction === 'up' || direction === 'down') {
      this.board = this.transposeBoard(this.board);
    }
    this.slide(direction);
    this.merge(direction);
    this.slide(direction);

    if (direction === 'up' || direction === 'down') {
      this.board = this.transposeBoard(this.board, true);
    }
    this.addRandomTiles();
    this.checkGameStatus();
    this.updateUI();
  }

  checkGameStatus() {
    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    this.board.forEach((row) => {
      if (row.some((cell) => cell === 2048)) {
        this.status = 'win';
      }
    });
  }

  canMove() {
    return (
      this.checkForMove('up') ||
      this.checkForMove('down') ||
      this.checkForMove('left') ||
      this.checkForMove('right')
    );
  }

  checkForMove(direction) {
    const boardToCheck =
      direction === 'up' || direction === 'down'
        ? this.transposeBoard(this.board)
        : this.board;

    for (const row of boardToCheck) {
      for (let i = 0; i < row.length - 1; i++) {
        if (direction === 'down' || direction === 'right') {
          if (
            (row[i] !== 0 && row[i + 1] === 0) ||
            (row[i] !== 0 && row[i] === row[i + 1])
          ) {
            return true;
          }
        } else if (direction === 'up' || direction === 'left') {
          if (
            (row[i + 1] !== 0 && row[i] === 0) ||
            (row[i + 1] !== 0 && row[i + 1] === row[i])
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  slide(direction) {
    this.board = this.board.map((row) => {
      const nonZeroTiles = row.filter((cell) => cell !== 0);

      while (nonZeroTiles.length < row.length) {
        if (direction === 'left' || direction === 'up') {
          nonZeroTiles.push(0);
        } else {
          nonZeroTiles.unshift(0);
        }
      }

      return nonZeroTiles;
    });
  }

  merge(direction) {
    const isReverseble = direction === 'right' || direction === 'down';

    this.board.forEach((row) => {
      for (
        let i = isReverseble ? row.length - 1 : 0;
        isReverseble ? i >= 0 : i < row.length;
        isReverseble ? i-- : i++
      ) {
        const nextI = isReverseble ? i - 1 : i + 1;

        if (row[i] === row[nextI]) {
          row[i] *= 2;
          row[nextI] = 0;
          this.score += row[i];
        }
      }
    });
  }

  transposeBoard(target, back = false) {
    const result = [[], [], [], []];

    for (let row = 0; row < target.length; row++) {
      for (let col = 0; col < target.length; col++) {
        if (!back) {
          result[col][row] = target[row][col];
        } else {
          result[row][col] = target[col][row];
        }
      }
    }

    return result;
  }

  updateUI(forNewTile = false) {
    const rows = document.querySelectorAll('.field-row');

    [...rows].forEach((row, rowIndex) => {
      [...row.cells].forEach((cell, columnIndex) => {
        const boardCell = this.board[rowIndex][columnIndex];

        cell.textContent = boardCell === 0 ? '' : boardCell;
        cell.className = `field-cell field-cell--${boardCell}`;
      });
    });
  }

  addRandomTiles() {
    const emptyCells = [];

    this.board.forEach((row1, rowIndex) => {
      row1.forEach((cell, columnIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;
  }
}
module.exports = Game;
