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
    this.state = this.state.map((row) => [...row]);
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    // const prevBoard = this.state.map((row) => [...row]);

    if (direction === 'left') {
      this.state = this.state.map((row) => this.mergeRow(row));
    }

    // if (this.state !== prevBoard) {
    //   this.addRandomBlock();
    // }
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

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
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
