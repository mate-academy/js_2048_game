'use strict';

/**
 * 2048 Game logic (framework-agnostic)
 * Public API used by tests/UI:
 *  - constructor(initialState?)
 *  - getState(), getScore(), getStatus()
 *  - moveLeft(), moveRight(), moveUp(), moveDown()
 *  - start(), restart()
 */
class Game {
  constructor(initialState) {
    this.size = 4;

    this.initialState =
      Array.isArray(initialState) && initialState.length === this.size
        ? this._clone(initialState)
        : this._empty();

    this.board = this._clone(this.initialState);
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  // ---------- public API ----------
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
    this.board = this._empty();
    this.score = 0;
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();

    return this.getState();
  }

  restart() {
    /**
     * Restores the initial state (including custom initial board).
     */
    this.board = this._clone(this.initialState);
    this.score = 0;
    this.status = 'idle';

    return this.getState();
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

  // ---------- internals ----------
  _empty() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _clone(matrix) {
    return matrix.map((row) => row.slice());
  }

  _transpose(matrix) {
    const t = this._empty();

    for (let rr = 0; rr < this.size; rr += 1) {
      for (let cc = 0; cc < this.size; cc += 1) {
        t[cc][rr] = matrix[rr][cc];
      }
    }

    return t;
  }

  _arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  /**
   * Merge a 1D row to the left. Returns merged row + gained score.
   */
  _lineLeft(line) {
    const vals = line.filter((v) => v !== 0);
    const out = [];
    let gained = 0;

    // Process each value
    let i = 0;

    while (i < vals.length) {
      if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
        // We have a pair of matching numbers
        const value = vals[i];
        const merged = value * 2;

        out.push(merged);
        gained += merged;
        i += 2; // Skip both numbers we just merged
      } else {
        out.push(vals[i]);
        i += 1;
      }
    }

    // Fill remaining spots with zeros
    while (out.length < this.size) {
      out.push(0);
    }

    // Always return gained score if we had merges
    return {
      merged: out,
      gained: gained,
    };
  }

  _addRandomTile() {
    const empty = [];

    for (let rr = 0; rr < this.size; rr += 1) {
      for (let cc = 0; cc < this.size; cc += 1) {
        if (this.board[rr][cc] === 0) {
          empty.push([rr, cc]);
        }
      }
    }

    if (empty.length === 0) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2; // 10% chance for 4

    return true;
  }

  _checkWin() {
    for (let rr = 0; rr < this.size; rr += 1) {
      for (let cc = 0; cc < this.size; cc += 1) {
        if (this.board[rr][cc] >= 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _hasMoves() {
    // Check for empty cells
    for (let rr = 0; rr < this.size; rr += 1) {
      for (let cc = 0; cc < this.size; cc += 1) {
        if (this.board[rr][cc] === 0) {
          return true;
        }
      }
    }

    // Check for mergeable tiles (horizontally and vertically)
    for (let rr = 0; rr < this.size; rr += 1) {
      for (let cc = 0; cc < this.size; cc += 1) {
        const val = this.board[rr][cc];

        // Check right
        if (cc < this.size - 1 && this.board[rr][cc + 1] === val) {
          return true;
        }

        // Check down
        if (rr < this.size - 1 && this.board[rr + 1][cc] === val) {
          return true;
        }
      }
    }

    return false;
  }

  _move(dir) {
    if (this.status === 'lose' || this.status === 'win') {
      return false;
    }

    const originalBoard = this._clone(this.board);
    let gainedTotal = 0;

    const applyMove = (row) => {
      const { merged, gained } = this._lineLeft(row);

      gainedTotal += gained;

      return merged;
    };

    // Process the board based on direction
    if (dir === 'left') {
      this.board = this.board.map((row) => applyMove(row));
    } else if (dir === 'right') {
      this.board = this.board.map((row) => {
        const reversed = row.slice().reverse();
        const merged = applyMove(reversed);

        return merged.reverse();
      });
    } else {
      // Handle up/down moves
      this.board = this._transpose(this.board);

      if (dir === 'up') {
        this.board = this.board.map((row) => applyMove(row));
      } else {
        this.board = this.board.map((row) => {
          const reversed = row.slice().reverse();
          const merged = applyMove(reversed);

          return merged.reverse();
        });
      }

      this.board = this._transpose(this.board);
    }

    // Check if any actual movement or merging occurred
    const boardChanged = !this._arraysEqual(
      originalBoard.flat(),
      this.board.flat(),
    );
    const scoreGained = gainedTotal > 0;
    const validMove = boardChanged || scoreGained;

    if (!validMove) {
      this.board = originalBoard;

      return false;
    }

    // Update game state
    if (this.status === 'idle') {
      this.status = 'playing';
    }

    this.score += gainedTotal;
    this._addRandomTile();

    // Check win/lose conditions
    if (this._checkWin()) {
      this.status = 'win';
    } else if (!this._hasMoves()) {
      this.status = 'lose';
    }

    return true;
  }
}

/* Expose for tests and browser */
if (typeof module !== 'undefined') {
  module.exports = Game;
}

if (typeof window !== 'undefined') {
  window.Game = Game;
}
