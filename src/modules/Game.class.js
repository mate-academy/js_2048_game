'use strict';

class Game {
  constructor(initialState) {
    const defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = structuredClone(initialState || defaultState);
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const prevState = this.state;

    for (let i = 0; i < prevState.length; i++) {
      const row = [...this.state[i]];

      this.state[i] = this.toMerge(row);
    }

    this.newMove(prevState);
  }

  moveRight() {
    const prevState = this.state;

    for (let i = 0; i < prevState.length; i++) {
      const row = [...this.state[i]].reverse();

      this.state[i] = this.toMerge(row).reverse();
    }

    this.newMove(prevState);
  }
  moveUp() {
    const prevState = this.state;

    for (let i = 0; i < prevState.length; i++) {
      const column = this.getColumn(i);
      const mergedColumn = this.toMerge(column);

      this.setColumn(i, mergedColumn);
    }

    this.newMove(prevState);
  }

  moveDown() {
    const prevState = this.state;

    for (let i = 0; i < prevState.length; i++) {
      const column = [...this.getColumn(i)].reverse();
      const mergedColumn = this.toMerge(column).reverse();

      this.setColumn(i, mergedColumn);
    }
    this.newMove(prevState);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  toMerge(row) {
    const numbers = row.filter((el) => el > 0);
    const newNumbers = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        newNumbers.push(numbers[i] + numbers[i + 1]);
        this.score += numbers[i] + numbers[i + 1];
      } else {
        newNumbers.push(numbers[i]);
      }
    }

    for (let i = newNumbers.length; i < 4; i++) {
      newNumbers.push(0);
    }

    return newNumbers;
  }

  getColumn(index) {
    const column = [];

    for (let i = 0; i < 4; i++) {
      column.push(this.state[i][index]);
    }

    return column;
  }
  setColumn(index, column) {
    for (let i = 0; i < 4; i++) {
      this.state[i][index] = column[i];
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const randomCell = emptyCells[randomIndex];

    let tileValue = 0;

    if (Math.random() > 0.9) {
      tileValue = 4;
    } else {
      tileValue = 2;
    }

    this.state[randomCell.row][randomCell.col] = tileValue;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  newMove(prevState) {
    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }
}

export default Game;
