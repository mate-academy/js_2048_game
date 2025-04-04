'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
    console.log(this.board);
  }

  moveLeft() {
    const oldBoard = this.board.map(row => [...row]);

    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter(num => num !== 0);
      let newRow = [];

      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          this.score += row[j] * 2;
          j++;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[i] = newRow;
    }

    const hasChanged = oldBoard.some((row, i) => {
      return row.some((cell, j) => cell !== this.board[i][j]);
    });

    if (hasChanged) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldBoard = this.board.map(row => [...row]);

    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter(num => num !== 0);
      let newRow = [];

      for (let j = row.length - 1; j >= 0; j--) {
        if (j > 0 && row[j] === row[j - 1]) {
          newRow.unshift(row[j] * 2);
          this.score += row[j] * 2;
          j--;
        } else {
          newRow.unshift(row[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.board[i] = newRow;
    }

    const hasChanged = oldBoard.some((row, i) => {
      return row.some((cell, j) => cell !== this.board[i][j]);
    });

    if (hasChanged) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const oldBoard = this.board.map(row => [...row]);

    for (let j = 0; j < 4; j++) {
      let column = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j]
      ].filter(num => num !== 0);
      let newColumn = [];

      for (let i = 0; i < column.length; i++) {
        if (i < column.length - 1 && column[i] === column[i + 1]) {
          newColumn.push(column[i] * 2);
          this.score += column[i] * 2;
          i++;
        } else {
          newColumn.push(column[i]);
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    const hasChanged = oldBoard.some((row, i) =>
      row.some((cell, j) => cell !== this.board[i][j])
    );

    if (hasChanged) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldBoard = this.board.map(row => [...row]);

    for (let j = 0; j < 4; j++) {
      let column = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j]
      ].filter(num => num !== 0);
      let newColumn = [];

      for (let i = column.length - 1; i >= 0; i--) {
        if (i > 0 && column[i] === column[i - 1]) {
          newColumn.unshift(column[i] * 2);
          this.score += column[i] * 2;
          i--;
        } else {
          newColumn.unshift(column[i]);
        }
      }

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    const hasChanged = oldBoard.some((row, i) =>
      row.some((cell, j) => cell !== this.board[i][j])
    );

    if (hasChanged) {
      this.addRandomTile();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map(row => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    console.log(this.board);
  }

  restart() {
    this.board = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const newNumber = Math.random() < 0.9 ? 2 : 4;
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }
    if (emptyCells.length === 0) return;
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    this.board[row][col] = newNumber;
  }
}

module.exports = Game;