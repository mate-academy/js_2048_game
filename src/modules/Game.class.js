'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.isBoardEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';

    if (this.isBoardEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.updateStatus();
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldState = JSON.stringify(this.state);

    if (direction === 'left' || direction === 'right') {
      this.moveHorizontal(direction);
    } else {
      this.moveVertical(direction);
    }

    const changed = oldState !== JSON.stringify(this.state);

    if (!changed) {
      return false;
    }

    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveHorizontal(direction) {
    this.state = this.state.map((row) => {
      let line = [...row];

      if (direction === 'right') {
        line.reverse();
      }

      line = this.mergeLine(line);

      if (direction === 'right') {
        line.reverse();
      }

      return line;
    });
  }

  moveVertical(direction) {
    for (let col = 0; col < 4; col++) {
      let line = [];

      for (let row = 0; row < 4; row++) {
        line.push(this.state[row][col]);
      }

      if (direction === 'down') {
        line.reverse();
      }

      line = this.mergeLine(line);

      if (direction === 'down') {
        line.reverse();
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = line[row];
      }
    }
  }

  mergeLine(line) {
    const values = line.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const mergedValue = values[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        i++;
      } else {
        result.push(values[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  isBoardEmpty() {
    return this.state.every((row) => row.every((cell) => cell === 0));
  }

  has2048() {
    return this.state.some((row) => row.some((cell) => cell >= 2048));
  }

  hasAvailableMoves() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.state[r][c];

        if (
          (r < 3 && current === this.state[r + 1][c]) ||
          (c < 3 && current === this.state[r][c + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
