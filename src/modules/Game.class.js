'use strict';

class Game {
  constructor(initialState) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  // ======================
  // GETTERS
  // ======================

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  // ======================
  // GAME CONTROL
  // ======================

  start() {
    if (this.status === 'playing') {
      return;
    }

    this.status = 'playing';
    this.state = this.createEmptyBoard();
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  // ======================
  // MOVES
  // ======================

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldState = JSON.stringify(this.state);

    this.state = this.state.map((row) => this.compress(row));

    const changed = oldState !== JSON.stringify(this.state);

    if (changed) {
      this.afterMove();
    }

    return changed;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    this.state.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.state.forEach((row) => row.reverse());

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    this.transpose();
    this.state.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.state.forEach((row) => row.reverse());
    this.transpose();

    return moved;
  }

  // ======================
  // CORE LOGIC
  // ======================

  compress(row) {
    const filtered = row.filter((v) => v !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const newRow = filtered.filter((v) => v !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  transpose() {
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoard[col][row] = this.state[row][col];
      }
    }

    this.state = newBoard;
  }

  afterMove() {
    this.addRandomTile();
    this.checkWin();
    this.checkLose();
  }

  // ======================
  // RANDOM TILE
  // ======================

  addRandomTile() {
    const empty = [];

    for (let rIndex = 0; rIndex < 4; rIndex++) {
      for (let cIndex = 0; cIndex < 4; cIndex++) {
        if (this.state[rIndex][cIndex] === 0) {
          empty.push({ row: rIndex, col: cIndex });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  // ======================
  // WIN / LOSE
  // ======================

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
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cur = this.state[row][col];

        if (cur === 0) {
          return true;
        }

        if (col < 3 && cur === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && cur === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }
}

window.Game = Game;
