'use strict';

class Game {
  static statuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.size = 4;
    this.score = 0;
    this.status = Game.statuses.IDLE;
    this.initialState = initialState;
    this.state = initialState.map((r) => [...r]);
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.status = Game.statuses.PLAYING;
  }

  restart() {
    this.state = this.initialState.map((r) => [...r]);
    this.score = 0;
    this.status = Game.statuses.IDLE;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((r, rowIndex) => {
      r.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateScore(value) {
    this.score += value;
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

  boardsAreEqual(board1, board2) {
    return board1.every((r, i) => r.every((cell, j) => cell === board2[i][j]));
  }

  checkStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.statuses.WIN;

          return;
        }

        if (this.state[r][c] === 0) {
          return;
        }

        if (
          (r < this.size - 1 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < this.size - 1 && this.state[r][c] === this.state[r][c + 1])
        ) {
          return;
        }
      }
    }

    this.status = Game.statuses.LOSE;
  }

  compress(line) {
    return line
      .filter((v) => v !== 0)
      .concat(Array(this.size).fill(0))
      .slice(0, this.size);
  }

  merge(line) {
    for (let i = 0; i < this.size - 1; i++) {
      if (line[i] !== 0 && line[i] === line[i + 1]) {
        line[i] *= 2;
        this.updateScore(line[i]);
        line[i + 1] = 0;
      }
    }

    return this.compress(line);
  }

  moveLeft() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);

    this.state = this.state.map((line) => this.merge(this.compress(line)));

    if (!this.boardsAreEqual(prev, this.state)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);

    this.state = this.state.map((line) => {
      const reversed = line.slice().reverse();
      const merged = this.merge(this.compress(reversed));

      return merged.reverse();
    });

    if (!this.boardsAreEqual(prev, this.state)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((r) => r[i]));
  }

  moveUp() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);
    let transposed = this.transpose(this.state);

    transposed = transposed.map((line) => this.merge(this.compress(line)));
    this.state = this.transpose(transposed);

    if (!this.boardsAreEqual(prev, this.state)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);
    let transposed = this.transpose(this.state);

    transposed = transposed.map((line) => {
      const reversed = line.slice().reverse();
      const merged = this.merge(this.compress(reversed));

      return merged.reverse();
    });
    this.state = this.transpose(transposed);

    if (!this.boardsAreEqual(prev, this.state)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }
}

module.exports = Game;
