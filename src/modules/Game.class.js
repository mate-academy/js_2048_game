'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
    this._updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this._move('left');
  }

  moveRight() {
    this._move('right');
  }

  moveUp() {
    this._move('up');
  }

  moveDown() {
    this._move('down');
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();
    let gainedScore = 0;

    for (let i = 0; i < 4; i++) {
      let line;

      if (direction === 'left' || direction === 'right') {
        line = [...this.state[i]];
      } else {
        line = this.state.map((row) => row[i]);
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      const merged = this._mergeLine(line);

      gainedScore += merged.score;

      if (direction === 'right' || direction === 'down') {
        merged.values.reverse();
      }

      if (direction === 'left' || direction === 'right') {
        this.state[i] = merged.values;
      } else {
        for (let j = 0; j < 4; j++) {
          this.state[j][i] = merged.values[j];
        }
      }
    }

    const changed = this.state.some((row, i) => {
      return row.some((value, j) => value !== previousState[i][j]);
    });

    if (!changed) {
      this.state = previousState;

      return;
    }

    this.score += gainedScore;
    this._addRandomTile();
    this._updateStatus();
  }

  _mergeLine(line) {
    const values = line.filter((value) => value !== 0);
    const result = [];
    let score = 0;

    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        const mergedValue = values[i] * 2;

        result.push(mergedValue);
        score += mergedValue;
        i++;
      } else {
        result.push(values[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { values: result, score };
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[index];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  _updateStatus() {
    if (this.state.some((row) => row.some((value) => value >= 2048))) {
      this.status = 'win';

      return;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 0) {
          this.status = 'playing';

          return;
        }

        if (
          colIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex][colIndex + 1]
        ) {
          this.status = 'playing';

          return;
        }

        if (
          rowIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex + 1][colIndex]
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
