'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]) {
    this.INITIAL_STATE = initialState;
    this.state = JSON.parse(JSON.stringify(this.INITIAL_STATE));
    this.score = 0;
    this.status = 'idle';
    this.buttonStart = document.querySelector('.start');
    this.initializeGame();
  }

  initializeGame() {
    this.buttonStart.addEventListener('click', () => {
      if (this.status === 'idle'
        || this.status === 'lose'
        || this.status === 'win'
      ) {
        this.start();
      } else {
        this.restart();
      }

      this.updateUI();
      document.querySelector('.message-win').classList.add('hidden');
      document.querySelector('.message-lose').classList.add('hidden');
    });
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.state[row].filter(value => value !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
          moved = true;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (this.state[row].join('') !== newRow.join('')) {
        moved = true;
      }
      this.state[row] = newRow;
    }

    if (moved) {
      this.addNewTile();
      this.updateUI();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.state = this.state.map(row => row.reverse());
    this.moveLeft();
    this.state = this.state.map(row => row.reverse());
  }

  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
  }

  moveDown() {
    this.state = this.transpose(this.state).map(row => row.reverse());
    this.moveLeft();
    this.state = this.state.map(row => row.reverse());
    this.state = this.transpose(this.state);
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.addNewTile();
    this.addNewTile();
    this.updateUI();

    const messageStart = document.querySelector('.message-start');

    messageStart.classList.add('hidden');
    this.buttonStart.textContent = 'Restart';
    this.buttonStart.classList.replace('start', 'restart');
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.INITIAL_STATE));
    this.score = 0;
    this.status = 'idle';
    this.updateUI();

    const messageStart = document.querySelector('.message-start');

    messageStart.classList.remove('hidden');
    this.buttonStart.textContent = 'Start';
    this.buttonStart.classList.replace('restart', 'start');
  }

  addNewTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({
            row: r, col: c,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col }
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateUI() {
    const gameCells = document.querySelectorAll('.field-cell');

    gameCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const cellValue = this.state[row][col];

      cell.textContent = cellValue > 0 ? cellValue : '';

      cell.className
        = `field-cell ${cellValue > 0 ? `field-cell--${cellValue}` : ''}`;
    });

    document.querySelector('.game-score').textContent = this.score;

    if (this.status === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
    } else if (this.status === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  checkGameStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return false;
        }

        if (r > 0 && this.state[r][c] === this.state[r - 1][c]) {
          return false;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return false;
        }

        if (c > 0 && this.state[r][c] === this.state[r][c - 1]) {
          return false;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
