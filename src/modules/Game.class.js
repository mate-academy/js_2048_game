'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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

    if (
      initialState &&
      Array.isArray(initialState) &&
      initialState.length === 4 &&
      initialState.every((row) => Array.isArray(row) && row.length === 4)
    ) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    const prev = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      let newRow = this.#compressRow(row);

      newRow = this.#mergeRow(newRow);
      newRow = this.#compressRow(newRow);

      return newRow;
    });

    if (JSON.stringify(this.board) !== prev) {
      this.#newBlock();
    }
  }

  moveRight() {
    const prev = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();
      let newRow = this.#compressRow(reversedRow);

      newRow = this.#mergeRow(newRow);
      newRow = this.#compressRow(newRow);

      return newRow.reverse();
    });

    if (JSON.stringify(this.board) !== prev) {
      this.#newBlock();
    }
  }

  moveUp() {
    const prev = JSON.stringify(this.board);
    const transposed = this.#transpose(this.board);

    const moved = transposed.map((row) => {
      let newRow = this.#compressRow(row);

      newRow = this.#mergeRow(newRow);
      newRow = this.#compressRow(newRow);

      return newRow;
    });

    this.board = this.#transpose(moved);

    if (JSON.stringify(this.board) !== prev) {
      this.#newBlock();
    }
  }

  moveDown() {
    const prev = JSON.stringify(this.board);
    const transposed = this.#transpose(this.board);

    const moved = transposed.map((row) => {
      const reversedRow = [...row].reverse();
      let newRow = this.#compressRow(reversedRow);

      newRow = this.#mergeRow(newRow);
      newRow = this.#compressRow(newRow);

      return newRow.reverse();
    });

    this.board = this.#transpose(moved);

    if (JSON.stringify(this.board) !== prev) {
      this.#newBlock();
    }
  }

  #compressRow(row) {
    const newRow = row.filter((num) => num !== 0);

    const zeros = Array(this.size - newRow.length).fill(0);

    return newRow.concat(zeros);
  }

  #mergeRow(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    return row;
  }

  #transpose(board) {
    const newBoard = [[], [], [], []];

    board.forEach((row) => {
      row.forEach((num, j) => {
        newBoard[j].push(num);
      });
    });

    return newBoard;
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
    return this.board;
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
    this.status = 'playing';
    this.#newBlock();
    this.#newBlock();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  #newBlock() {
    if (
      this.board.every((row) => {
        return row.every((num) => num !== 0);
      })
    ) {
      return;
    }

    const index = Math.random() < 0.1 ? 4 : 2;
    const fild = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          fild.push([i, j]);
        }
      });
    });

    const randomBlock = fild[Math.floor(Math.random() * fild.length)];

    this.board[randomBlock[0]][randomBlock[1]] = index;

    this.#checkWin();
    this.#checkLose();
  }

  #checkWin() {
    this.board.forEach((row) => {
      if (row.includes(2048)) {
        this.status = 'win';
      }
    });
  }

  #checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    if (
      this.board.some((row) => {
        for (let i = 0; i < this.size - 1; i++) {
          if (row[i] !== 0 && row[i] === row[i + 1]) {
            return true;
          }
        }

        return false;
      })
    ) {
      return;
    }

    const transposed = this.#transpose(this.board);

    if (
      transposed.some((row) => {
        for (let i = 0; i < this.size - 1; i++) {
          if (row[i] !== 0 && row[i] === row[i + 1]) {
            return true;
          }
        }

        return false;
      })
    ) {
      return;
    }

    this.status = 'lose';
  }
}
