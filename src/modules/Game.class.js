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
    this.score = 0;
    this.state = this.copyBoard(initialState);
    this.status = 'idle';
    this.addRandomTile();
  }

  copyBoard(board) {
    return board.map((row) => row.slice());
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  moveLeft() {
    const previousState = this.copyBoard(this.state);

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter((val) => val !== 0);
      const mergedRow = this.mergeTiles(newRow);

      this.state[row] = mergedRow.concat(Array(4 - mergedRow.length).fill(0));
    }
    this.checkForChanges(previousState);
  }

  mergeTiles(row) {
    const merged = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        this.score += row[i] * 2;
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    return merged;
  }

  checkForChanges(previousState) {
    if (this.state.toString() !== previousState.toString()) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
      this.status = 'playing';
    }
  }

  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';
        break;
      }
    }
  }

  checkLose() {
    const hasEmptyCells = this.state.some((row) => row.includes(0));
    const canMerge = this.canMerge();

    if (!hasEmptyCells && !canMerge) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (current === 0) {
          continue;
        }

        if (col < 3 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.state[row + 1][col]) {
          return true;
        }

        if (col > 0 && current === this.state[row][col - 1]) {
          return true;
        }

        if (row > 0 && current === this.state[row - 1][col]) {
          return true;
        }
      }
    }

    return false;
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
    this.state = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveRight() {
    this.state.forEach((row) => row.reverse());
    this.moveLeft();
    this.state.forEach((row) => row.reverse());
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

  transpose(matrix) {
    return matrix[0].map((_, index) => matrix.map((row) => row[index]));
  }
}

module.exports = Game;
