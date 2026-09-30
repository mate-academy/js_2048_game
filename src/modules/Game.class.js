'use strict';

class Game {
  rows = 4;
  columns = 4;
  fieldOfCells = [];
  initialState = [];
  lengthOfMassive = this.rows * this.columns;
  status = 'idle';
  score = 0;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.fieldOfCells = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);
  }

  moveLeft() {
    const copyMas = [];

    this.fieldOfCells.forEach((row) => {
      copyMas.push([...row]);
    });

    let indexFirstZero = -1;

    this.fieldOfCells.forEach((row) => {
      for (let i = 0; i < this.columns; i++) {
        if (row[i] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (row[i] !== 0 && indexFirstZero !== -1) {
          row[indexFirstZero] = row[i];
          row[i] = 0;
          indexFirstZero++;
        }
      }

      for (let i = 0; i < this.columns - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
          row[i] += row[i + 1];
          row[i + 1] = 0;
          this.score += row[i];
        }
      }

      indexFirstZero = -1;

      for (let i = 0; i < this.columns; i++) {
        if (row[i] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (row[i] !== 0 && indexFirstZero !== -1) {
          row[indexFirstZero] = row[i];
          row[i] = 0;
          indexFirstZero++;
        }
      }

      indexFirstZero = -1;
    });

    if (
      !this.fieldOfCells.every((row, i) => {
        return row.every((cell, j) => cell === copyMas[i][j]);
      })
    ) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    const copyMas = [];

    this.fieldOfCells.forEach((row) => {
      copyMas.push([...row]);
    });

    let indexFirstZero = -1;

    this.fieldOfCells.forEach((row) => {
      for (let i = this.columns - 1; i >= 0; i--) {
        if (row[i] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (row[i] !== 0 && indexFirstZero !== -1) {
          row[indexFirstZero] = row[i];
          row[i] = 0;
          indexFirstZero--;
        }
      }

      for (let i = this.columns - 1; i >= 1; i--) {
        if (row[i] === row[i - 1] && row[i] !== 0) {
          row[i] += row[i - 1];
          row[i - 1] = 0;
          this.score += row[i];
        }
      }

      indexFirstZero = -1;

      for (let i = this.columns - 1; i >= 0; i--) {
        if (row[i] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (row[i] !== 0 && indexFirstZero !== -1) {
          row[indexFirstZero] = row[i];
          row[i] = 0;
          indexFirstZero--;
        }
      }

      indexFirstZero = -1;
    });

    if (
      !this.fieldOfCells.every((row, i) => {
        return row.every((cell, j) => cell === copyMas[i][j]);
      })
    ) {
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveUp() {
    const copyMas = [];

    this.fieldOfCells.forEach((row) => {
      copyMas.push([...row]);
    });

    let indexFirstZero = -1;

    for (let j = 0; j < this.columns; j++) {
      for (let i = 0; i < this.rows; i++) {
        if (this.fieldOfCells[i][j] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (this.fieldOfCells[i][j] !== 0 && indexFirstZero !== -1) {
          this.fieldOfCells[indexFirstZero][j] = this.fieldOfCells[i][j];
          this.fieldOfCells[i][j] = 0;
          indexFirstZero++;
        }
      }

      for (let i = 0; i < this.rows - 1; i++) {
        if (
          this.fieldOfCells[i][j] === this.fieldOfCells[i + 1][j] &&
          this.fieldOfCells[i][j] !== 0
        ) {
          this.fieldOfCells[i][j] += this.fieldOfCells[i + 1][j];
          this.fieldOfCells[i + 1][j] = 0;
          this.score += this.fieldOfCells[i][j];
        }
      }

      indexFirstZero = -1;

      for (let i = 0; i < this.rows; i++) {
        if (this.fieldOfCells[i][j] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (this.fieldOfCells[i][j] !== 0 && indexFirstZero !== -1) {
          this.fieldOfCells[indexFirstZero][j] = this.fieldOfCells[i][j];
          this.fieldOfCells[i][j] = 0;
          indexFirstZero++;
        }
      }

      indexFirstZero = -1;
    }

    if (
      !this.fieldOfCells.every((row, i) => {
        return row.every((cell, j) => cell === copyMas[i][j]);
      })
    ) {
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveDown() {
    const copyMas = [];

    this.fieldOfCells.forEach((row) => {
      copyMas.push([...row]);
    });

    let indexFirstZero = -1;

    for (let j = 0; j < this.columns; j++) {
      for (let i = this.rows - 1; i >= 0; i--) {
        if (this.fieldOfCells[i][j] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (this.fieldOfCells[i][j] !== 0 && indexFirstZero !== -1) {
          this.fieldOfCells[indexFirstZero][j] = this.fieldOfCells[i][j];
          this.fieldOfCells[i][j] = 0;
          indexFirstZero--;
        }
      }

      for (let i = this.rows - 1; i >= 1; i--) {
        if (
          this.fieldOfCells[i][j] === this.fieldOfCells[i - 1][j] &&
          this.fieldOfCells[i][j] !== 0
        ) {
          this.fieldOfCells[i][j] += this.fieldOfCells[i - 1][j];
          this.fieldOfCells[i - 1][j] = 0;
          this.score += this.fieldOfCells[i][j];
        }
      }

      indexFirstZero = -1;

      for (let i = this.rows - 1; i >= 0; i--) {
        if (this.fieldOfCells[i][j] === 0 && indexFirstZero === -1) {
          indexFirstZero = i;
        } else if (this.fieldOfCells[i][j] !== 0 && indexFirstZero !== -1) {
          this.fieldOfCells[indexFirstZero][j] = this.fieldOfCells[i][j];
          this.fieldOfCells[i][j] = 0;
          indexFirstZero--;
        }
      }

      indexFirstZero = -1;
    }

    if (
      !this.fieldOfCells.every((row, i) => {
        return row.every((cell, j) => cell === copyMas[i][j]);
      })
    ) {
      this.addRandomTile();
    }
    this.updateStatus();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.fieldOfCells;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.fieldOfCells = this.initialState.map((row) => [...row]);
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.fieldOfCells = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const randomNumber = Math.random();

    let randomIndex = parseInt(Math.random() * this.lengthOfMassive);
    let indexRow = Math.floor(randomIndex / this.rows);
    let indexColumn = randomIndex % this.columns;

    if (this.checkEmptyCells()) {
      while (this.fieldOfCells[indexRow][indexColumn] !== 0) {
        randomIndex = parseInt(Math.random() * this.lengthOfMassive);
        indexRow = Math.floor(randomIndex / this.rows);
        indexColumn = randomIndex % this.columns;
      }
      this.fieldOfCells[indexRow][indexColumn] = randomNumber >= 0.9 ? 4 : 2;
    }
  }

  checkStillPlaying() {
    let isPlaying = false;

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.columns - 1; i++) {
        if (
          this.fieldOfCells[j][i] === this.fieldOfCells[j][i + 1] ||
          this.fieldOfCells[i][j] === this.fieldOfCells[i + 1][j]
        ) {
          isPlaying = true;
          break;
        }
      }
    }

    return isPlaying;
  }

  checkEmptyCells() {
    let isFree = false;

    this.fieldOfCells.forEach((row) => {
      for (let i = 0; i < this.columns; i++) {
        if (row[i] === 0) {
          isFree = true;
          break;
        }
      }
    });

    return isFree;
  }

  check2048Cells() {
    let isWin = false;

    this.fieldOfCells.forEach((row) => {
      for (let i = 0; i < this.columns; i++) {
        if (row[i] === 2048) {
          isWin = true;
          break;
        }
      }
    });

    return isWin;
  }

  updateStatus() {
    if (this.check2048Cells()) {
      this.status = 'win';
    } else if (this.checkEmptyCells() || this.checkStillPlaying()) {
      this.status = 'playing';
    } else {
      this.status = `lose`;
    }
  }
}

module.exports = Game;
