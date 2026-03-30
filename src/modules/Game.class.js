'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.state = initialState;
    } else {
      this.state = this.createEmptyField();
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.state[row][col];

        if (value === 0) {
          return false;
        }

        if (col < 3 && value === this.state[row][col + 1]) {
          return false;
        }

        if (row < 3 && value === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  getStatus() {
    if (this.checkWin()) {
      return 'win';
    }

    if (this.checkLose()) {
      return 'lose';
    }

    return 'playing';
  }

  processLine(line) {
    const filtered = line.filter((num) => num !== 0);

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
    let changed = false;

    for (let row = 0; row < 4; row++) {
      const line = this.state[row];
      const newLine = this.processLine(line);

      if (this.state[row] !== newLine[row]) {
        changed = true;
      }

      this.state[row] = newLine;
    }

    if (changed) {
      this.addRandomTile();
    }

    return changed;
  }

  moveRight() {
    let changed = false;

    for (let row = 0; row < 4; row++) {
      const line = [...this.state[row]];
      const reversed = line.reverse();
      const processed = this.processLine(reversed);
      const newLine = processed.reverse();

      if (this.state[row] !== newLine[row]) {
        changed = true;
      }

      this.state[row] = newLine;
    }

    if (changed) {
      this.addRandomTile();
    }

    return changed;
  }

  moveUp() {
    let changed = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const newColumn = this.processLine(column);

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          changed = true;
        }

        this.state[row][col] = newColumn[row];
      }
    }

    if (changed) {
      this.addRandomTile();
    }

    return changed;
  }

  moveDown() {
    let changed = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const newColumn = this.processLine([...column].reverse()).reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          changed = true;
        }

        this.state[row][col] = newColumn[row];
      }
    }

    if (changed) {
      this.addRandomTile();
    }

    return changed;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();

    this.status = 'playing';
  }

  restart() {
    this.state = this.createEmptyField();
    this.score = 0;

    this.status = 'idle';
  }

  createEmptyField() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let rows = 0; rows < 4; rows++) {
      // eslint-disable-next-line no-shadow
      for (let cols = 0; cols < 4; cols++) {
        if (this.state[rows][cols] === 0) {
          emptyCells.push({ rows, cols });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { rows, cols } = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[rows][cols] = value;
  }
}

export default Game;
