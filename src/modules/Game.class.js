'use strict';

/**
 * This class represents the game.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.score = 0;

    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';

    // Убрали ветвление со сложными переносами
    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = this.state;
    }
  }

  isStateChanged(oldState) {
    return oldState.some((row, rIdx) => {
      return row.some((num, cIdx) => num !== this.state[rIdx][cIdx]);
    });
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.mergeLine(this.state[row]);
    }

    if (this.isStateChanged(stateBefore)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      const reversed = this.state[row].slice().reverse();

      this.state[row] = this.mergeLine(reversed).reverse();
    }

    if (this.isStateChanged(stateBefore)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    this.state = this.transposeState(this.state);

    for (let row = 0; row < 4; row++) {
      this.state[row] = this.mergeLine(this.state[row]);
    }

    this.state = this.transposeState(this.state);

    if (this.isStateChanged(stateBefore)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBefore = this.state.map((row) => [...row]);

    this.state = this.transposeState(this.state);

    for (let row = 0; row < 4; row++) {
      const reversed = this.state[row].slice().reverse();

      this.state[row] = this.mergeLine(reversed).reverse();
    }

    this.state = this.transposeState(this.state);

    if (this.isStateChanged(stateBefore)) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  transposeState(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  mergeLine(line) {
    const filtered = line.filter((num) => num !== 0);
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

  checkStatus() {
    const has2048 = this.state.some((row) => row.includes(2048));

    if (has2048) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.some((row) => row.includes(0));

    if (hasEmptyCell) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];
        const right = col < 3 ? this.state[row][col + 1] : null;
        const down = row < 3 ? this.state[row + 1][col] : null;

        if (current === right || current === down) {
          return;
        }
      }
    }

    this.status = 'lose';
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r: randomR, c: randomC } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[randomR][randomC] = value;
  }

  restart() {
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
  }
}

export default Game;
