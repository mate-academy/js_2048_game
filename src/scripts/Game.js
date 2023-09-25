export class Game {
  static getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  static getFlatMaxtix(matrix) {
    return matrix.reduce((acc, item) => {
      return [...acc, ...item];
    }, []);
  }

  static transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  static processRow(row, scoreCallback) {
    const sums = [];

    for (let i = row.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (row[j] !== 0 && row[j] === row[i]) {
          sums.unshift(row[i] + row[j]);
          scoreCallback(row[i] + row[j]);

          row[i] = 0;
          row[j] = 0;

          break;
        } else if (row[j] !== 0 && row[j] !== row[i]) {
          break;
        }
      }

      if (row[i] !== 0) {
        sums.unshift(row[i]);
        row[i] = 0;
      }
    }

    for (const num of row) {
      if (num !== 0) {
        sums.unshift(num);
      }
    }

    while (sums.length !== 4) {
      sums.unshift(0);
    }

    return sums;
  };

  static processUp(matrix, scoreCallback) {
    const transposedMatrix = Game.transpose(matrix);

    for (let i = 0; i < matrix.length; i++) {
      transposedMatrix[i] = Game
        .processRow(transposedMatrix[i].reverse(), scoreCallback)
        .reverse();
    }

    const resultMatrix = Game.transpose(transposedMatrix);

    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = resultMatrix[i];
    }
  };

  static processDown(matrix, scoreCallback) {
    const transposedMatrix = Game.transpose(matrix);

    for (let i = 0; i < matrix.length; i++) {
      transposedMatrix[i] = Game.processRow(transposedMatrix[i], scoreCallback);
    }

    const resultMatrix = Game.transpose(transposedMatrix);

    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = resultMatrix[i];
    }
  };

  static processRight(matrix, scoreCallback) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = Game.processRow(matrix[i], scoreCallback);
    }
  };

  static processLeft(matrix, scoreCallback) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = Game.processRow(matrix[i].reverse(), scoreCallback).reverse();
    }
  };

  static generateNumber(matrix) {
    const column = Game.getRandomNumber(0, 3);
    const row = Game.getRandomNumber(0, 3);
    const flatMatrix = Game.getFlatMaxtix(matrix);

    if (Math.min(...flatMatrix) !== 0) {
      return;
    }

    if (matrix[column][row] === 0) {
      matrix[column][row] = Game.START_NUMBERS[Game.getRandomNumber(0, 1)];

      return;
    }

    this.generateNumber(matrix);
  }

  constructor() {
    this.field = [
      new Array(4).fill(0),
      new Array(4).fill(0),
      new Array(4).fill(0),
      new Array(4).fill(0),
    ];
    this.score = 0;
  }

  resetField() {
    this.score = 0;

    for (const row of this.field) {
      row.fill(0);
    }

    for (let i = 0; i < 2; i++) {
      const column = Game.getRandomNumber(0, 3);
      const row = Game.getRandomNumber(0, 3);

      if (this.field[column][row] !== 0) {
        i--;
        continue;
      }

      this.field[column][row] = Game.START_NUMBERS[Game.getRandomNumber(0, 1)];
    }
  }

  moove(direction) {
    const scoreCallback = (num) => {
      this.score += num;
    };

    switch (direction.key) {
      case 'ArrowUp':
        Game.processUp(this.field, scoreCallback);
        break;
      case 'ArrowDown':
        Game.processDown(this.field, scoreCallback);
        break;
      case 'ArrowRight':
        Game.processRight(this.field, scoreCallback);
        break;
      case 'ArrowLeft':
        Game.processLeft(this.field, scoreCallback);
        break;
    }

    Game.generateNumber(this.field);
  }

  isLose() {
    const fieldSize = this.field.length;

    for (let i = 0; i < fieldSize; i++) {
      for (let j = 0; j < fieldSize; j++) {
        const currentElement = this.field[i][j];

        if (j + 1 < fieldSize && currentElement === this.field[i][j + 1]) {
          return false;
        }

        if (j - 1 >= 0 && currentElement === this.field[i][j - 1]) {
          return false;
        }

        if (i + 1 < fieldSize && currentElement === this.field[i + 1][j]) {
          return false;
        }

        if (i - 1 >= 0 && currentElement === this.field[i - 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  getField() {
    return this.field;
  }

  getScore() {
    return this.score;
  }
}

Game.START_NUMBERS = [2, 4];
