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
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => this.mergeRow(row));

    this.finishMove(previousState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeRow(reversedRow);

      return mergedRow.reverse();
    });

    this.finishMove(previousState);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();
    const transposedState = this.transpose(this.state);

    const movedState = transposedState.map((row) => this.mergeRow(row));

    this.state = this.transpose(movedState);

    this.finishMove(previousState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();
    const transposedState = this.transpose(this.state);

    const movedState = transposedState.map((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeRow(reversedRow);

      return mergedRow.reverse();
    });

    this.state = this.transpose(movedState);

    this.finishMove(previousState);
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

    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  mergeRow(row) {
    const numbers = row.filter((number) => number !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedNumber = numbers[i] * 2;

        result.push(mergedNumber);
        this.score += mergedNumber;

        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  transpose(state) {
    return state[0].map((_, columnIndex) => {
      return state.map((currentRow) => currentRow[columnIndex]);
    });
  }

  addRandomCell() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (this.state[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomColumn] = emptyCells[randomIndex];

    this.state[randomRow][randomColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  finishMove(previousState) {
    if (!this.areStatesEqual(previousState, this.state)) {
      this.addRandomCell();
    }

    this.updateStatus();
  }

  areStatesEqual(firstState, secondState) {
    return firstState.every((currentRow, rowIndex) => {
      return currentRow.every((cell, columnIndex) => {
        return cell === secondState[rowIndex][columnIndex];
      });
    });
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          return true;
        }

        if (
          column < 3 &&
          this.state[row][column] === this.state[row][column + 1]
        ) {
          return true;
        }

        if (
          row < 3 &&
          this.state[row][column] === this.state[row + 1][column]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
