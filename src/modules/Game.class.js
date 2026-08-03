'use strict';

const SIZE = 4;

class Game {
  constructor(
    initialState = Array.from({ length: SIZE }, () => Array(SIZE).fill(0)),
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.pendingScore = 0;
  }

  moveLeft() {
    this.pendingScore = 0;
    this.makeMove(this.state.map((row) => this.mergeLine(row)));
  }

  moveRight() {
    this.pendingScore = 0;

    this.makeMove(
      this.state.map((row) => this.mergeLine([...row].reverse()).reverse()),
    );
  }

  moveUp() {
    this.pendingScore = 0;

    const nextState = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    for (let column = 0; column < SIZE; column++) {
      const line = this.state.map((row) => row[column]);
      const merged = this.mergeLine(line);

      for (let row = 0; row < SIZE; row++) {
        nextState[row][column] = merged[row];
      }
    }

    this.makeMove(nextState);
  }

  moveDown() {
    this.pendingScore = 0;

    const nextState = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    for (let column = 0; column < SIZE; column++) {
      const line = this.state.map((row) => row[column]).reverse();
      const merged = this.mergeLine(line).reverse();

      for (let row = 0; row < SIZE; row++) {
        nextState[row][column] = merged[row];
      }
    }

    this.makeMove(nextState);
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
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  mergeLine(line) {
    const numbers = line.filter(Boolean);
    const result = [];

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const mergedValue = numbers[index] * 2;

        result.push(mergedValue);
        this.pendingScore += mergedValue;
        index++;
      } else {
        result.push(numbers[index]);
      }
    }

    return [...result, ...Array(SIZE - result.length).fill(0)];
  }

  makeMove(nextState) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.state);

    if (JSON.stringify(nextState) === previousState) {
      this.pendingScore = 0;

      return;
    }

    this.state = nextState;
    this.score += this.pendingScore;
    this.pendingScore = 0;
    this.addRandomTile();
    this.updateStatus();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
      for (let columnIndex = 0; columnIndex < SIZE; columnIndex++) {
        if (this.state[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, column] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][column] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.state.some((row) => row.some((value) => value === 2048))) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.some((row) => row.includes(0));
    const hasHorizontalMove = this.state.some((row) => {
      return row.some((value, column) => value === row[column + 1]);
    });
    const hasVerticalMove = this.state.some((row, rowIndex) => {
      return row.some((value, column) => {
        const nextRow = this.state[rowIndex + 1];

        return nextRow && value === nextRow[column];
      });
    });

    this.status =
      hasEmptyCell || hasHorizontalMove || hasVerticalMove ? 'playing' : 'lose';
  }
}

module.exports = Game;
