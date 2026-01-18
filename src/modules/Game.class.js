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
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    this.board = this.board.map((row) => {
      const rowCopy = [...row];
      const newRow = this.processRow(row);

      for (let i = 0; i < rowCopy.length; i++) {
        if (rowCopy[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      return newRow;
    });

    if (moved) {
      if (this.has2048()) {
        this.status = 'win';

        return true;
      }
      this.randomCells();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    this.board = this.board.map((row) => {
      const rowCopy = [...row];
      const ReverseRow = [...row].reverse();
      const newRow = this.processRow(ReverseRow).reverse();

      for (let i = 0; i < rowCopy.length; i++) {
        if (rowCopy[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      return newRow;
    });

    if (moved) {
      if (this.has2048()) {
        this.status = 'win';

        return true;
      }
      this.randomCells();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let transformedBoard = this.transformColToRow(this.board);

    transformedBoard = transformedBoard.map((row) => {
      const rowCopy = [...row];
      const newRow = this.processRow(row);

      for (let i = 0; i < rowCopy.length; i++) {
        if (rowCopy[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      return newRow;
    });

    this.board = this.transformColToRow(transformedBoard);

    if (moved) {
      if (this.has2048()) {
        this.status = 'win';

        return true;
      }
      this.randomCells();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }
  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let transformedBoard = this.transformColToRow(this.board);

    transformedBoard = transformedBoard.map((row) => {
      const rowCopy = [...row];
      const ReverseRow = [...row].reverse();
      const newRow = this.processRow(ReverseRow).reverse();

      for (let i = 0; i < rowCopy.length; i++) {
        if (rowCopy[i] !== newRow[i]) {
          moved = true;
          break;
        }
      }

      return newRow;
    });

    this.board = this.transformColToRow(transformedBoard);

    if (moved) {
      if (this.has2048()) {
        this.status = 'win';

        return true;
      }
      this.randomCells();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

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

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.randomCells();
    this.randomCells();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.randomCells();
    this.randomCells();
  }

  randomCells() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colindex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colindex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const rowBoard = emptyCells[randomIndex].row;
    const colBoard = emptyCells[randomIndex].col;
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[rowBoard][colBoard] = value;
  }

  processRow(row) {
    const result = [];
    const filteredRow = row.filter((n) => n !== 0);

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        const merge = filteredRow[i] * 2;

        result.push(merge);
        this.score += merge;
        i++;
      } else {
        result.push(filteredRow[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  transformColToRow(board) {
    return board[0].map((col, colIndex) => {
      return board.map((row) => row[colIndex]);
    });
  }

  has2048() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  // setBoard(board) {
  //   this.board = board;
  //   this.status = 'playing';
  // }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = this.board[r][c];

        if (v === 0) {
          return true;
        }

        if (c < 3 && v === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && v === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
