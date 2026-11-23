'use strict';
/* eslint-disable indent */

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? this.copyState(initialState)
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
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
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomCell();
    this.addRandomCell();

    this.status = 'playing';
  }

  restart() {
    this.state = this.copyState(this.initialState);
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

    const oldState = this.copyState(this.state);
    let totalScore = 0;

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        const result = this.processLine(this.state[row]);

        this.state[row] = result.line;
        totalScore += result.score;
      }
    }

    if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const reversed = [...this.state[row]].reverse();
        const result = this.processLine(reversed);

        this.state[row] = result.line.reverse();
        totalScore += result.score;
      }
    }

    if (direction === 'up') {
      const transposed = this.transpose(this.state);

      for (let row = 0; row < 4; row++) {
        const result = this.processLine(transposed[row]);

        transposed[row] = result.line;
        totalScore += result.score;
      }

      this.state = this.transpose(transposed);
    }

    if (direction === 'down') {
      const transposed = this.transpose(this.state);

      for (let row = 0; row < 4; row++) {
        const reversed = [...transposed[row]].reverse();
        const result = this.processLine(reversed);

        transposed[row] = result.line.reverse();
        totalScore += result.score;
      }

      this.state = this.transpose(transposed);
    }

    if (this.statesEqual(oldState, this.state)) {
      return;
    }

    this.score += totalScore;

    this.addRandomCell();

    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  processLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];
    let score = 0;

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const merged = numbers[i] * 2;

        result.push(merged);
        score += merged;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return {
      line: result,
      score,
    };
  }

  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];

    this.state[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  statesEqual(first, second) {
    return JSON.stringify(first) === JSON.stringify(second);
  }
}

module.exports = Game;
