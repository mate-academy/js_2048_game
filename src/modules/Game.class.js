'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.SIZE = 4;

    this._baseInitial = Array.isArray(initialState)
      ? this._clone(initialState)
      : this._emptyBoard();

    this._initialState = this._clone(this._baseInitial);
    this._firstStartSaved = false;

    this._state = this._clone(this._baseInitial);
    this._score = 0;
    this._status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  // Moves
  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    let movedAny = false;
    let gainedTotal = 0;

    const next = this._state.map((row) => {
      const { row: nr, gained, moved } = this._slideRowLeft(row);

      if (moved) {
        movedAny = true;
      }
      gainedTotal += gained;

      return nr;
    });

    if (!movedAny) {
      return false;
    }

    this._state = next;
    this._score += gainedTotal;
    this._addRandomTile();

    if (this._has2048()) {
      this._status = 'win';
    } else if (!this._anyMovePossible()) {
      this._status = 'lose';
    }

    return true;
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    const reversed = this._state.map((row) => row.slice().reverse());
    const tempGame = new Game(reversed);

    tempGame._score = this._score;
    tempGame._status = this._status;

    const moved = tempGame.moveLeft();

    if (!moved) {
      return false;
    }

    this._state = tempGame.getState().map((row) => row.slice().reverse());
    this._score = tempGame.getScore();
    this._status = tempGame.getStatus();

    return true;
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    const transposed = this._transpose(this._state);
    const tempGame = new Game(transposed);

    tempGame._score = this._score;
    tempGame._status = this._status;

    const moved = tempGame.moveLeft();

    if (!moved) {
      return false;
    }

    this._state = this._transpose(tempGame.getState());
    this._score = tempGame.getScore();
    this._status = tempGame.getStatus();

    return true;
  }

  moveDown() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    const transposed = this._transpose(this._state);
    const reversed = transposed.map((row) => row.slice().reverse());
    const tempGame = new Game(reversed);

    tempGame._score = this._score;
    tempGame._status = this._status;

    const moved = tempGame.moveLeft();

    if (!moved) {
      return false;
    }

    const restored = tempGame.getState().map((row) => row.slice().reverse());

    this._state = this._transpose(restored);
    this._score = tempGame.getScore();
    this._status = tempGame.getStatus();

    return true;
  }

  // Getters
  getScore() {
    return this._score;
  }
  getState() {
    return this._clone(this._state);
  }
  getStatus() {
    return this._status;
  }

  // Lifecycle
  start() {
    this._state = this._clone(this._baseInitial);
    this._score = 0;
    this._status = 'playing';

    const isEmpty = this._state.flat().every((v) => v === 0);

    if (isEmpty) {
      this._addRandomTile();
      this._addRandomTile();
    }

    if (!this._firstStartSaved) {
      this._initialState = this._clone(this._state);
      this._firstStartSaved = true;
    }

    // Win/Lose check
    if (this._has2048()) {
      this._status = 'win';
    } else if (!this._anyMovePossible()) {
      this._status = 'lose';
    }
  }

  restart() {
    this._state = this._clone(this._initialState);
    this._score = 0;
    this._status = 'playing';
  }

  // Helpers
  _emptyBoard() {
    return Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));
  }

  _clone(board) {
    return board.map((row) => row.slice());
  }

  _getEmptyCells() {
    const cells = [];

    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this._state[r][c] === 0) {
          cells.push([r, c]);
        }
      }
    }

    return cells;
  }

  _addRandomTile() {
    const empties = this._getEmptyCells();

    if (empties.length === 0) {
      return false;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];

    this._state[r][c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  _slideRowLeft(row) {
    const nonZeros = row.filter((v) => v !== 0);
    const merged = [];
    let gained = 0;
    let i = 0;

    while (i < nonZeros.length) {
      if (i + 1 < nonZeros.length && nonZeros[i] === nonZeros[i + 1]) {
        const val = nonZeros[i] * 2;

        merged.push(val);
        gained += val;
        i += 2;
      } else {
        merged.push(nonZeros[i]);
        i += 1;
      }
    }

    while (merged.length < this.SIZE) {
      merged.push(0);
    }

    const moved = !row.every((v, idx) => v === merged[idx]);

    return { row: merged, gained, moved };
  }

  _has2048(board = this._state) {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _anyMovePossible(board = this._state) {
    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        const v = board[r][c];

        if (v === 0) {
          return true;
        }

        if (c + 1 < this.SIZE && board[r][c + 1] === v) {
          return true;
        }

        if (r + 1 < this.SIZE && board[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _transpose(board = this._state) {
    const result = [];

    for (let r = 0; r < this.SIZE; r++) {
      result[r] = [];

      for (let c = 0; c < this.SIZE; c++) {
        result[r][c] = board[c][r];
      }
    }

    return result;
  }
}

// Export
export default Game;
