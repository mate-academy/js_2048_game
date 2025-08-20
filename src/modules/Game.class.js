/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */

  constructor(initialState) {
    this._score = 0;
    this._status = 'idle';
    this._size = 4;
    this._winValue = 2048;
    this._board = initialState || this._createEmptyBoard();
  }

  _createEmptyBoard() {
    return Array.from({ length: this._size }, () => Array(this._size).fill(0));
  }

  _getEmptyCells() {
    const empty = [];

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    return empty;
  }

  _addRandomTile() {
    const empty = this._getEmptyCells();

    if (empty.length === 0) {
      return false;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this._board[r][c] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  _hasMoves() {
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          return true;
        }

        if (c < this._size - 1 && this._board[r][c] === this._board[r][c + 1]) {
          return true;
        }

        if (r < this._size - 1 && this._board[r][c] === this._board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _checkWin() {
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === this._winValue) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this._status !== 'playing') {
      return false;
    }

    let moved = false;
    let scoreThisMove = 0;

    for (let r = 0; r < this._size; r++) {
      const row = this._board[r].slice();
      const merged = [false, false, false, false];

      for (let c = 1; c < this._size; c++) {
        if (row[c] === 0) {
          continue;
        }

        let target = c;

        while (target > 0 && row[target - 1] === 0) {
          row[target - 1] = row[target];
          row[target] = 0;
          target--;
        }

        if (
          target > 0 &&
          row[target - 1] === row[target] &&
          !merged[target - 1] &&
          !merged[target]
        ) {
          row[target - 1] *= 2;
          scoreThisMove += row[target - 1];
          row[target] = 0;
          merged[target - 1] = true;
          moved = true;
        } else if (target !== c) {
          moved = true;
        }
      }

      this._board[r] = row;
    }

    this._score += scoreThisMove;

    if (moved) {
      this._addRandomTile();

      if (this._checkWin()) {
        this._status = 'win';
      } else if (!this._hasMoves()) {
        this._status = 'lose';
      }
    }

    return moved;
  }

  moveRight() {
    if (this._status !== 'playing') {
      return false;
    }

    let moved = false;
    let scoreThisMove = 0;

    for (let r = 0; r < this._size; r++) {
      const row = this._board[r].slice();
      const merged = [false, false, false, false];

      for (let c = this._size - 2; c >= 0; c--) {
        if (row[c] === 0) {
          continue;
        }

        let target = c;

        while (target < this._size - 1 && row[target + 1] === 0) {
          row[target + 1] = row[target];
          row[target] = 0;
          target++;
        }

        if (
          target < this._size - 1 &&
          row[target + 1] === row[target] &&
          !merged[target + 1] &&
          !merged[target]
        ) {
          row[target + 1] *= 2;
          scoreThisMove += row[target + 1];
          row[target] = 0;
          merged[target + 1] = true;
          moved = true;
        } else if (target !== c) {
          moved = true;
        }
      }

      this._board[r] = row;
    }

    this._score += scoreThisMove;

    if (moved) {
      this._addRandomTile();

      if (this._checkWin()) {
        this._status = 'win';
      } else if (!this._hasMoves()) {
        this._status = 'lose';
      }
    }

    return moved;
  }

  moveUp() {
    if (this._status !== 'playing') {
      return false;
    }

    let moved = false;
    let scoreThisMove = 0;

    for (let c = 0; c < this._size; c++) {
      const col = [];

      for (let r = 0; r < this._size; r++) {
        col.push(this._board[r][c]);
      }

      const merged = [false, false, false, false];

      for (let r = 1; r < this._size; r++) {
        if (col[r] === 0) {
          continue;
        }

        let target = r;

        while (target > 0 && col[target - 1] === 0) {
          col[target - 1] = col[target];
          col[target] = 0;
          target--;
        }

        if (
          target > 0 &&
          col[target - 1] === col[target] &&
          !merged[target - 1] &&
          !merged[target]
        ) {
          col[target - 1] *= 2;
          scoreThisMove += col[target - 1];
          col[target] = 0;
          merged[target - 1] = true;
          moved = true;
        } else if (target !== r) {
          moved = true;
        }
      }

      for (let r = 0; r < this._size; r++) {
        this._board[r][c] = col[r];
      }
    }

    this._score += scoreThisMove;

    if (moved) {
      this._addRandomTile();

      if (this._checkWin()) {
        this._status = 'win';
      } else if (!this._hasMoves()) {
        this._status = 'lose';
      }
    }

    return moved;
  }

  moveDown() {
    if (this._status !== 'playing') {
      return false;
    }

    let moved = false;
    let scoreThisMove = 0;

    for (let c = 0; c < this._size; c++) {
      const col = [];

      for (let r = 0; r < this._size; r++) {
        col.push(this._board[r][c]);
      }

      const merged = [false, false, false, false];

      for (let r = this._size - 2; r >= 0; r--) {
        if (col[r] === 0) {
          continue;
        }

        let target = r;

        while (target < this._size - 1 && col[target + 1] === 0) {
          col[target + 1] = col[target];
          col[target] = 0;
          target++;
        }

        if (
          target < this._size - 1 &&
          col[target + 1] === col[target] &&
          !merged[target + 1] &&
          !merged[target]
        ) {
          col[target + 1] *= 2;
          scoreThisMove += col[target + 1];
          col[target] = 0;
          merged[target + 1] = true;
          moved = true;
        } else if (target !== r) {
          moved = true;
        }
      }

      for (let r = 0; r < this._size; r++) {
        this._board[r][c] = col[r];
      }
    }

    this._score += scoreThisMove;

    if (moved) {
      this._addRandomTile();

      if (this._checkWin()) {
        this._status = 'win';
      } else if (!this._hasMoves()) {
        this._status = 'lose';
      }
    }

    return moved;
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this._score;
  }
  /**
   * @returns {number[][]}
   */
  getState() {
    // Devolver copia para evitar manipulación externa
    return this._board.map((row) => row.slice());
  }
  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this._status;
  }
  /**
   * Starts the game.
   */
  start() {
    this._status = 'playing';
    this._score = 0;
    this._board = this._createEmptyBoard();
    this._addRandomTile();
    this._addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this._status = 'idle';
    this._score = 0;
    this._board = this._createEmptyBoard();
  }

  // Add your own methods here
}
