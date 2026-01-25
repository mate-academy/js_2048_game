'use strict';

export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState ? this.clone(initialState) : null;

    if (this.initialState) {
      this.board = this.clone(this.initialState);
    } else {
      this.board = this.createEmptyBoard();
    }
  }

  clone(matrix) {
    return matrix.map((row) => [...row]);
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.clone(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.score = 0;
    this.status = 'playing';

    if (this.initialState) {
      this.board = this.clone(this.initialState);
    } else {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const { r: rowIndex, c: colIndex } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  processLine(line) {
    const compact = line.filter((x) => x !== 0);
    const result = [];
    let gained = 0;

    for (let i = 0; i < compact.length; i++) {
      if (compact[i] === compact[i + 1]) {
        const merged = compact[i] * 2;

        result.push(merged);
        gained += merged;
        i++;
      } else {
        result.push(compact[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    const changed = !this.arraysEqual(result, line);

    return { line: result, gained, changed };
  }

  moveLeft() {
    let totalGained = 0;
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const { line, gained, changed } = this.processLine(this.board[r]);

      if (changed) {
        this.board[r] = line;
        totalGained += gained;
        moved = true;
      }
    }

    if (moved) {
      this.score += totalGained;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    let totalGained = 0;
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const reversed = this.board[r].slice().reverse();
      const { line, gained, changed } = this.processLine(reversed);
      const final = line.slice().reverse();

      if (changed) {
        this.board[r] = final;
        totalGained += gained;
        moved = true;
      }
    }

    if (moved) {
      this.score += totalGained;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    let totalGained = 0;
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const column = this.board.map((row) => row[c]);
      const { line, gained, changed } = this.processLine(column);

      if (changed) {
        for (let r = 0; r < this.size; r++) {
          this.board[r][c] = line[r];
        }
        totalGained += gained;
        moved = true;
      }
    }

    if (moved) {
      this.score += totalGained;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    let totalGained = 0;
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const column = this.board.map((row) => row[c]).reverse();
      const { line, gained, changed } = this.processLine(column);
      const final = line.slice().reverse();

      if (changed) {
        for (let r = 0; r < this.size; r++) {
          this.board[r][c] = final[r];
        }
        totalGained += gained;
        moved = true;
      }
    }

    if (moved) {
      this.score += totalGained;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }
    this.status = this.hasMoves() ? 'playing' : 'lose';
  }

  hasMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.board[r][c];

        if (v === 0) {
          return true;
        }

        if (c < this.size - 1 && v === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && v === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}
