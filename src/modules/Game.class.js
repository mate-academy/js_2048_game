class Game {
  constructor(initialState = null) {
    this.size = 4;

    this.board =
      initialState ||
      Array(this.size)
        .fill()
        .map(() => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const rowValues = this.board[r].filter(val => val !== 0);
      const newRow = [];

      for (let i = 0; i < rowValues.length; i++) {
        if (i < rowValues.length - 1 && rowValues[i] === rowValues[i + 1]) {
          newRow.push(rowValues[i] * 2);
          this.score += rowValues[i] * 2;
          i++;
          moved = true;
        } else {
          newRow.push(rowValues[i]);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      this.board[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.board.forEach(row => row.reverse());
    this.moveLeft();
    this.board.forEach(row => row.reverse());
  }

  moveUp() {
    this.board = this.transposeBoard();
    this.moveLeft();
    this.board = this.transposeBoard(true);
  }

  moveDown() {
    this.board = this.transposeBoard();
    this.moveRight();
    this.board = this.transposeBoard(true);
  }

  transposeBoard(reverse = false) {
    const transposed = [];

    for (let c = 0; c < this.size; c++) {
      const newRow = [];

      for (let r = 0; r < this.size; r++) {
        newRow.push(this.board[r][c]);
      }

      if (reverse) {
        newRow.reverse();
      }
      transposed.push(newRow);
    }

    return transposed;
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
  }

  restart() {
    this.board = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  checkGameStatus() {
    if (this.isWin()) {
      this.status = 'win';
    } else if (this.isLose()) {
      this.status = 'lose';
    }
  }

  isWin() {
    return this.board.some(row => row.includes(2048));
  }

  isLose() {
    const noEmptyCells = this.board.every(row => row.every(cell => cell !== 0));

    if (noEmptyCells) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size - 1; c++) {
          if (this.board[r][c] === this.board[r][c + 1]) {
            return false;
          }
        }
      }

      for (let c = 0; c < this.size; c++) {
        for (let r = 0; r < this.size - 1; r++) {
          if (this.board[r][c] === this.board[r + 1][c]) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

module.exports = Game;
