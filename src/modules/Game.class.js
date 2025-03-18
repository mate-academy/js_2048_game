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
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.getStatus() === 'playing') {
      let moved = false;

      for (let i = 0; i < this.state.length; i++) {
        let newRow = this.state[i].filter((cell) => cell !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let j = 0; j < 3; j++) {
          if (newRow[j] === newRow[j + 1] && newRow[j] !== 0) {
            newRow[j] *= 2;
            this.score += newRow[j];
            newRow[j + 1] = 0;
            moved = true;
          }
        }

        newRow = newRow.filter((cell) => cell !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        if (!this.state[i].every((val, index) => val === newRow[index])) {
          this.state[i] = newRow;
          moved = true;
        }
      }

      if (moved) {
        this.addTile();
        this.checkWinOrLose();
      }
    }

    return this.state;
  }

  reverseState() {
    return this.state.map((row) => row.reverse());
  }

  flipState() {
    const rotatedMatrix = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        rotatedMatrix[i][j] = this.state[j][i];
      }
    }

    this.state = rotatedMatrix;

    return this.state;
  }

  moveRight() {
    if (this.getStatus() === 'playing') {
      this.reverseState();
      this.moveLeft();
      this.reverseState();
    }
  }

  moveUp() {
    if (this.getStatus() === 'playing') {
      this.flipState();
      this.moveLeft();
      this.flipState();
    }
  }

  moveDown() {
    if (this.getStatus() === 'playing') {
      this.flipState();
      this.moveRight();
      this.flipState();
    }
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
    this.addTile();
    this.addTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, cell: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomNumber = Math.random() <= 0.1 ? 4 : 2;
    const randomInd = Math.floor(Math.random() * emptyCells.length);
    const { row, cell } = emptyCells[randomInd];

    this.state[row][cell] = randomNumber;
  }

  gameWin() {
    return this.state.some((row) => row.includes(2048));
  }

  gameOver() {
    if (this.state.some((row) => row.includes(0))) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  checkWinOrLose() {
    if (this.gameWin()) {
      this.status = 'win';
    } else if (this.gameOver()) {
      this.status = 'lose';
    }

    return this.status;
  }
}

module.exports = Game;
