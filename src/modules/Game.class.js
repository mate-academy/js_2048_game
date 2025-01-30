'use strict';

class Game {
  size = 4;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.defaultBoard = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveDown() {
    this.move('down');
  }

  moveUp() {
    this.move('up');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.size; i++) {
      let line = [];

      for (let j = 0; j < this.size; j++) {
        let row = i;
        let col = j;

        if (direction === 'right') {
          col = this.size - 1 - j;
        }

        if (direction === 'down') {
          row = this.size - 1 - j;
          col = i;
        }

        if (direction === 'up') {
          row = j;
          col = i;
        }

        if (direction === 'left') {
          row = i;
          col = j;
        }

        const value = this.board[row][col];

        if (value !== 0) {
          line.push(value);
        }
      }

      line = this.combineValues(line);

      for (let j = 0; j < this.size; j++) {
        let row = i;
        let col = j;

        if (direction === 'right') {
          col = this.size - 1 - j;
        }

        if (direction === 'down') {
          row = this.size - 1 - j;
          col = i;
        }

        if (direction === 'up') {
          row = j;
          col = i;
        }

        if (direction === 'left') {
          row = i;
          col = j;
        }

        this.board[row][col] = line[j] || 0;
      }
    }

    if (!this.isBoardEqual(prevBoard, this.board)) {
      this.addRandomNumber();
    }
    this.getStatus();
  }


  combineValues(values) {
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        this.score += values[i];
        values.splice(i + 1, 1);
      }
    }

    while (values.length < this.size) {
      values.push(0);
    }

    return values;
  }

  isBoardEqual(board1, board2) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.status === 'playing') {
      this.canMove();
    }

    return this.status;
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  start() {
    this.status = 'playing';
    this.addRandomNumber();
    this.addRandomNumber();
  }

  restart() {
    this.status = 'idle';
    this.board = this.defaultBoard.map((row) => [...row]);
    this.score = 0;
  }

  addRandomNumber() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [x, y] = emptyCells[randomIndex];

      this.board[x][y] = this.generateRandomNumber();
    }
  }

  generateRandomNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }
}

module.exports = Game;
