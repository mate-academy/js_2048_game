/* eslint-disable function-paren-newline */
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

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.state);

    this.state = this.state.map((row) => this.mergeRow(row));

    if (JSON.stringify(this.state) !== prev) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.state);

    this.state = this.state.map((row) =>
      this.mergeRow([...row].reverse()).reverse(),
    );

    if (JSON.stringify(this.state) !== prev) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.state);

    this.state = this.transpose(this.state);
    this.state = this.state.map((row) => this.mergeRow(row));
    this.state = this.transpose(this.state);

    if (JSON.stringify(this.state) !== prev) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prev = JSON.stringify(this.state);

    this.state = this.transpose(this.state);

    this.state = this.state.map((row) =>
      this.mergeRow([...row].reverse()).reverse(),
    );
    this.state = this.transpose(this.state);

    if (JSON.stringify(this.state) !== prev) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  // --- Private helpers ---

  mergeRow(row) {
    const tiles = row.filter((v) => v !== 0);
    const merged = [];
    let i = 0;

    while (i < tiles.length) {
      if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
        const val = tiles[i] * 2;

        merged.push(val);
        this.score += val;
        i += 2;
      } else {
        merged.push(tiles[i]);
        i++;
      }
    }

    // Pad with zeros on the right
    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const empty = [];

    for (let randomRow = 0; randomRow < 4; randomRow++) {
      for (let randomColumn = 0; randomColumn < 4; randomColumn++) {
        if (this.state[randomRow][randomColumn] === 0) {
          empty.push([randomRow, randomColumn]);
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    // Check win
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check if any moves are possible
    if (this.hasMovesAvailable()) {
      return;
    }

    this.status = 'lose';
  }

  hasMovesAvailable() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (col + 1 < 4 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row + 1 < 4 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
