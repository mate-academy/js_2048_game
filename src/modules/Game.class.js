'use strict';

class Game {
  constructor(initialState) {
    const state = Array.isArray(initialState) ? initialState : null;

    this._initialState = Game._cloneState(state || Game._emptyState());
    this._state = Game._cloneState(this._initialState);
    this._score = 0;
    this._status = 'idle';
  }

  static _emptyState() {
    return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  }

  static _cloneState(state) {
    return state.map((row) => row.slice());
  }

  getState() {
    return Game._cloneState(this._state);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status !== 'idle') {
      return;
    }

    this._status = 'playing';

    if (this._countEmpty() === 16) {
      this._spawnRandomTile();
      this._spawnRandomTile();
    }

    this._updateTerminalStatus();
  }

  restart() {
    this._state = Game._cloneState(this._initialState);
    this._score = 0;
    this._status = 'idle';
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

  _move(direction) {
    if (this._status !== 'playing') {
      return false;
    }

    const prevState = this.getState();
    const result = this._computeMovedState(direction);

    if (!result.moved) {
      return false;
    }

    this._state = result.state;
    this._score += result.gained;

    if (result.has2048) {
      this._status = 'win';

      return true;
    }

    this._spawnRandomTile();
    this._updateTerminalStatus();

    const nextState = this.getState();

    return !Game._statesEqual(prevState, nextState);
  }

  static _statesEqual(a, b) {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (a[r][c] !== b[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  _countEmpty() {
    let count = 0;

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (this._state[r][c] === 0) {
          count += 1;
        }
      }
    }

    return count;
  }

  _spawnRandomTile() {
    const empties = [];

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (this._state[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    if (empties.length === 0) {
      return false;
    }

    const idx = Math.floor(Math.random() * empties.length);
    const [row, col] = empties[idx];
    const value = Math.random() < 0.1 ? 4 : 2;

    this._state[row][col] = value;

    return true;
  }

  _has2048() {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (this._state[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _canMoveAny() {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const v = this._state[r][c];

        if (v === 0) {
          return true;
        }

        if (c < 3 && v === this._state[r][c + 1]) {
          return true;
        }

        if (r < 3 && v === this._state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _updateTerminalStatus() {
    if (this._has2048()) {
      this._status = 'win';

      return;
    }

    if (!this._canMoveAny()) {
      this._status = 'lose';
    }
  }

  _computeMovedState(direction) {
    let moved = false;
    let gained = 0;
    let has2048 = false;
    const next = this.getState();

    const applyRow = (r, row) => {
      const out = this._slideAndMergeRowLeft(row);

      next[r] = out.row;

      if (out.changed) {
        moved = true;
      }
      gained += out.gained;

      if (out.has2048) {
        has2048 = true;
      }
    };

    const getCol = (c) => [next[0][c], next[1][c], next[2][c], next[3][c]];
    const setCol = (c, col) => {
      for (let r = 0; r < 4; r += 1) {
        next[r][c] = col[r];
      }
    };

    if (direction === 'left') {
      for (let r = 0; r < 4; r += 1) {
        applyRow(r, next[r]);
      }
    } else if (direction === 'right') {
      for (let r = 0; r < 4; r += 1) {
        const reversed = next[r].slice().reverse();
        const out = this._slideAndMergeRowLeft(reversed);
        const restored = out.row.slice().reverse();

        next[r] = restored;

        if (out.changed) {
          moved = true;
        }
        gained += out.gained;

        if (out.has2048) {
          has2048 = true;
        }
      }
    } else if (direction === 'up') {
      for (let c = 0; c < 4; c += 1) {
        const col = getCol(c);
        const out = this._slideAndMergeRowLeft(col);

        setCol(c, out.row);

        if (out.changed) {
          moved = true;
        }
        gained += out.gained;

        if (out.has2048) {
          has2048 = true;
        }
      }
    } else if (direction === 'down') {
      for (let c = 0; c < 4; c += 1) {
        const col = getCol(c).slice().reverse();
        const out = this._slideAndMergeRowLeft(col);

        setCol(c, out.row.slice().reverse());

        if (out.changed) {
          moved = true;
        }
        gained += out.gained;

        if (out.has2048) {
          has2048 = true;
        }
      }
    }

    return {
      state: next,
      moved,
      gained,
      has2048,
    };
  }

  _slideAndMergeRowLeft(row) {
    const original = row.slice();
    const tiles = row.filter((v) => v !== 0);
    const merged = [];
    let gained = 0;
    let has2048 = false;

    for (let i = 0; i < tiles.length; i += 1) {
      const v = tiles[i];
      const next = tiles[i + 1];

      if (next !== undefined && v === next) {
        const m = v * 2;

        merged.push(m);
        gained += m;

        if (m === 2048) {
          has2048 = true;
        }
        i += 1;
      } else {
        merged.push(v);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    let changed = false;

    for (let i = 0; i < 4; i += 1) {
      if (merged[i] !== original[i]) {
        changed = true;
        break;
      }
    }

    return {
      row: merged,
      gained,
      changed,
      has2048,
    };
  }
}

export default Game;
export { Game };
