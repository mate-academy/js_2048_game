'use strict';

// const Game = require('../modules/Game.class');

class Game {
  constructor() {
    this.gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.cells = document.querySelectorAll('.field-cell');
    this.scoreEl = document.querySelector('.game-score');
    this.startButton = document.querySelector('.start');

    this.startButton.addEventListener('click', () => this.startGame());
    document.addEventListener('keydown', (e) => this.handleKey(e));
  }

  startGame() {
    this.gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.addRandomNumber();
    this.addRandomNumber();

    this.updateBoard();
  }

  updateBoard() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cellEl = this.cells[i * 4 + j];
        const value = this.gameField[i][j];

        cellEl.textContent = value === 0 ? '' : value;

        cellEl.className =
          'field-cell' + (value ? ` field-cell--${value}` : '');
      }
    }
    this.scoreEl.textContent = this.score;
  }

  getRandomEmptyCell() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.gameField[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  addRandomNumber() {
    const cell = this.getRandomEmptyCell();

    if (!cell) {
      return;
    }

    const [i, j] = cell;

    this.gameField[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  slideLeft(row) {
    let newRow = row.filter((n) => n !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter((n) => n !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  slideRight(row) {
    return this.slideLeft(row.slice().reverse()).reverse();
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveUp() {
    this.gameField = this.transpose(this.gameField);

    for (let i = 0; i < 4; i++) {
      this.gameField[i] = this.slideLeft(this.gameField[i]);
    }
    this.gameField = this.transpose(this.gameField);
  }

  moveDown() {
    this.gameField = this.transpose(this.gameField);

    for (let i = 0; i < 4; i++) {
      this.gameField[i] = this.slideRight(this.gameField[i]);
    }
    this.gameField = this.transpose(this.gameField);
  }

  handleKey(e) {
    switch (e.key) {
      case 'ArrowLeft':
        for (let i = 0; i < 4; i++) {
          this.gameField[i] = this.slideLeft(this.gameField[i]);
        }
        break;
      case 'ArrowRight':
        for (let i = 0; i < 4; i++) {
          this.gameField[i] = this.slideRight(this.gameField[i]);
        }
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      default:
        return;
    }

    this.addRandomNumber();
    this.updateBoard();
    this.checkWin();
    this.checkLose();
  }

  checkWin() {
    for (const row of this.gameField) {
      if (row.includes(2048)) {
        alert('You win!');

        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.gameField[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.gameField[i][j] === this.gameField[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.gameField[i][j] === this.gameField[i + 1][j]) {
          return false;
        }
      }
    }
    alert('You lose!');

    return true;
  }
}

const game = new Game();

window.game = game;
