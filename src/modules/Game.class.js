'use strict';
class Game {
  constructor(initialState) {
    this.matrix = initialState;
  }

  score = 0;
  status = 'idle';

  static isGameActive = false;

  moveLeft() {
    const callback = (number) => number !== 0;

    for (let arrayIndex = 0; arrayIndex < this.matrix.length; arrayIndex++) {
      const array = this.matrix[arrayIndex];

      const additionalArray = array.filter(callback);

      for (let i = 0; i < additionalArray.length; i++) {
        if (additionalArray[i] === additionalArray[i + 1]) {
          const add = additionalArray[i] * 2;

          additionalArray[i] = add;
          additionalArray[i + 1] = 0;

          this.score += add;
        }
      }

      const filteredArray = additionalArray.filter(callback);

      while (filteredArray.length - 1 < array.length - 1) {
        filteredArray.push(0);
      }

      this.matrix[arrayIndex] = filteredArray;
    }

    return this.matrix;
  }

  moveRight() {
    const callback = (number) => number !== 0;

    for (let arrayIndex = 0; arrayIndex < this.matrix.length; arrayIndex++) {
      const array = this.matrix[arrayIndex];

      const additionalArray = array.filter(callback);

      for (let i = 0; i < additionalArray.length; i++) {
        const lastElem = additionalArray.length - i - 1;

        if (additionalArray[lastElem] === additionalArray[lastElem - 1]) {
          const add = additionalArray[lastElem] * 2;

          additionalArray[lastElem] = add;
          additionalArray[lastElem - 1] = 0;

          this.score += add;
        }
      }

      const filteredArray = additionalArray.filter(callback);

      while (filteredArray.length - 1 < array.length - 1) {
        filteredArray.unshift(0);
      }

      this.matrix[arrayIndex] = filteredArray;
    }

    return this.matrix;
  }

  moveUp() {
    const callback = (number) => number !== 0;

    for (let arrayIndex = 0; arrayIndex < this.matrix.length; arrayIndex++) {
      const columnElements = [];

      this.matrix.forEach(
        (array, index) => (columnElements[index] = array[arrayIndex]),
      );

      const filteredElements = columnElements.filter(callback);

      for (let i = 0; i < filteredElements.length; i++) {
        if (filteredElements[i] === filteredElements[i + 1]) {
          const add = filteredElements[i] * 2;

          filteredElements[i] = add;
          filteredElements[i + 1] = 0;

          this.score += add;
        }
      }

      const filteredArray = filteredElements.filter(callback);

      while (filteredArray.length - 1 < this.matrix[arrayIndex].length - 1) {
        filteredArray.push(0);
      }

      for (let index = 0; index < this.matrix.length; index++) {
        this.matrix[index][arrayIndex] = filteredArray[index];
      }
    }
  }

  moveDown() {
    const callback = (number) => number !== 0;

    for (let arrayIndex = 0; arrayIndex < this.matrix.length; arrayIndex++) {
      const columnElements = [];

      this.matrix.forEach(
        (array, index) => (columnElements[index] = array[arrayIndex]),
      );

      const filteredElements = columnElements.filter(callback);

      for (let i = filteredElements.length - 1; i > 0; i--) {
        if (filteredElements[i] === filteredElements[i - 1]) {
          const add = filteredElements[i] * 2;

          filteredElements[i] = add;
          filteredElements[i - 1] = 0;

          this.score += add;
        }
      }

      const filteredArray = filteredElements.filter(callback);

      while (filteredArray.length - 1 < this.matrix[arrayIndex].length - 1) {
        filteredArray.unshift(0);
      }

      for (let index = 0; index < this.matrix.length; index++) {
        this.matrix[index][arrayIndex] = filteredArray[index];
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.matrix;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    return [this.addRandomElement(), this.addRandomElement()];
  }

  restart() {
    this.matrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';

    return this;
  }

  getRandomCoords() {
    let row = Math.floor(Math.random() * 4);
    let column = Math.floor(Math.random() * 4);

    while (this.matrix[row][column] !== 0) {
      row = Math.floor(Math.random() * 4);
      column = Math.floor(Math.random() * 4);
    }

    return [row, column];
  }

  addRandomElement() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  isMovePossible() {
    const matrixLength = this.matrix.length;
    const matrix = this.matrix;

    for (let row = 0; row < matrixLength; row++) {
      for (let column = 0; column < matrixLength; column++) {
        if (
          (column < matrixLength - 1 &&
            matrix[row][column] === matrix[row][column + 1]) ||
          (row < matrixLength - 1 &&
            matrix[row][column] === matrix[row + 1][column])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isPlaying() {
    const zeros = this.matrix.filter((array) => array.includes(0));
    const win = this.matrix.flat().includes(2048);

    if (!zeros.length && !this.isMovePossible()) {
      this.status = 'lose';
    }

    if (win) {
      this.status = 'win';
    }

    return this;
  }
}

module.exports = Game;
