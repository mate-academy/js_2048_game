'use strict';

class Game {
  constructor(initialState = Game.getEmptyState()) {
    this.initialState = this.cloneState(initialState);
    this.state = this.cloneState(initialState);
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

    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.cloneState(this.state);
    const previousScore = this.score;

    if (direction === 'left') {
      this.state = this.state.map((row) => this.moveRowLeft(row));
    }

    if (direction === 'right') {
      this.state = this.state.map((row) => {
        return this.moveRowLeft([...row].reverse()).reverse();
      });
    }

    if (direction === 'up') {
      const movedState = this.transpose(this.state).map((row) => {
        return this.moveRowLeft(row);
      });

      this.state = this.transpose(movedState);
    }

    if (direction === 'down') {
      const movedState = this.transpose(this.state).map((row) => {
        return this.moveRowLeft([...row].reverse()).reverse();
      });

      this.state = this.transpose(movedState);
    }

    if (!this.areStatesEqual(previousState, this.state)) {
      this.addRandomCell();
      this.updateStatus();
    } else {
      this.score = previousScore;
    }
  }

  moveRowLeft(row) {
    const numbers = row.filter((cell) => cell !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedCell = numbers[i] * 2;

        result.push(mergedCell);
        this.score += mergedCell;
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

  addRandomCell() {
    const emptyCells = [];

    this.state.forEach((row, currentRowIndex) => {
      row.forEach((cell, currentCellIndex) => {
        if (cell === 0) {
          emptyCells.push([currentRowIndex, currentCellIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [targetRowIndex, targetCellIndex] = emptyCells[randomIndex];

    this.state[targetRowIndex][targetCellIndex] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (cell < 3 && this.state[row][cell] === this.state[row][cell + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][cell] === this.state[row + 1][cell]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(state) {
    return state[0].map((_, index) => state.map((row) => row[index]));
  }

  areStatesEqual(firstState, secondState) {
    return JSON.stringify(firstState) === JSON.stringify(secondState);
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  static getEmptyState() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

export default Game;
