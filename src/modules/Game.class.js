'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  areArraysEqual(arr1, arr2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr1[i][j] !== arr2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevBoard = this.state.map((row) => [...row]);

    if (direction === 'left') {
      this.state = this.state.map((row) => this.mergeRow(row));
    } else if (direction === 'right') {
      let cS = this.state;

      //  cS - currentState
      cS = this.state.map((row) => this.mergeRow([...row].reverse()).reverse());

      this.state = cS;
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        const column = [];

        for (let row = 0; row < 4; row++) {
          column.push(this.state[row][col]);
        }

        const mergedColumn = this.mergeRow(column);

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = mergedColumn[row];
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        const column = [];

        for (let row = 3; row >= 0; row--) {
          column.push(this.state[row][col]);
        }

        const mergedColumn = this.mergeRow(column);

        for (let row = 3; row >= 0; row--) {
          this.state[row][col] = mergedColumn[3 - row];
        }
      }
    }

    if (!this.areArraysEqual(this.state, prevBoard)) {
      this.addRandomBlock();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }

  mergeRow(row) {
    const numbers = row.filter((value) => value !== 0);

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] *= 2;
        this.score += numbers[i];
        numbers.splice(i + 1, 1);

        if (numbers[i] === 2048) {
          this.status = 'win';
        }
      }
    }

    while (numbers.length < 4) {
      numbers.push(0);
    }

    return numbers;
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.state[i][j] === this.state[i][j + 1] ||
          this.state[j][i] === this.state[j + 1][i]
        ) {
          return true;
        }
      }
    }

    return false;
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

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      this.addRandomBlock();
      this.addRandomBlock();
    }
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    this.state = this.initialState.map((row) => [...row]);
  }

  addRandomBlock() {
    const emptyBlocks = [];

    for (let r = 0; r < 4; r++) {
      for (let bl = 0; bl < 4; bl++) {
        if (this.state[r][bl] === 0) {
          emptyBlocks.push([r, bl]);
        }
      }
    }

    if (emptyBlocks.length === 0) {
      return;
    }

    const [row, block] =
      emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];

    this.state[row][block] = Math.random() < 0.9 ? 2 : 4;
  }
}

module.exports = Game;
