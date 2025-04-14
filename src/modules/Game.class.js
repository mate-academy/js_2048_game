'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const table = document.querySelector('.game-field');
const tBody = table.querySelector('tbody');
const rows = tBody.querySelectorAll('tr');
const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const restartButton = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

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

    return this.score;
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
    startMessage.remove();
    winMessage.className = 'message message-win hidden';
    loseMessage.className = 'message message-min hidden';
  }

  restart() {
    restartButton.removeEventListener('click', this.handleRestart);

    this.handleRestart = () => {
      this.resetBoard();
      this.status = 'start';
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      this.start();
    };
    restartButton.addEventListener('click', this.handleRestart);
  }

  isGameWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';
          winMessage.className = 'message message-win';
        }
      }
    }
  }

  isGameOver() {
    let ansver = true;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          ansver = false;
        }

        if (
          (i < 3 && this.state[i][j] === this.state[i + 1][j]) ||
          (j < 3 && this.state[i][j] === this.state[i][j + 1])
        ) {
          ansver = false;
        }
      }
    }

    if (ansver === true) {
      this.status = 'lose';
      loseMessage.className = 'message message-lose';
    }
  }

  handleKeyPress(e) {
    if (this.status === 'inProcess') {
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
  }

  moveDown() {
    const previousState = JSON.stringify(this.state);

    const newState = [0, 1, 2, 3].map((col) => {
      const column = this.state
        .map((row) => row[col])
        .filter((cell) => cell !== 0);

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i];
        }
      }

      const compressed = column.filter((cell) => cell !== 0);

      return [...Array(4 - compressed.length).fill(0), ...compressed];
    });

    this.state = [0, 1, 2, 3].map((row) => newState.map((col) => col[row]));

    if (JSON.stringify(this.state) !== previousState) {
      this.spawnCell();
    }
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveLeft() {
    const previousState = JSON.stringify(this.state);

    const newState = this.state.map((row) => {
      const filtered = row.filter((cell) => cell !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.score += filtered[i];
        }
      }

      const compressed = filtered.filter((cell) => cell !== 0);

      return [...compressed, ...Array(4 - compressed.length).fill(0)];
    });

    this.state = newState;

    if (JSON.stringify(this.state) !== previousState) {
      this.spawnCell();
    }
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveRight() {
    const previousState = JSON.stringify(this.state);
    const newState = this.state.map((row, rowIndex) => {
      const reversed = [...row].reverse();

      const filtered = reversed.filter((cell) => cell !== 0);

      const merged = Array(4).fill(false);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1] && !merged[i] && !merged[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          merged[i] = true;
          this.score += filtered[i];
        }
      }

      const compressed = filtered.filter((cell) => cell !== 0);

      const result = [
        ...compressed,
        ...Array(4 - compressed.length).fill(0),
      ].reverse();

      return result;
    });

    this.state = newState;

    if (JSON.stringify(this.state) !== previousState) {
      this.spawnCell();
    } else {
    }

    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveUp() {
    const previousState = JSON.stringify(this.state);

    const newState = [0, 1, 2, 3].map((col) => {
      const column = this.state
        .map((row) => row[col])
        .filter((cell) => cell !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
        }
      }

      const compressed = column.filter((cell) => cell !== 0);

      return [...compressed, ...Array(4 - compressed.length).fill(0)];
    });

    this.state = [0, 1, 2, 3].map((row) => newState.map((col) => col[row]));

    if (JSON.stringify(this.state) !== previousState) {
      this.spawnCell();
    }
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
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

module.exports = Game;
