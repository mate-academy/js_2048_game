'use strict';
class Game {
  initialBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState) {
    this.size = 4;
    this.initialState = initialState;

    this.board = initialState
      ? structuredClone(initialState)
      : structuredClone(this.initialBoard);
    this.score = 0;
    this.status = 'start';
    this.hasStarted = false;
  }
  addRandom() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return false;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  processRow(row) {
    let numbers = row.filter((n) => n > 0);

    for (let k = numbers.length - 1; k > 0; k--) {
      if (numbers[k] === numbers[k - 1]) {
        numbers[k] *= 2;
        numbers[k - 1] = 0;
        this.score += numbers[k];
        k--;
      }
    }

    numbers = numbers.filter((n) => n > 0);

    while (numbers.length < this.size) {
      numbers.unshift(0);
    }

    return numbers;
  }

  moveColumns(data) {
    const result = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        result[i][j] = data[j][i];
      }
    }

    return result;
  }

  start() {
    if (this.status === 'playing' || this.hasStarted === true) {
      return;
    }

    this.addRandom();
    this.addRandom();

    this.status = 'playing';
    this.hasStarted = true;
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }

  moveLeft() {
    let hasMoved = false;

    for (let i = 0; i < this.size; i++) {
      const currentRow = this.board[i].slice();
      const reversedRow = [...currentRow].reverse();
      const newReversedRow = this.processRow(reversedRow);
      const newRow = newReversedRow.reverse();

      if (currentRow.toString() !== newRow.toString()) {
        hasMoved = true;
      }
      this.board[i] = newRow;
    }

    if (hasMoved) {
      this.addRandom();
    }

    this.getScore();

    return hasMoved;
  }

  moveRight() {
    let hasMoved = false;

    for (let i = 0; i < this.size; i++) {
      const currentRow = this.board[i].slice();
      const newRow = this.processRow(currentRow);

      if (currentRow.toString() !== newRow.toString()) {
        hasMoved = true;
      }
      this.board[i] = newRow;
    }

    if (hasMoved) {
      this.addRandom();
    }

    this.getScore();

    return hasMoved;
  }

  moveUp() {
    const hasMoved = false;

    this.board = this.moveColumns(this.board);
    this.moveLeft();
    this.board = this.moveColumns(this.board);
    this.getScore();

    if (hasMoved) {
      this.hasStarted = true;
      this.status = 'playing';
    }

    return hasMoved;
  }

  moveDown() {
    const hasMoved = false;

    this.board = this.moveColumns(this.board);
    this.moveRight();
    this.board = this.moveColumns(this.board);
    this.getScore();

    if (hasMoved) {
      this.hasStarted = true;
      this.status = 'playing';
    }

    return hasMoved;
  }

  checkWinOrLose() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  restart() {
    this.board = structuredClone(this.initialState || this.initialBoard);
    this.score = 0;
    this.status = 'start';
    this.hasStarted = false;

    return this.getState();
  }
}

export default Game;
/* module.exports = Game; */
