/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
'use strict';
class Game {
  constructor(initialState) {
    this.board = initialState || this.generateEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  spawnRandomTile() {
    const emptyCells = [];

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.board[x][y] === 0) {
          emptyCells.push([x, y]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let row of this.board) {
      const newRow = row.filter((val) => val !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      const finalRow = newRow.filter((val) => val !== 0);

      while (finalRow.length < 4) {
        finalRow.push(0);
      }

      for (let i = 0; i < 4; i++) {
        row[i] = finalRow[i];
      }
    }

    if (moved) {
      this.spawnRandomTile();
    }

    return moved;
  }

  // Implement moveRight, moveUp, moveDown similarly...

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.generateEmptyBoard();
    this.spawnRandomTile();
    this.spawnRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.start();
    this.score = 0;
  }
}

// Game setup
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const startButton = document.querySelector('.button.start');
  const scoreDisplay = document.querySelector('.game-score');
  const messageContainer = document.querySelector('.message-container');

  const updateUI = () => {
    const board = game.getState();
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const x = Math.floor(index / 4);
      const y = index % 4;
      const value = board[x][y];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
    });
    scoreDisplay.textContent = game.getScore();
  };

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
      startButton.textContent = 'Restart';
    } else {
      game.restart();
    }
    updateUI();
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const moved =
      e.key === 'ArrowLeft' && game.moveLeft();

    if (moved) {
      updateUI();
    }
  });
});


