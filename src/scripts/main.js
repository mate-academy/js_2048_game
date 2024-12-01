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
const cells = [...rows].flatMap((row) => row.querySelectorAll('td'));
const startButton = document.querySelector('.start');

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
    return this.score;
  }

  resetBoard() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        board[i][j] = 0;
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
  }

  restart() {
    this.resetBoard();
    this.status = 'start';
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return false;
        }

        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
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
        if (board[row][col] !== 0) {
          if (targetRow > row) {
            if (
              board[row][col] === board[targetRow][col] &&
              lastRow !== targetRow
            ) {
              board[targetRow][col] *= 2;
              board[row][col] = 0;
              lastRow = targetRow;
            } else {
              if (board[targetRow][col] === 0) {
                board[targetRow][col] = board[row][col];
                board[row][col] = 0;
              } else {
                targetRow--;

                if (targetRow > row) {
                  board[targetRow][col] = board[row][col];
                  board[row][col] = 0;
                }
              }
            }
          }
        }
      }
    }
    this.changeBoard();
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      let targetCol = 0;
      let firstCol = -1;

      for (let col = 0; col < 4; col++) {
        if (board[row][col] !== 0) {
          if (targetCol < col) {
            if (
              board[row][col] === board[row][targetCol] &&
              firstCol !== targetCol
            ) {
              board[row][targetCol] *= 2;
              board[row][col] = 0;
              firstCol = targetCol;
            } else if (board[row][targetCol] === 0) {
              board[row][targetCol] = board[row][col];
              board[row][col] = 0;
            } else {
              targetCol++;
              board[row][targetCol] = board[row][col];
              board[row][col] = 0;
            }
          }
        }
      }
    }
    this.changeBoard();
  }

  moveRight() {
    for (let row = 0; row <= 3; row++) {
      let targetCol = 3;
      let firstCol = -1;

      for (let col = 3; col >= 0; col--) {
        if (board[row][col] !== 0) {
          if (targetCol > col) {
            if (
              board[row][col] === board[row][targetCol] &&
              firstCol !== targetCol
            ) {
              board[row][targetCol] *= 2;
              board[row][col] = 0;
              firstCol = targetCol;
            } else if (board[row][targetCol] === 0) {
              board[row][targetCol] = board[row][col];
              board[row][col] = 0;
            } else {
              targetCol--;
              board[row][targetCol] = board[row][col];
              board[row][col] = 0;
            }
          }
        }
      }
    }
    this.changeBoard();
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      let targetRow = 0;
      let firstRow = -1;

      for (let row = 0; row <= 3; row++) {
        if (board[row][col] !== 0) {
          if (targetRow < row) {
            if (
              board[row][col] === board[targetRow][col] &&
              firstRow !== targetRow
            ) {
              board[targetRow][col] *= 2;
              board[row][col] = 0;
              firstRow = targetRow;
            } else if (board[targetRow][col] === 0) {
              board[targetRow][col] = board[row][col];
              board[row][col] = 0;
            } else {
              targetRow++;
              board[targetRow][col] = board[row][col];
              board[row][col] = 0;
            }
          }
        }
      }
    }
    this.changeBoard();
  }

  spawnCell() {
    const nullCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          nullCells.push({ x: i, y: j });
        }
      }
    }

    if (nullCells.length !== 0) {
      const randomCell = Math.floor(Math.random() * nullCells.length);
      const { x, y } = nullCells[randomCell];

      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  changeBoard() {
    for (let row = 0; row < rows.length; row++) {
      const rowCells = rows[row].querySelectorAll('td');

      for (let i = 0; i < rowCells.length; i++) {
        const value = board[row][i];

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
