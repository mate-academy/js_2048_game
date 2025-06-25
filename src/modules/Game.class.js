'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';
    this.size = 4;
    this.board = initialState || this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  copyBoard() {
    return this.board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.copyBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.status = 'playing';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomI = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomI];
    const val = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = val;
  }

  compressAndMergeRow(row) {
    const origRow = [...row];
    let mergedScore = 0;

    const compressed = row.filter((value) => value !== 0);

    for (let i = 0; i < compressed.length - 1; i++) {
      if (compressed[i] === compressed[i + 1]) {
        compressed[i] *= 2;
        compressed[i + 1] = 0;
        mergedScore += compressed[i];
        i++;
      }
    }

    const result = compressed.filter((value) => value !== 0);

    while (result.length < 4) {
      result.push(0);
    }

    const moved = !result.every((val, idx) => val === origRow[idx]);

    return {
      newRow: result,
      mergedScore,
      moved,
    };
  }

  getColumn(colIdx) {
    return this.board.map((row) => row[colIdx]);
  }

  setColumn(colIdx, column) {
    for (let row = 0; row < this.size; row++) {
      this.board[row][colIdx] = column[row];
    }
  }

  move(direction) {
    let moved = false;
    let totalMergedScore = 0;

    if (direction === 'right' || direction === 'left') {
      for (let row = 0; row < this.size; row++) {
        let currentRow = this.board[row];

        if (direction === 'right') {
          currentRow = currentRow.slice().reverse();
        }

        const {
          newRow,
          mergedScore,
          moved: rowMoved,
        } = this.compressAndMergeRow(currentRow);

        this.board[row] = direction === 'right' ? newRow.reverse() : newRow;

        if (rowMoved) {
          moved = true;
          totalMergedScore += mergedScore;
        }
      }
    }

    if (direction === 'up' || direction === 'down') {
      for (let col = 0; col < this.size; col++) {
        let column = this.getColumn(col);

        if (direction === 'down') {
          column = column.slice().reverse();
        }

        const {
          newRow,
          mergedScore,
          moved: colMoved,
        } = this.compressAndMergeRow(column);
        const finalCol = direction === 'down' ? newRow.reverse() : newRow;

        this.setColumn(col, finalCol);

        if (colMoved) {
          moved = true;
          totalMergedScore += mergedScore;
        }
      }
    }

    if (moved) {
      this.score += totalMergedScore;
      this.addRandomTile();

      if (this.board.some((row) => row.includes(2048))) {
        this.status = 'win';
      } else if (!this.canMove()) {
        this.status = 'lose';
      }
    }
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

  restart() {
    this.start();
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
export default Game;
