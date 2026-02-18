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
  #field;
  #score;
  #status;

  constructor(initialState) {
    this.#field = initialState
      ? this.#cloneField(initialState)
      : this.#createEmptyBoard();
    this.#score = 0;
    this.#status = 'idle';
  }

  moveLeft() {
    this.#makeMove(() => {
      for (let i = 0; i < 4; i++) {
        this.#field[i] = this.#processRow(this.#field[i]);
      }
    });
  }

  moveRight() {
    this.#makeMove(() => {
      for (let i = 0; i < 4; i++) {
        const reverseRow = [...this.#field[i]].reverse();
        const processed = this.#processRow(reverseRow);

        this.#field[i] = processed.reverse();
      }
    });
  }
  moveUp() {
    this.#makeMove(() => {
      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column.push(this.#field[j][i]);
        }

        const processed = this.#processRow(column);

        if (processed) {
          for (let j = 0; j < 4; j++) {
            this.#field[j][i] = processed[j];
          }
        }
      }
    });
  }

  moveDown() {
    this.#makeMove(() => {
      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column.push(this.#field[j][i]);
        }

        const processed = this.#processRow(column.reverse());

        const reverseProcessed = processed.reverse();

        if (processed) {
          for (let j = 0; j < 4; j++) {
            this.#field[j][i] = reverseProcessed[j];
          }
        }
      }
    });
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#field.map((row) => [...row]);
  }

  #cloneField(field) {
    return field.map((row) => [...row]);
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#status = 'playing';
    this.#addRandomTile();
    this.#addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#score = 0;
    this.#status = 'playing';
    this.#field = this.#createEmptyBoard();
    this.#addRandomTile();
    this.#addRandomTile();
  }

  // Add your own methods here
  #createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  #addRandomTile() {
    const indexOfZero = [];

    for (let i = 0; i < this.#field.length; i++) {
      for (let j = 0; j < this.#field[i].length; j++) {
        if (this.#field[i][j] === 0) {
          indexOfZero.push([i, j]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * indexOfZero.length);
    const randomPos = indexOfZero[randomIndex];
    const twoOrFour = Math.floor(Math.random() * 101);
    const value = twoOrFour >= 10 ? 2 : 4;

    this.#field[randomPos[0]][randomPos[1]] = value;
  }

  #fieldsEqual(a, b) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  #processRow(row) {
    const newRow = row.filter((val) => val !== 0);
    let scoreForRow = 0;

    if (newRow.length === 0 || newRow.length === 1) {
      const result = [...newRow];

      while (result.length < 4) {
        result.push(0);
      }

      return result;
    }

    for (let i = 1; i < newRow.length; i++) {
      if (newRow[i - 1] === newRow[i]) {
        newRow[i - 1] *= 2;
        newRow[i] = 0;
        scoreForRow += newRow[i - 1];
      }
    }

    this.#score += scoreForRow;

    const formatRow = newRow.filter((val) => val !== 0);

    for (let i = formatRow.length; i < 4; i++) {
      formatRow[i] = 0;
    }

    return formatRow;
  }

  #makeMove(callBack) {
    const oldField = this.getState();

    callBack();

    if (!this.#fieldsEqual(oldField, this.#field)) {
      this.#addRandomTile();
      this.#updateStatus();
    }
  }

  #updateStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.#field[i][j] === 2048) {
          this.#status = 'win';
        }
      }
    }

    if (!this.#hasMove()) {
      this.#status = 'lose';
    } else {
      this.#status = 'playing';
    }
  }

  #hasMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.#field[i][j];

        if (current === 0) {
          return true;
        }

        if (j < 3 && current === this.#field[i][j + 1]) {
          return true;
        }

        if (i < 3 && current === this.#field[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
