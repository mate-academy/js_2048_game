'use strict';
class Game {
  constructor(initialState = []) {
    this.score = 0;
    this.status = 'idle';

    if (initialState && initialState.length > 0) {
      this.state = initialState;
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.state[row];
      const filtered = currentRow.filter((num) => num !== 0);
      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      this.state[row] = merged;
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkGameOver();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.state[row];
      const filtered = currentRow.filter((num) => num !== 0);
      const merged = [];

      for (let i = filtered.length - 1; i >= 0; i--) {
        if (filtered[i] === filtered[i - 1]) {
          merged.unshift(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i--;
        } else {
          merged.unshift(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.unshift(0);
      }

      this.state[row] = merged;
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkGameOver();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const processed = this.processRow(column);

      this.state[0][col] = processed[0];
      this.state[1][col] = processed[1];
      this.state[2][col] = processed[2];
      this.state[3][col] = processed[3];
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkGameOver();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.state[0][col],
        this.state[1][col],
        this.state[2][col],
        this.state[3][col],
      ];

      const filtered = column.filter((num) => num !== 0);
      const merged = [];

      // Processa de baixo para cima na coluna
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (filtered[i] === filtered[i - 1]) {
          merged.unshift(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i--;
        } else {
          merged.unshift(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.unshift(0);
      }

      this.state[0][col] = merged[0];
      this.state[1][col] = merged[1];
      this.state[2][col] = merged[2];
      this.state[3][col] = merged[3];
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkGameOver();
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
    this.start();
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

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = value;
  }

  processRow(column) {
    const filtered = column.filter((num) => num !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  checkWin() {
    if (this.status === 'win') {
      return true;
    }

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

  checkGameOver() {
    if (this.checkWin()) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
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

    this.status = 'lose';

    return true;
  }
}

export default Game;
