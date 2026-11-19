'use strict';

class Game {
  constructor(initialState = []) {
    this.initialState = initialState.length
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.getState();
    const newBoard = this.getState();

    for (let i = 0; i < 4; i++) {
      let line;

      if (direction === 'left' || direction === 'right') {
        line = [...newBoard[i]];
      } else {
        line = newBoard.map((row) => row[i]);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      line = line.filter((value) => value !== 0);

      for (let j = 0; j < line.length - 1; j++) {
        if (line[j] === line[j + 1]) {
          line[j] *= 2;
          this.score += line[j];
          line.splice(j + 1, 1);
        }
      }

      while (line.length < 4) {
        line.push(0);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      for (let j = 0; j < 4; j++) {
        if (direction === 'left' || direction === 'right') {
          newBoard[i][j] = line[j];
        } else {
          newBoard[j][i] = line[j];
        }
      }
    }

    if (JSON.stringify(previousBoard) === JSON.stringify(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];

    this.board[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
  }

  hasMoves() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const value = this.board[rowIndex][colIndex];

        if (value === 0) {
          return true;
        }

        if (colIndex < 3 && value === this.board[rowIndex][colIndex + 1]) {
          return true;
        }

        if (rowIndex < 3 && value === this.board[rowIndex + 1][colIndex]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
