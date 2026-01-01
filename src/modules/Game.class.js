'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;

    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));

    this.restart();
  }

  // ------------------------------
  // GAME CONTROL
  // ------------------------------

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  // ------------------------------
  // MOVES
  // ------------------------------

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.reverse(), true, true);
  }

  moveUp() {
    this.move(null, true);
  }

  moveDown() {
    this.move(null, true, true);
  }

  move(transformRow, vertical = false, reverse = false) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);
    let lines = vertical ? this.transpose(this.board) : this.board;

    lines = lines.map((row) => {
      let line = [...row];

      if (reverse) {
        line.reverse();
      }

      if (transformRow) {
        line = transformRow(line);
      }

      line = this.mergeLine(line);

      if (reverse) {
        line.reverse();
      }

      return line;
    });

    this.board = vertical ? this.transpose(lines) : lines;

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkStatus();

      return true;
    }

    return false;
  }

  mergeLine(line) {
    const filtered = line.filter((n) => n !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        this.score += merged;
        result.push(merged);
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return result;
  }

  // ------------------------------
  // RANDOM TILE
  // ------------------------------

  addRandomTile() {
    const emptyCells = [];

    for (let rIdx = 0; rIdx < this.size; rIdx++) {
      for (let cIdx = 0; cIdx < this.size; cIdx++) {
        if (this.board[rIdx][cIdx] === 0) {
          emptyCells.push([rIdx, cIdx]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const [rTile, cTile] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[rTile][cTile] = Math.random() < 0.1 ? 4 : 2;
  }

  // ------------------------------
  // GAME STATUS
  // ------------------------------

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let rIdx = 0; rIdx < this.size; rIdx++) {
      for (let cIdx = 0; cIdx < this.size; cIdx++) {
        if (this.board[rIdx][cIdx] === 0) {
          return true;
        }

        if (
          cIdx < this.size - 1 &&
          this.board[rIdx][cIdx] === this.board[rIdx][cIdx + 1]
        ) {
          return true;
        }

        if (
          rIdx < this.size - 1 &&
          this.board[rIdx][cIdx] === this.board[rIdx + 1][cIdx]
        ) {
          return true;
        }
      }

      return false;
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

    // ------------------------------
    // GETTERS
    // ------------------------------

  getState() {
    return this.board.map((row) => [...row]);
  }

    getScore() {
      return this.score;
    }

    getStatus() {
      return this.status;
    }
  }

export default Game;
