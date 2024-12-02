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
const winMessage = document.querySelector('.win-message');

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
  }

  restart() {
    restartButton.addEventListener('click', () => {
      this.resetBoard();
      this.status = 'start';
    });
  }

  isGameWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          winMessage.className = 'message message-win';

          setTimeout(() => {
            loseMessage.remove();
          }, 10000);
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
      loseMessage.className = 'message message-lose';

      setTimeout(() => {
        loseMessage.remove();
      }, 10000);
    }
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
    const newState = [0, 1, 2, 3].map((col) => {
      const column = this.state
        .map((row) => row[col])
        .filter((cell) => cell !== 0); // Вибираємо колонку без нулів

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i]; // Додаємо очки
        }
      }

      const compressed = column.filter((cell) => cell !== 0);

      return [...Array(4 - compressed.length).fill(0), ...compressed];
    });

    // Транспонуємо назад у формат рядків
    this.state = [0, 1, 2, 3].map((row) => newState.map((col) => col[row]));

    this.spawnCell();
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveLeft() {
    const newState = this.state.map((row) => {
      const filtered = row.filter((cell) => cell !== 0); // Видаляємо нулі

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.score += filtered[i]; // Додаємо очки
        }
      }

      const compressed = filtered.filter((cell) => cell !== 0);

      return [...compressed, ...Array(4 - compressed.length).fill(0)];
    });

    this.state = newState;
    this.spawnCell();
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveRight() {
    const newState = this.state.map((row) => {
      const reversed = [...row].reverse().filter((cell) => cell !== 0);

      for (let i = 0; i < reversed.length - 1; i++) {
        if (reversed[i] === reversed[i + 1]) {
          reversed[i] *= 2;
          reversed[i + 1] = 0;
          this.score += reversed[i];
        }
      }

      const compressed = reversed.filter((cell) => cell !== 0);

      const result = [...Array(4 - compressed.length).fill(0), ...compressed];

      return result;
    });

    this.state = newState;
    this.spawnCell();
    this.changeBoard();
    this.isGameWin();
    this.isGameOver();
    this.getScore();
  }

  moveUp() {
    const newState = [0, 1, 2, 3].map((col) => {
      const column = this.state
        .map((row) => row[col])
        .filter((cell) => cell !== 0); // Вибираємо колонку без нулів

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i]; // Додаємо очки
        }
      }

      const compressed = column.filter((cell) => cell !== 0);

      return [...compressed, ...Array(4 - compressed.length).fill(0)];
    });

    // Транспонуємо назад у формат рядків
    this.state = [0, 1, 2, 3].map((row) => newState.map((col) => col[row]));
    this.spawnCell();
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
