'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.restart();
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

    if (this.isEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.updateStatus();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  isEmpty() {
    return this.board.every((row) => row.every((value) => value === 0));
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

    const index = Math.floor(Math.random() * emptyCells.length);
    const [emptyRow, emptyCol] = emptyCells[index];

    this.board[emptyRow][emptyCol] = Math.random() < 0.9 ? 2 : 4;
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const merged = numbers[index] * 2;

        result.push(merged);
        this.score += merged;
        index++;
      } else {
        result.push(numbers[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previous = JSON.stringify(this.board);

    for (let index = 0; index < 4; index++) {
      let line;

      if (direction === 'left' || direction === 'right') {
        line = [...this.board[index]];
      } else {
        line = this.board.map((row) => row[index]);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      const merged = this.mergeLine(line);

      if (direction === 'right' || direction === 'down') {
        merged.reverse();
      }

      for (let position = 0; position < 4; position++) {
        if (direction === 'left' || direction === 'right') {
          this.board[index][position] = merged[position];
        } else {
          this.board[position][index] = merged[position];
        }
      }
    }

    if (JSON.stringify(this.board) !== previous) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  updateStatus() {
    if (this.board.some((row) => row.some((value) => value >= 2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      this.status = 'playing';

      return;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const value = this.board[rowIndex][colIndex];

        if (
          (rowIndex < 3 && value === this.board[rowIndex + 1][colIndex]) ||
          (colIndex < 3 && value === this.board[rowIndex][colIndex + 1])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
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
}

module.exports = Game;
