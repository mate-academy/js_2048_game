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
    // eslint-disable-next-line no-console
    this.size = 4;
    this.score = 0;

    this.state =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const newRow = this.#mergeRow([...this.state[i]]);

      if (JSON.stringify(this.state[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.state[i] = newRow;
    }

    if (moved) {
      this.#afterMove();
    }

    return moved;
  }
  moveRight() {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const reversed = [...this.state[i]].reverse();
      const newRow = this.#mergeRow(reversed).reverse();

      if (JSON.stringify(this.state[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.state[i] = newRow;
    }

    if (moved) {
      this.#afterMove();
    }

    return moved;
  }
  moveUp() {
    let moved = false;

    for (let j = 0; j < this.size; j++) {
      const col = [];

      for (let i = 0; i < this.size; i++) {
        col.push(this.state[i][j]);
      }

      const newCol = this.#mergeRow([...col]);

      if (JSON.stringify(col) !== JSON.stringify(newCol)) {
        moved = true;
      }

      for (let i = 0; i < this.size; i++) {
        this.state[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.#afterMove();
    }

    return moved;
  }
  moveDown() {
    let moved = false;

    for (let j = 0; j < this.size; j++) {
      const col = [];

      for (let i = 0; i < this.size; i++) {
        col.push(this.state[i][j]); // эт
      }

      const newCol = this.#mergeRow(col.reverse()).reverse();

      if (JSON.stringify(col) !== JSON.stringify(newCol)) {
        moved = true;
      }

      for (let i = 0; i < this.size; i++) {
        this.state[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.#afterMove();
    }

    return moved;
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
    return this.state;
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
    this.score = 0;

    // prettier-ignore
    this.state = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0));

    this.#addRandomTile();
    this.#addRandomTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  #mergeRow(row) {
    let filtered = row.filter((v) => v !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        this.score += filtered[i];
      }
    }

    filtered = filtered.filter((v) => v !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  #addRandomTile() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];

      this.state[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #afterMove() {
    this.#addRandomTile();

    // Проверка победы
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const canMove = this.state.some((row) => row.includes(0));

    if (!canMove && !this.#canMerge()) {
      this.status = 'lose';
    }
  }

  #canMerge() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size - 1; i++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
