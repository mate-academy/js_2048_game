'use strict';

class Game {
  constructor(initialState) {
    this.initial = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.state = JSON.parse(JSON.stringify(this.initial));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'idle') {
      return;
    }

    let flag = false;

    for (let i = 0; i < this.state.length; i++) {
      const row = [0, 0, 0, 0];
      let count = 0;

      const currentRow = this.state[i].filter((num) => num > 0);

      for (let j = 0; j < currentRow.length; j++) {
        if (currentRow[j] === currentRow[j + 1]) {
          row[count] = currentRow[j] * 2;
          this.score += currentRow[j] * 2;
          j++;
          count++;
        } else {
          row[count] = currentRow[j];
          count++;
        }
      }

      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] !== row[j]) {
          flag = true;
        }
      }
      this.state[i] = row;
    }

    if (this.status === 'playing' && flag) {
      this.fillRandomPosition();
    }

    this.checkAndSetStatus();

    return this;
  }

  moveRight() {
    if (this.status === 'idle') {
      return;
    }

    let flag = false;

    for (let i = 0; i < this.state.length; i++) {
      const row = [0, 0, 0, 0];
      let count = row.length - 1;

      const currentRow = this.state[i].filter((num) => num > 0);

      for (let j = currentRow.length - 1; j >= 0; j--) {
        if (currentRow[j] === currentRow[j - 1]) {
          row[count] = currentRow[j] * 2;
          this.score += currentRow[j] * 2;
          j--;
          count--;
        } else {
          row[count] = currentRow[j];
          count--;
        }
      }

      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] !== row[j]) {
          flag = true;
        }
      }

      this.state[i] = row;
    }

    if (this.status === 'playing' && flag) {
      this.fillRandomPosition();
    }

    this.checkAndSetStatus();

    return this;
  }

  moveUp() {
    if (this.status === 'idle') {
      return;
    }

    let flag = false;

    for (let i = 0; i < this.state.length; i++) {
      const column = [0, 0, 0, 0];
      let count = 0;
      const currentColumn = [];

      for (let j = 0; j < this.state.length; j++) {
        if (this.state[j][i] === 0) {
          continue;
        }
        currentColumn.push(this.state[j][i]);
      }

      for (let j = 0; j < currentColumn.length; j++) {
        if (currentColumn[j] === currentColumn[j + 1]) {
          column[count] = currentColumn[j] * 2;
          this.score += currentColumn[j] * 2;
          j++;
          count++;
        } else {
          column[count] = currentColumn[j];
          count++;
        }
      }

      for (let j = 0; j < column.length; j++) {
        if (this.state[j][i] !== column[j]) {
          flag = true;
        }
        this.state[j][i] = column[j];
      }
    }

    if (this.status === 'playing' && flag) {
      this.fillRandomPosition();
    }

    this.checkAndSetStatus();

    return this;
  }

  moveDown() {
    if (this.status === 'idle') {
      return;
    }

    let flag = false;

    for (let i = 0; i < this.state.length; i++) {
      const column = [0, 0, 0, 0];
      let count = column.length - 1;
      const currentColumn = [];

      for (let j = 0; j < this.state.length; j++) {
        if (this.state[j][i] === 0) {
          continue;
        }
        currentColumn.push(this.state[j][i]);
      }

      for (let j = currentColumn.length - 1; j >= 0; j--) {
        if (currentColumn[j] === currentColumn[j - 1]) {
          column[count] = currentColumn[j] * 2;
          this.score += currentColumn[j] * 2;
          j--;
          count--;
        } else {
          column[count] = currentColumn[j];
          count--;
        }
      }

      for (let j = column.length - 1; j >= 0; j--) {
        if (this.state[j][i] !== column[j]) {
          flag = true;
        }
        this.state[j][i] = column[j];
      }
    }

    if (this.status === 'playing' && flag) {
      this.fillRandomPosition();
    }

    this.checkAndSetStatus();

    return this;
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
    this.fillRandomPosition();
    this.fillRandomPosition();
    this.status = 'playing';

    return this;
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initial));
    this.score = 0;
    this.status = 'idle';

    return this;
  }

  getRandomNumber() {
    const numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const randomNumber = Math.floor(Math.random() * 10);

    return numbers[randomNumber];
  }

  getEmptyPositions() {
    const emptyPositions = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyPositions.push([i, j]);
        }
      }
    }

    return emptyPositions;
  }

  getRandomPosition(emptyPositions) {
    const randomIndex = Math.floor(Math.random() * emptyPositions.length);

    return emptyPositions[randomIndex];
  }

  fillRandomPosition() {
    const position = this.getRandomPosition(this.getEmptyPositions());

    this.state[position[0]][position[1]] = this.getRandomNumber();
  }

  checkAndSetStatus() {
    if (this.getEmptyPositions().length === 0) {
      this.status = 'lose';
    }

    if (this.score === 2048) {
      this.status = 'win';
    }
  }
}

module.exports = Game;
