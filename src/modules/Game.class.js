'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.state = initialState.map((row) => [...row]);
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

  compress(line) {
    return line
      .filter((value) => value !== 0)
      .concat(Array(this.size).fill(0))
      .slice(0, this.size);
  }

  transpose(state) {
    return state[0].map((_, index) => state.map((row) => row[index]));
  }

  areBoardMoves(prev, current) {
    return prev.every((row, r) => {
      return row.every((cell, c) => cell === current[r][c]);
    });
  }

  moveLeft() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);

    this.state = this.state.map((line) => this.merge(this.compress(line)));

    if (!this.areBoardMoves(prev, this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);

    this.state = this.state.map((line) => {
      const reversed = line.slice().reverse();

      return this.merge(this.compress(reversed)).reverse();
    });

    if (!this.areBoardMoves(prev, this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);
    let transposed = this.transpose(this.state);

    transposed = transposed.map((line) => this.merge(this.compress(line)));
    this.state = this.transpose(transposed);

    if (!this.areBoardMoves(prev, this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const prev = this.state.map((r) => [...r]);
    let transposed = this.transpose(this.state);

    transposed = transposed.map((line) => {
      return this.merge(this.compress(line.reverse())).reverse();
    });

    /* transposed = transposed.map((line) => {
      return this.merge(this.compress(line.reverse()));
    }); */

    this.state = this.transpose(transposed);

    if (!this.areBoardMoves(prev, this.state)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  updateScore(value) {
    this.score += value;
  }

  updateStatus() {
    for (let row = 0; row < this.size; row++) {
      for (let cell = 0; cell < this.size; cell++) {
        const currentValue = this.state[row][cell];

        if (currentValue === 2048) {
          this.status = Game.statuses.WIN;

          return;
        }

        if (currentValue === 0) {
          return;
        }

        if (
          (row < this.size - 1 && currentValue === this.state[row + 1][cell]) ||
          (cell < this.size - 1 && currentValue === this.state[row][cell + 1])
        ) {
          return;
        }
      }
    }

    this.status = Game.statuses.LOSE;
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
    this.addRandomTile();
    this.addRandomTile();
    this.status = Game.statuses.PLAYING;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((rows, rowIndex) => {
      rows.forEach((col, cellIndex) => {
        if (col === 0) {
          emptyCells.push({ row: rowIndex, cell: cellIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, cell } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][cell] = Math.random() < 0.9 ? 2 : 4;
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.statuses.IDLE;
  }
}

module.exports = Game;
