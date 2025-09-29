'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this._initialState = this._isValidState(initialState)
      ? this._deepCopy(initialState)
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.state = this._deepCopy(this._initialState);
  }

  _compressMerge(line) {
    // прибрати нулі
    const arr = line.filter((v) => v !== 0);

    let scoreGain = 0;

    // злити сусідні однакові
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        scoreGain += arr[i];
        arr[i + 1] = 0;
        i++; // пропускаємо наступний, бо вже злили
      }
    }

    // знову прибрати нулі
    const merged = arr.filter((v) => v !== 0);

    // доповнити нулями до довжини 4
    while (merged.length < this.size) {
      merged.push(0);
    }

    return { line: merged, gain: scoreGain };
  }

  moveLeft() {
    return this.move(0, -1);
  }
  moveRight() {
    return this.move(0, 1);
  }
  moveUp() {
    return this.move(-1, 0);
  }
  moveDown() {
    return this.move(1, 0);
  }

  move(dr, dc) {
    if (this.status === 'idle') {
      this.start();
    }

    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    let gain = 0;

    if (dr === 0 && (dc === -1 || dc === 1)) {
      // РУХ ВЛІВО / ВПРАВО — працюємо з РЯДКАМИ
      const toRight = dc === 1;

      for (let r = 0; r < this.size; r++) {
        const original = this.state[r].slice(); // копія для порівняння

        const line = toRight ? original.slice().reverse() : original.slice();
        const { line: merged, gain: g } = this._compressMerge(line);
        const finalLine = toRight ? merged.slice().reverse() : merged;

        // записуємо назад
        for (let c = 0; c < this.size; c++) {
          this.state[r][c] = finalLine[c];
        }

        // чи змінилось?
        if (!moved) {
          for (let c = 0; c < this.size; c++) {
            if (original[c] !== finalLine[c]) {
              moved = true;
              break;
            }
          }
        }
        gain += g;
      }
    } else if (dc === 0 && (dr === -1 || dr === 1)) {
      // РУХ ВГОРУ / ВНИЗ — працюємо з КОЛОНКАМИ
      const toDown = dr === 1;

      for (let c = 0; c < this.size; c++) {
        // зібрати колонку
        const col = new Array(this.size);

        for (let r = 0; r < this.size; r++) {
          col[r] = this.state[r][c];
        }

        const original = col.slice();

        const line = toDown ? col.slice().reverse() : col.slice();
        const { line: merged, gain: g } = this._compressMerge(line);
        const finalCol = toDown ? merged.slice().reverse() : merged;

        // записати назад колонку
        for (let r = 0; r < this.size; r++) {
          this.state[r][c] = finalCol[r];
        }

        // чи змінилось?
        if (!moved) {
          for (let r = 0; r < this.size; r++) {
            if (original[r] !== finalCol[r]) {
              moved = true;
              break;
            }
          }
        }
        gain += g;
      }
    } else {
      // некоректний напрям
      return false;
    }

    if (moved) {
      this.score += gain;
      this._addRandomTile();

      if (this._checkWin()) {
        this.status = 'win';
      } else if (this._checkLose()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  _checkWin() {
    for (let r = 0; r < this.size; r++) {
      if (this.state[r].includes(2048)) {
        return true;
      }
    }

    return false;
  }

  _checkLose() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 0) {
          return false;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.state[r][c];

        if (c + 1 < this.size && this.state[r][c + 1] === v) {
          return false;
        }

        if (r + 1 < this.size && this.state[r + 1][c] === v) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this._deepCopy(this.state);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    if (this._isBoardEmpty()) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  _addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length === 0) {
      return false;
    }

    const pick = empty[Math.floor(Math.random() * empty.length)];

    this.state[pick.r][pick.c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this._deepCopy(this._initialState);
    this.score = 0;
    this.status = 'idle';
  }

  _deepCopy(board) {
    return board.map((row) => row.slice());
  }

  _isBoardEmpty() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.state[r][c] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  _isValidState(state) {
    if (!Array.isArray(state) || state.length !== this.state) {
      return false;
    }

    for (let r = 0; r < this.size; r++) {
      const row = this.state[r];

      if (!Array.isArray(row) || row.length !== this.size) {
        return false;
      }

      for (let c = 0; c < this.size; c++) {
        const v = row[c];

        if (!Number.isInteger(v) || v < 0) {
          return true;
        }

        const isPow2 = (n) => (n & (n - 1)) === 0;

        if (!(v === 0 || (v >= 0 && isPow2(v)))) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
