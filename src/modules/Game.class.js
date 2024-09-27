'use strict';

class Game {
  constructor(initialState) {
    this.INITIAL_STATE = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState || this.INITIAL_STATE;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.board.forEach((row, rowIndex) => {
      const originalRow = [...row];
      const newRow = this.mergeRow(row);

      this.board[rowIndex] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        moved = true;
      }
    });

    if (moved) {
      this.addTile();
    }
    this.checkGameStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    this.board.forEach((row, rowIndex) => {
      const originalRow = [...row];
      const newRow = this.mergeRow(row.reverse()).reverse();

      this.board[rowIndex] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        moved = true;
      }
    });

    if (moved) {
      this.addTile();
    }
    this.checkGameStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const transposed = this.transpose(this.board);

    transposed.forEach((row, rowIndex) => {
      const originalRow = [...row];
      const newRow = this.mergeRow(row);

      transposed[rowIndex] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        moved = true;
      }
    });

    if (moved) {
      this.board = this.transpose(transposed);
      this.addTile();
    }
    this.checkGameStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const transposed = this.transpose(this.board);

    transposed.forEach((row, rowIndex) => {
      const originalRow = [...row];
      const newRow = this.mergeRow(row.reverse()).reverse();

      transposed[rowIndex] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
        moved = true;
      }
    });

    if (moved) {
      this.board = this.transpose(transposed);
      this.addTile();
    }
    this.checkGameStatus();
  }

  mergeRow(row) {
    const newRow = row.filter((num) => num);
    const mergedRow = [];
    let i = 0;

    while (i < newRow.length) {
      if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
        mergedRow.push(newRow[i] * 2);
        this.score += newRow[i] * 2;
        i += 2;
      } else {
        mergedRow.push(newRow[i]);
        i++;
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  addTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addTile();
      this.addTile();
    }
  }

  restart() {
    this.board = this.INITIAL_STATE.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().every((cell) => cell !== 0)) {
      const movesAvailable = this.board.some((row, rowIndex) => {
        return row.some((cell, colIndex) => {
          return (
            (colIndex < 3 && cell === row[colIndex + 1]) ||
            (rowIndex < 3 && cell === this.board[rowIndex + 1][colIndex])
          );
        });
      });

      if (!movesAvailable) {
        this.status = 'lose';
      }
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
}

module.exports = Game;
