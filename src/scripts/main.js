'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const table = document.querySelector('.game-field');
const tBody = table.querySelector('tbody');
const rows = tBody.querySelectorAll('tr');
const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const restartButton = document.querySelector('.restart');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(board);

  startButton.addEventListener('click', () => {
    game.start();
  });
});

class Game {
  constructor(initialState = []) {
    this.state = initialState;
    this.score = 0;
    this.status = 'start';
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    gameScore.textContent = this.score;
  }

  resetBoard() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.state[i][j] = 0;
      }
    }
    this.score = 0;
  }

  start() {
    this.status = 'inProcess';
    this.resetBoard();
    this.spawnCell();
    this.spawnCell();
    this.changeBoard();
    document.removeEventListener('keydown', this.handleKeyPress);
    document.addEventListener('keydown', this.handleKeyPress);
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
  }

  restart() {
    restartButton.addEventListener('click', () => {
      this.resetBoard();
      this.status = 'start';
    });
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }

        if (
          (i < 3 && this.state[i][j] === this.state[i + 1][j]) ||
          (j < 3 && this.state[i][j] === this.state[i][j + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  handleKeyPress(e) {
    switch (e.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
    }
  }

  moveDown() {
    for (let col = 0; col < 4; col++) {
      let targetRow = 3;
      let lastRow = -1;

      for (let row = 3; row >= 0; row--) {
        if (this.state[row][col] !== 0) {
          if (targetRow > row) {
            if (
              this.state[row][col] === this.state[targetRow][col] &&
              lastRow !== targetRow
            ) {
              this.state[targetRow][col] *= 2;
              this.state[row][col] = 0;
              lastRow = targetRow;
              this.score += this.state[targetRow][col];
              this.getScore();
            } else {
              if (this.state[targetRow][col] === 0) {
                this.state[targetRow][col] = this.state[row][col];
                this.state[row][col] = 0;
              } else {
                targetRow--;

                if (targetRow > row) {
                  this.state[targetRow][col] = this.state[row][col];
                  this.state[row][col] = 0;
                }
              }
            }
          }
        }
      }
    }
    this.spawnCell();
    this.changeBoard();
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      let targetCol = 0;
      let firstCol = -1;

      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] !== 0) {
          if (targetCol < col) {
            if (
              this.state[row][col] === this.state[row][targetCol] &&
              firstCol !== targetCol
            ) {
              this.state[row][targetCol] *= 2;
              this.state[row][col] = 0;
              firstCol = targetCol;
              this.score += this.state[row][targetCol];
              this.getScore();
            } else if (this.state[row][targetCol] === 0) {
              this.state[row][targetCol] = this.state[row][col];
              this.state[row][col] = 0;
            } else {
              targetCol++;
              this.state[row][targetCol] = this.state[row][col];
              this.state[row][col] = 0;
            }
          }
        }
      }
    }
    this.spawnCell();
    this.changeBoard();
  }

  moveRight() {
    for (let row = 0; row <= 3; row++) {
      let targetCol = 3;
      let firstCol = -1;

      for (let col = 3; col >= 0; col--) {
        if (this.state[row][col] !== 0) {
          if (targetCol > col) {
            if (
              this.state[row][col] === this.state[row][targetCol] &&
              firstCol !== targetCol
            ) {
              this.state[row][targetCol] *= 2;
              this.state[row][col] = 0;
              firstCol = targetCol;
              this.score += this.state[row][targetCol];
              this.getScore();
            } else if (this.state[row][targetCol] === 0) {
              this.state[row][targetCol] = this.state[row][col];
              this.state[row][col] = 0;
            } else {
              targetCol--;
              this.state[row][targetCol] = this.state[row][col];
              this.state[row][col] = 0;
            }
          }
        }
      }
    }
    this.spawnCell();
    this.changeBoard();
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      let targetRow = 0;
      let firstRow = -1;

      for (let row = 0; row <= 3; row++) {
        if (this.state[row][col] !== 0) {
          if (targetRow < row) {
            if (
              this.state[row][col] === this.state[targetRow][col] &&
              firstRow !== targetRow
            ) {
              this.state[targetRow][col] *= 2;
              this.state[row][col] = 0;
              firstRow = targetRow;
              this.score += this.state[targetRow][col];
              this.getScore();
            } else if (this.state[targetRow][col] === 0) {
              this.state[targetRow][col] = this.state[row][col];
              this.state[row][col] = 0;
            } else {
              targetRow++;
              this.state[targetRow][col] = this.state[row][col];
              this.state[row][col] = 0;
            }
          }
        }
      }
    }
    this.spawnCell();
    this.changeBoard();
  }

  spawnCell() {
    const nullCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          nullCells.push({ x: i, y: j });
        }
      }
    }

    if (nullCells.length !== 0) {
      const randomCell = Math.floor(Math.random() * nullCells.length);
      const { x, y } = nullCells[randomCell];

      this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  changeBoard() {
    for (let row = 0; row < rows.length; row++) {
      const rowCells = rows[row].querySelectorAll('td');

      for (let i = 0; i < rowCells.length; i++) {
        const value = this.state[row][i];

        if (value !== 0) {
          rowCells[i].textContent = value;
          rowCells[i].className = `field-cell field-cell--${value}`;
        } else {
          rowCells[i].textContent = '';
          rowCells[i].className = 'field-cell';
        }
      }
    }
  }
}
