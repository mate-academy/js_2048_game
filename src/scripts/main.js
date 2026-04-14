'use strict';
// import { Game } from '../modules/Game.class';
// Uncomment the next lines to use your game instance in the browser

this.board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getEmptyCells() {
    const cells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          cells.push([i, j]);
        }
      }
    }

    return cells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (!empty.length) {
      return;
    }

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];

    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  moveRowLeft(row) {
    const filtered = row.filter((x) => x !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
        i++;
      }
    }

    const merged = filtered.filter((x) => x !== 0);

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  moveLeft() {
    const old = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.moveRowLeft(row));

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    const old = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversed = [...row].reverse();
      const moved = this.moveRowLeft(reversed);

      return moved.reverse();
    });

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  moveUp() {
    const old = JSON.stringify(this.board);

    let transposed = this.transpose(this.board);

    transposed = transposed.map((row) => this.moveRowLeft(row));
    this.board = this.transpose(transposed);

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    const old = JSON.stringify(this.board);

    let transposed = this.transpose(this.board);

    transposed = transposed.map((row) => {
      const reversed = [...row].reverse();
      const moved = this.moveRowLeft(reversed);

      return moved.reverse();
    });

    this.board = this.transpose(transposed);

    if (JSON.stringify(this.board) !== old) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  updateStatus() {
    // WIN
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    // чи є пусті
    if (this.getEmptyCells().length > 0) {
      this.status = 'playing';

      return;
    }

    // перевірка можливих ходів
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const val = this.board[i][j];

        if (this.board[i + 1]?.[j] === val || this.board[i]?.[j + 1] === val) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }
}

const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});

// const Game = require('../modules/Game.class');
// const game = new Game();
