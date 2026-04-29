'use strict';

class Game {
  constructor(initialState = []) {
    if (initialState.length > 0) {
      this.state = initialState;
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  processRow(row) {
    const filtered = row.filter((num) => num !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  moveLeft() {
    const oldState = JSON.stringify(this.state);
    const newState = this.state.map((row) => this.processRow(row));

    this.state = newState;

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }

      return true;
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }

    return false;
  }
  moveRight() {
    const oldState = JSON.stringify(this.state);
    const reversed = this.state.map((row) => [...row].reverse());
    const processed = reversed.map((row) => this.processRow(row));

    this.state = processed.map((row) => [...row].reverse());

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }

      return true;
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }

    return false;
  }
  moveUp() {
    const oldState = JSON.stringify(this.state);
    const transposed = this.transpose(this.state);
    const processed = transposed.map((row) => this.processRow(row));

    this.state = this.transpose(processed);

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }

      return true;
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }

    return false;
  }
  moveDown() {
    const oldState = JSON.stringify(this.state);
    const transposed = this.transpose(this.state);
    const reversed = transposed.map((row) => [...row].reverse());
    const processed = reversed.map((row) => this.processRow(row));

    this.state = this.transpose(processed.map((row) => [...row].reverse()));

    if (JSON.stringify(this.state) !== oldState) {
      this.addRandomTile();

      if (this.checkWin()) {
        this.status = 'win';
      } else if (this.checkLose()) {
        this.status = 'lose';
      }

      return true;
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }

    return false;
  }
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = value;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
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

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  checkWin() {
    return this.state.some((row) => row.includes(2048));
  }
  checkLose() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (const row of this.state) {
      for (let i = 0; i < 3; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;
