'use strict';

/**
 * Game class implementation for 2048.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.reverse());
  }

  moveUp() {
    this.moveColumns((col) => col);
  }

  moveDown() {
    this.moveColumns((col) => col.reverse());
  }

  move(transformRow) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      let row = transformRow([...this.board[i]]);
      const compressed = this.compressRow(row);
      const merged = this.mergeRow(compressed);
      const finalRow = this.compressRow(merged);

      if (row.toString() !== finalRow.toString()) {
        moved = true;
        row = finalRow;
      }

      this.board[i] = transformRow([...row]);
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveColumns(transformCol) {
    this.transpose();
    this.move(transformCol);
    this.transpose();
  }

  compressRow(row) {
    return row
      .filter((num) => num !== 0)
      .concat(Array(4 - row.filter((num) => num !== 0).length).fill(0));
  }

  mergeRow(row) {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
        i++;
      }
    }

    return row;
  }

  transpose() {
    const firstRow = this.board[0];

    this.board = firstRow.map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  checkGameOver() {
    if (this.board.flat().includes(0)) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return;
        }
      }
    }
    this.status = 'gameover';
    alert('Game Over!');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, idx) => val === b[idx]);
  }
}

module.exports = Game;
