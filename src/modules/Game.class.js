'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => row.slice())
      : Game.createEmptyState();

    this.state = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.isBoardEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.makeMove('left');
  }

  moveRight() {
    return this.makeMove('right');
  }

  moveUp() {
    return this.makeMove('up');
  }

  moveDown() {
    return this.makeMove('down');
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let result;

    if (direction === 'left') {
      result = this.moveLeftOnState(this.state);
    } else if (direction === 'right') {
      result = this.moveRightOnState(this.state);
    } else if (direction === 'up') {
      const t = Game.transpose(this.state);
      const moved = this.moveLeftOnState(t);

      result = {
        state: Game.transpose(moved.state),
        scoreDelta: moved.scoreDelta,
        changed: moved.changed,
      };
    } else if (direction === 'down') {
      const t = Game.transpose(this.state);
      const moved = this.moveRightOnState(t);

      result = {
        state: Game.transpose(moved.state),
        scoreDelta: moved.scoreDelta,
        changed: moved.changed,
      };
    } else {
      return false;
    }

    if (!result.changed) {
      return false;
    }

    this.state = result.state;
    this.score += result.scoreDelta;

    if (this.has2048()) {
      this.status = 'win';

      return true;
    }

    this.addRandomTile();

    if (!this.hasAnyMoves()) {
      this.status = 'lose';
    }

    return true;
  }

  moveLeftOnState(state) {
    let scoreDelta = 0;
    let changed = false;

    const newState = state.map((row) => {
      const res = Game.slideRowLeft(row);

      scoreDelta += res.score;

      if (res.changed) {
        changed = true;
      }

      return res.row;
    });

    return { state: newState, scoreDelta, changed };
  }

  moveRightOnState(state) {
    let scoreDelta = 0;
    let changed = false;

    const newState = state.map((row) => {
      const reversed = row.slice().reverse();
      const res = Game.slideRowLeft(reversed);

      scoreDelta += res.score;

      const finalRow = res.row.slice().reverse();
      const rowChanged = !row.every((v, i) => v === finalRow[i]);

      if (rowChanged) {
        changed = true;
      }

      return finalRow;
    });

    return { state: newState, scoreDelta, changed };
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[cell.row][cell.col] = value;
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

  has2048() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardEmpty() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  hasAnyMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const v = this.state[r][c];

        if (c + 1 < 4 && this.state[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < 4 && this.state[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  static createEmptyState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  static transpose(matrix) {
    const res = Game.createEmptyState();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][r] = matrix[r][c];
      }
    }

    return res;
  }

  static slideRowLeft(row) {
    let score = 0;

    let nums = row.filter((v) => v !== 0);

    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] === nums[i + 1]) {
        nums[i] *= 2;
        score += nums[i];
        nums[i + 1] = 0;
        i++;
      }
    }

    nums = nums.filter((v) => v !== 0);

    while (nums.length < 4) {
      nums.push(0);
    }

    const changed = !row.every((v, idx) => v === nums[idx]);

    return { row: nums, score, changed };
  }
}

export default Game;
