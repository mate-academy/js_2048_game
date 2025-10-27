'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.initialState = this._normalize(initialState);
    this.board = this._clone(this.initialState);
    this.score = 0;
    this.status = 'start'; // start | playing | won | over
  }

  getState() {
    return this._clone(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this._reset();

    if (this._isEmpty(this.board)) {
      this._spawn();
      this._spawn();
    }
    this.status = 'playing';
  }

  restart() {
    this._reset();
    this.status = 'start';
  }

  moveLeft() {
    return this._move('left');
  }
  moveRight() {
    return this._move('right');
  }
  moveUp() {
    return this._move('up');
  }
  moveDown() {
    return this._move('down');
  }

  // ---------------- helpers ----------------
  _move(dir) {
    if (this.status !== 'playing') {
      return false;
    }

    const transform = this._transform(dir);
    const board = transform.to(this.board);
    let moved = false;
    let gained = 0;

    for (let r = 0; r < this.size; r++) {
      const row = board[r];
      const { newRow, score, changed } = this._mergeRow(row);

      board[r] = newRow;
      gained += score;

      if (changed) {
        moved = true;
      }
    }

    if (moved) {
      this.board = transform.from(board);
      this.score += gained;
      this._spawn();

      if (this._hasTile(2048)) {
        this.status = 'won';
      } else if (!this._canMove()) {
        this.status = 'over';
      }
    }

    return moved;
  }

  _mergeRow(row) {
    const tiles = row.filter((v) => v !== 0);
    const merged = [];
    let score = 0;

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === tiles[i + 1]) {
        const val = tiles[i] * 2;

        merged.push(val);
        score += val;
        i++;
      } else {
        merged.push(tiles[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return {
      newRow: merged,
      score,
      changed: !this._equal(row, merged),
    };
  }

  _spawn() {
    const empties = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          empties.push([row, col]);
        }
      }
    }

    if (!empties.length) {
      return;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
  }

  _canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const v = this.board[row][col];

        if (v === 0) {
          return true;
        }

        if (col + 1 < this.size && this.board[row][col + 1] === v) {
          return true;
        }

        if (row + 1 < this.size && this.board[row + 1][col] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _hasTile(val) {
    return this.board.some((row) => row.includes(val));
  }

  _transform(dir) {
    switch (dir) {
      case 'left':
        return { to: (b) => this._clone(b), from: (b) => this._clone(b) };
      case 'right':
        return {
          to: (b) => b.map((r) => r.slice().reverse()),
          from: (b) => b.map((r) => r.slice().reverse()),
        };
      case 'up':
        return {
          to: (b) => this._transpose(b),
          from: (b) => this._transpose(b),
        };
      case 'down':
        return {
          to: (b) => this._transpose(b).map((r) => r.reverse()),
          from: (b) => this._transpose(b.map((r) => r.reverse())),
        };
    }
  }

  _transpose(b) {
    return b[0].map((_, c) => b.map((r) => r[c]));
  }

  _equal(a, b) {
    return a.every((v, i) => v === b[i]);
  }

  _clone(b) {
    return b.map((r) => r.slice());
  }

  _normalize(init) {
    if (!init) {
      return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    return init.map((r) => r.slice());
  }

  _isEmpty(b) {
    return b.flat().every((v) => v === 0);
  }

  _reset() {
    this.board = this._clone(this.initialState);
    this.score = 0;
  }
}

export default Game;
