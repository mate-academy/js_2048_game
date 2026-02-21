/* eslint-disable no-console */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  status = 'idle';

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveLeft() {
    for (let i = 0; i < 4; i++) {
      let row = this.state[i].filter((v) => v !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && row[j] !== 0) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
          j++;
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      this.state[i] = row;
    }
  }

  moveRight() {
    for (let i = 0; i < 4; i++) {
      let row = this.state[i].filter((v) => v !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1] && row[j] !== 0) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
          j++;
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      this.state[i] = row;
    }
  }

  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
  }

  moveDown() {
    this.state = this.transpose(this.state);
    this.moveRight();
    this.state = this.transpose(this.state);
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
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  hasMoved(prevState) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (prevState[i][j] !== this.state[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  restart() {
    this.start();
    this.score = 0;
    this.status = 'playing';
  }
}

module.exports = Game;
