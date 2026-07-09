'use strict';

/**
 * This class represents the game.
 */
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.highscore = 0;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let y = 0; y < 4; y++) {
      let row = this.board[y].filter((val) => val !== 0);

      for (let x = 0; x < row.length - 1; x++) {
        if (row[x] === row[x + 1]) {
          row[x] *= 2;
          this.score += row[x];
          row[x + 1] = 0;
          moved = true;
        }
      }
      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      if (this.board[y].join(',') !== row.join(',')) {
        moved = true;
      }
      this.board[y] = row;
    }

    if (moved) {
      this.AddloopclearRandomAdd();
    }
    this.Victory();
    this.Gameover();
  }

  moveRight() {
    let moved = false;

    for (let y = 0; y < 4; y++) {
      let row = this.board[y].filter((val) => val !== 0);

      for (let x = row.length - 1; x > 0; x--) {
        if (row[x] === row[x - 1]) {
          row[x] *= 2;
          this.score += row[x];
          row[x - 1] = 0;
          moved = true;
        }
      }
      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }

      if (this.board[y].join(',') !== row.join(',')) {
        moved = true;
      }
      this.board[y] = row;
    }

    if (moved) {
      this.AddloopclearRandomAdd();
    }
    this.Victory();
    this.Gameover();
  }

  moveUp() {
    let moved = false;

    for (let x = 0; x < 4; x++) {
      let col = [];

      for (let y = 0; y < 4; y++) {
        col.push(this.board[y][x]);
      }

      col = col.filter((val) => val !== 0);

      for (let y = 0; y < col.length - 1; y++) {
        if (col[y] === col[y + 1]) {
          col[y] *= 2;
          this.score += col[y];
          col[y + 1] = 0;
          moved = true;
        }
      }
      col = col.filter((val) => val !== 0);

      while (col.length < 4) {
        col.push(0);
      }

      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== col[y]) {
          moved = true;
        }
        this.board[y][x] = col[y];
      }
    }

    if (moved) {
      this.AddloopclearRandomAdd();
    }
    this.Victory();
    this.Gameover();
  }

  moveDown() {
    let moved = false;

    for (let x = 0; x < 4; x++) {
      let col = [];

      for (let y = 0; y < 4; y++) {
        col.push(this.board[y][x]);
      }

      col = col.filter((val) => val !== 0);

      for (let y = col.length - 1; y > 0; y--) {
        if (col[y] === col[y - 1]) {
          col[y] *= 2;
          this.score += col[y];
          col[y - 1] = 0;
          moved = true;
        }
      }

      col = col.filter((val) => val !== 0);

      while (col.length < 4) {
        col.unshift(0);
      }

      for (let y = 0; y < 4; y++) {
        if (this.board[y][x] !== col[y]) {
          moved = true;
        }
        this.board[y][x] = col[y];
      }
    }

    if (moved) {
      this.AddloopclearRandomAdd();
    }
    this.Victory();
    this.Gameover();
  }

  getScore() {
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }

    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle' || this.status === 'lose') {
      this.status = 'playing';
      this.AddloopclearRandomAdd();
      this.AddloopclearRandomAdd();
      this.getScore();
    }
  }

  restart() {
    this.status = 'playing';

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.board[y][x] = 0;
      }
    }
    this.AddloopclearRandomAdd();
    this.AddloopclearRandomAdd();
    this.getScore();
  }

  AddloopclearRandomAdd() {
    const emptyCells = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ y, x });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const targetCell = emptyCells[randomIndex];
      const y = targetCell.y;
      const x = targetCell.x;

      this.board[y][x] = Math.random() <= 0.1 ? 4 : 2;
    }
  }

  Victory() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const current = this.board[y][x];

        if (current >= 2048) {
          this.status = 'win';
        }
      }
    }
  }

  Gameover() {
    let zeros = 0;

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const current = this.board[y][x];

        if (current === 0) {
          zeros += 1;
        }

        if (x < 3 && current === this.board[y][x + 1]) {
          return;
        }

        if (y < 3 && current === this.board[y + 1][x]) {
          return;
        }
      }
    }

    if (zeros > 0) {
    } else {
      this.status = 'lose';

      return true;
    }
  }
}

export default Game;

// module.exports = Game;
