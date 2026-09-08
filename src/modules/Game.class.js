'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState;
    this.score = 0;
  }
  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      const res = [];
      const a = this.board[i].filter((e) => {
        if (e !== 0) {
          return e;
        }
      });

      let index = 0;

      while (index < a.length) {
        if (a[index] === a[index + 1]) {
          res.push(a[index] * 2);
          this.score += a[index] * 2;
          index = index + 2;
        } else {
          res.push(a[index]);
          index++;
        }
      }

      while (res.length < this.board[i].length) {
        res.push(0);
      }

      this.board[i] = res;
    }

    this.addRandomTile();
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const res = [];

      const a = this.board[i]
        .filter((e) => {
          if (e !== 0) {
            return e;
          }
        })
        .reverse();

      let index = 0;
      const m = [];

      while (index < a.length) {
        if (a[index] === a[index + 1]) {
          m.push(a[index] * 2);
          this.score += a[index] * 2;
          index = index + 2;
        } else {
          m.push(a[index]);
          index++;
        }
      }
      m.reverse();

      while (res.length < this.board[i].length - m.length) {
        res.push(0);
      }
      res.push(...m);

      this.board[i] = res;
    }

    this.addRandomTile();
  }

  moveUp() {
    for (let i = 0; i < this.board.length; i++) {
      const colum = [];

      for (let j = 0; j < this.board.length; j++) {
        colum.push(this.board[j][i]);
      }

      const res = [];

      const a = colum.filter((e) => {
        if (e !== 0) {
          return e;
        }
      });

      let index = 0;

      while (index < a.length) {
        if (a[index] === a[index + 1]) {
          res.push(a[index] * 2);
          this.score += a[index] * 2;
          index = index + 2;
        } else {
          res.push(a[index]);
          index++;
        }
      }

      while (res.length < this.board[i].length) {
        res.push(0);
      }

      for (let q = 0; q < this.board.length; q++) {
        this.board[q][i] = res[q];
      }
    }

    this.addRandomTile();
  }

  moveDown() {
    for (let i = 0; i < this.board.length; i++) {
      const colum = [];

      for (let j = 0; j < this.board.length; j++) {
        colum.push(this.board[j][i]);
      }

      const res = [];

      const a = colum
        .filter((e) => {
          if (e !== 0) {
            return e;
          }
        })
        .reverse();

      let index = 0;
      const m = [];

      while (index < a.length) {
        if (a[index] === a[index + 1]) {
          m.push(a[index] * 2);
          this.score += a[index] * 2;
          index = index + 2;
        } else {
          m.push(a[index]);
          index++;
        }
      }
      m.reverse();

      while (res.length < this.board[i].length - m.length) {
        res.push(0);
      }
      res.push(...m);

      for (let q = 0; q < this.board.length; q++) {
        this.board[q][i] = res[q];
      }
    }

    this.addRandomTile();
  }

  // Adds one random tile (2 or 4) into a random empty cell, if any exist.
  addRandomTile() {
    let hasEmpty = false;

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          hasEmpty = true;
        }
      }
    }

    if (hasEmpty) {
      let ind = 0;

      while (ind < 1) {
        const line = Math.floor(Math.random() * 4);
        const pillar = Math.floor(Math.random() * 4);

        if (this.board[line][pillar] === 0) {
          if (Math.random() > 0.9) {
            this.board[line][pillar] = 4;
            ind++;
          } else {
            this.board[line][pillar] = 2;
            ind++;
          }
        }
      }
    }
  }

  hasMoves() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (
          c + 1 < this.board[r].length &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return true;
        }

        if (
          r + 1 < this.board.length &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getBoard() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  getStatus() {
    if (this.score > 2048) {
      return 'win';
    }

    if (!this.hasMoves()) {
      return 'lose';
    }

    return 'playing';
  }

  start() {}
  restart() {
    this.score = 0;

    return (this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  }

  // Add your own methods here
}

module.exports = Game;
