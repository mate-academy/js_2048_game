// src/modules/Game.class.js
export default class Game {
  constructor(initialState = null) {
    this.SIZE = 4;
    this._score = 0;
    this._status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'

    this._state = initialState
      ? initialState.map((row) => [...row])
      : this._createEmptyBoard();
  }

  getState() {
    return this._state.map((row) => [...row]);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status === 'playing') {
      return;
    }
    this._status = 'playing';
    this._state = this._createEmptyBoard();
    this._score = 0;
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this._state = this._createEmptyBoard();
    this._score = 0;
    this._status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  moveLeft() {
    if (!this._canPlay()) {
      return false;
    }

    const changed = this._moveRows((row) => row.slice());

    if (changed) {
      this._afterMove();
    }

    return changed;
  }

  moveRight() {
    if (!this._canPlay()) {
      return false;
    }
    this._state = this._reverseRows(this._state);

    const changed = this._moveRows((row) => row.slice());

    this._state = this._reverseRows(this._state);

    if (changed) {
      this._afterMove();
    }

    return changed;
  }

  moveUp() {
    if (!this._canPlay()) {
      return false;
    }
    this._state = this._transpose(this._state);

    const changed = this._moveRows((row) => row.slice());

    this._state = this._transpose(this._state);

    if (changed) {
      this._afterMove();
    }

    return changed;
  }

  moveDown() {
    if (!this._canPlay()) {
      return false;
    }
    this._state = this._transpose(this._state);
    this._state = this._reverseRows(this._state);

    const changed = this._moveRows((row) => row.slice());

    this._state = this._reverseRows(this._state);
    this._state = this._transpose(this._state);

    if (changed) {
      this._afterMove();
    }

    return changed;
  }

  _createEmptyBoard() {
    return Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));
  }

  _canPlay() {
    return this._status !== 'win' && this._status !== 'lose';
  }

  _afterMove() {
    this._addRandomTile();

    if (this._checkWin()) {
      this._status = 'win';
    } else if (!this._canMove()) {
      this._status = 'lose';
    }
  }

  _addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this._state[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (!empty.length) {
      return false;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this._state[row][col] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  _moveRows(mapFn) {
    let changed = false;
    const newBoard = [];

    for (let r = 0; r < this.SIZE; r++) {
      const row = mapFn(this._state[r]);
      const packed = row.filter((v) => v !== 0);
      const merged = [];
      let skip = false;

      for (let i = 0; i < packed.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < packed.length && packed[i] === packed[i + 1]) {
          const val = packed[i] * 2;

          merged.push(val);
          this._score += val;
          skip = true;
        } else {
          merged.push(packed[i]);
        }
      }

      while (merged.length < this.SIZE) {
        merged.push(0);
      }
      newBoard.push(merged);

      if (!this._rowsEqual(this._state[r], merged)) {
        changed = true;
      }
    }

    this._state = newBoard;

    return changed;
  }

  _checkWin() {
    return this._state.some((row) => row.some((v) => v === 2048));
  }

  _canMove() {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const v = this._state[r][c];

        if (v === 0) {
          return true;
        }

        if (c + 1 < this.SIZE && this._state[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < this.SIZE && this._state[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _transpose(board) {
    return board[0].map((_, c) => board.map((row) => row[c]));
  }

  _reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  _rowsEqual(a, b) {
    return a.every((v, i) => v === b[i]);
  }
}
