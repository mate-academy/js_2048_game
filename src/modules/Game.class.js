'use strict';

class Game {
  static STATUS = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = Game.STATUS.IDLE;
    this.score = 0;
  }

  moveLeft() {
    const newState = [];
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((cell) => cell !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
          j++;
        }
      }

      const newRow = row.filter((cell) => cell !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.state[i].every((val, idx) => val === newRow[idx])) {
        moved = true;
      }

      newState.push(newRow);
    }

    if (!moved) {
      return false;
    }

    this.state = newState;
    this.checkWin();

    return true;
  }

  moveRight() {
    const newState = [];
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((cell) => cell !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          this.score += row[j];
          j--;
        }
      }

      const newRow = row.filter((cell) => cell !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (!this.state[i].every((val, idx) => val === newRow[idx])) {
        moved = true;
      }

      newState.push(newRow);
    }

    if (!moved) {
      return false;
    }

    this.state = newState;
    this.checkWin();

    return true;
  }

  moveUp() {
    this.state = this.transpose(this.state);

    const moved = this.moveLeft();

    this.state = this.transpose(this.state);

    return moved;
  }

  moveDown() {
    this.state = this.transpose(this.state);

    const moved = this.moveRight();

    this.state = this.transpose(this.state);

    return moved;
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
    this.status = Game.STATUS.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = Game.STATUS.IDLE;
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (!emptyCells.length) {
      this.checkLose();

      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.STATUS.WIN;

          return;
        }
      }
    }
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return;
        }

        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return;
        }
      }
    }
    this.status = Game.STATUS.LOSE;
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }
}

module.exports = Game;
