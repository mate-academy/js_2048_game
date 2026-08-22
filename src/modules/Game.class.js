'use strict';

class Game {
  constructor() {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.state = this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]); // ✅ ця функція тепер ES6 arrow
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.score = 0;
    this.status = 'playing';
    this.state = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => [...row].reverse(), true);
  }

  moveUp() {
    this.transpose();
    this.move((row) => row);
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.move((row) => [...row].reverse(), true);
    this.transpose();
  }

  move(transformRow, reverseBack = false) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    const newBoard = [];

    for (let i = 0; i < this.size; i++) {
      const originalRow = this.state[i];
      const workingRow = transformRow(originalRow); // тут має бути функція

      const { row: mergedRow, score } = this.mergeRow(workingRow);
      const finalRow = reverseBack ? [...mergedRow].reverse() : mergedRow;

      if (!this.rowsEqual(originalRow, finalRow)) {
        moved = true;
      }

      this.score += score;
      newBoard.push(finalRow);
    }

    if (!moved) {
      return;
    }

    this.state = newBoard;
    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';
    } else if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  mergeRow(row) {
    const filtered = row.filter((n) => n !== 0);
    const result = [];
    let gained = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;

        result.push(value);
        gained += value;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    return { row: result, score: gained };
  }

  rowsEqual(a, b) {
    return a.every((val, i) => val === b[i]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose() {
    const newBoard = this.createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[i][j] = this.state[j][i];
      }
    }
    this.state = newBoard;
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  hasMoves() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.state[i][j];

        if (value === 0) {
          return true;
        }

        if (i < this.size - 1 && value === this.state[i + 1][j]) {
          return true;
        }

        if (j < this.size - 1 && value === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game; // ✅ експорт ES6
