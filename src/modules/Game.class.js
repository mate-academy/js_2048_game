'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
    }

    if (!initialState) {
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.board = this.createEmptyBoard();
      this.score = 0;
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.reverse(), true);
  }

  moveUp() {
    this.moveColumns((col) => col);
  }

  moveDown() {
    this.moveColumns((col) => col.reverse(), true);
  }

  move(transformFn, reverse = false) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (const row of this.board) {
      const transformed = transformFn(row.slice());
      const result = this.compress(transformed);
      let newRow = result.newRow;
      const gainedScore = result.gainedScore;
      const rowMoved = result.rowMoved;

      if (reverse) {
        newRow = newRow.reverse();
      }
      newBoard.push(newRow);
      this.score += gainedScore;
      moved = moved || rowMoved;
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveColumns(transformFn, reverse = false) {
    const transposed = this.transpose(this.board);

    this.board = this.transpose(
      transposed.map((col) => {
        const transformed = transformFn(col.slice());
        const result = this.compress(transformed);
        let newRow = result.newRow;
        const gainedScore = result.gainedScore;

        if (reverse) {
          newRow = newRow.reverse();
        }
        this.score += gainedScore;

        return newRow;
      }),
    );
    this.addRandomTile();
    this.updateStatus();
  }

  compress(row) {
    const nonZero = row.filter((n) => n !== 0);
    const newRow = [];
    let i = 0;
    let moved = false;
    let gainedScore = 0;

    while (i < nonZero.length) {
      if (nonZero[i] === nonZero[i + 1]) {
        newRow.push(nonZero[i] * 2);
        gainedScore += nonZero[i] * 2;
        i += 2;
      } else {
        newRow.push(nonZero[i]);
        i++;
      }
    }

    while (newRow.length < this.size) {
      newRow.push(0);
    }
    moved = JSON.stringify(row) !== JSON.stringify(newRow);

    return { newRow, gainedScore, rowMoved: moved };
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let randomY = 0; randomY < this.size; randomY++) {
      for (let randomX = 0; randomX < this.size; randomX++) {
        if (this.board[randomY][randomX] === 0) {
          emptyCells.push([randomY, randomX]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [y, x] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[y][x] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.hasValidMoves()) {
      this.status = 'lose';
    }
  }

  hasValidMoves() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === 0) {
          return true;
        }

        if (x < this.size - 1 && this.board[y][x] === this.board[y][x + 1]) {
          return true;
        }

        if (y < this.size - 1 && this.board[y][x] === this.board[y + 1][x]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
