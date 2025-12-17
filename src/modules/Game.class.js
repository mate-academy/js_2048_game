'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';

    if (initialState && Array.isArray(initialState)) {
      this.state = initialState.map((row) => [...row]);
    } else {
      this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    }
  }

  cloneState() {
    return this.state.map((row) => [...row]);
  }

  getEmptyCells() {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          empty.push({ row, col });
        }
      }
    }

    return empty;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[index];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[row][col] = value;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'playing') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.addRandomTile();
    this.addRandomTile();
  }

  processLine(line) {
    let filtered = line.filter((v) => v !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((v) => v !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    const prev = this.cloneState();

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.processLine(this.state[row]);
    }

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    const prev = this.cloneState();

    for (let row = 0; row < 4; row++) {
      const reversed = [...this.state[row]].reverse();
      const processed = this.processLine(reversed).reverse();

      this.state[row] = processed;
    }

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    const prev = this.cloneState();

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const processed = this.processLine(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = processed[row];
      }
    }

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    const prev = this.cloneState();

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const reversed = [...column].reverse();
      const processed = this.processLine(reversed).reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = processed[row];
      }
    }

    if (JSON.stringify(prev) !== JSON.stringify(this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cloneState();
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  hasMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const val = this.state[row][col];

        if (col < 3 && this.state[row][col + 1] === val) {
          return true;
        }

        if (row < 3 && this.state[row + 1][col] === val) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.status !== 'playing') {
      return;
    }

    if (this.checkWin()) {
      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }
}

export default Game;
