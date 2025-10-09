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

  #size = 4;
  #board;
  #score = 0;
  #status = 'idle'; // idle | playing | win | lose
  #wonValue = 2048;

  constructor(initialState = null) {
    this.#board = this.#empty();

    if (Array.isArray(initialState)) {
      this.#board = initialState.map((row) => row.slice());
    }
    // // eslint-disable-next-line no-console
    // console.log(initialState);
  }

  moveLeft() {
    return this.#move('left');
  }
  moveRight() {
    return this.#move('right');
  }
  moveUp() {
    return this.#move('up');
  }
  moveDown() {
    return this.#move('down');
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
    return this.#board.map((row) => row.slice());
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
    this.#score = 0;
    this.#status = 'playing';
    this.#spawn();
    this.#spawn();

    return this.getState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#board = this.#empty();
    this.#score = 0;
    this.#status = 'playing';
    this.#spawn();
    this.#spawn();

    return this.getState();
  }

  #empty() {
    return Array.from({ length: this.#size }, () => Array(this.#size).fill(0));
  }

  #randomNull() {
    const arrNulls = [];

    for (let i = 0; i < this.#size; i++) {
      for (let j = 0; j < this.#size; j++) {
        if (this.#board[i][j] === 0) {
          arrNulls.push([i, j]);
        }
      }
    }

    if (arrNulls.length === 0) {
      return null;
    }

    return arrNulls[Math.floor(Math.random() * arrNulls.length)];
  }

  #spawn() {
    const cord = this.#randomNull();

    if (!cord) {
      return false;
    }
    this.#board[cord[0]][cord[1]] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  #move(direction) {
    if (this.#status !== 'playing') {
      return false;
    }

    const beforeBoard = this.#serialize(this.#board);
    let scoreMove = 0;

    const shift = (line) => {
      const newLine = line.filter((num) => num !== 0);
      let scoreLine = 0;

      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] = newLine[i] * 2;
          newLine[i + 1] = 0;
          scoreLine += newLine[i];
        }
      }

      const finalLine = newLine.filter((num) => num !== 0);

      return { calculateLine: finalLine, scoreRes: scoreLine };
    };

    if (direction === 'left' || direction === 'right') {
      let i = 0;

      while (i < this.#board.length) {
        const row = this.#board[i];
        const { calculateLine, scoreRes } = shift(row);
        const arr = calculateLine;

        scoreMove += scoreRes;

        if (direction === 'left') {
          while (arr.length < 4) {
            arr.push(0);
          }
        } else {
          while (arr.length < 4) {
            arr.unshift(0);
          }
        }

        this.#board[i] = arr;
        i++;
      }
    } else {
      let i = 0;
      const newBoard = [];
      const reconstructBord = this.#reconstructor();

      while (i < reconstructBord.length) {
        const row = reconstructBord[i];
        const { calculateLine, scoreRes } = shift(row);
        const arr = calculateLine;

        scoreMove += scoreRes;

        if (direction === 'up') {
          while (arr.length < 4) {
            arr.push(0);
          }
        } else {
          while (arr.length < 4) {
            arr.unshift(0);
          }
        }

        newBoard.push(arr);
        i++;
      }

      this.#board = this.#backconstructor(newBoard);
    }

    if (this.#winValue()) {
      this.#status = 'win';
    }

    const afterBoard = this.#serialize(this.#board);

    if (beforeBoard !== afterBoard) {
      this.#score += scoreMove;
      this.#spawn();

      if (!this.#canMove()) {
        this.#status = 'lose';

        return false;
      }

      return true;
    }

    return false;
  }

  #serialize(b) {
    return b.flat().join(',');
  }

  #reconstructor() {
    const reconstructBoard = [];
    const lineBord = this.#board.flat();

    for (let i = 0; i < this.#size; i++) {
      const row = [
        lineBord[i],
        lineBord[i + 4],
        lineBord[i + 8],
        lineBord[i + 12],
      ];

      reconstructBoard.push(row);
    }

    return reconstructBoard;
  }

  #backconstructor(matrix) {
    const backBoard = [];

    for (let r = 0; r < this.#size; r++) {
      const row = [];

      for (let c = 0; c < this.#size; c++) {
        row.push(matrix[c][r]);
      }
      backBoard.push(row);
    }

    return backBoard;
  }

  #winValue() {
    for (const row of this.#board) {
      for (const val of row) {
        if (val === this.#wonValue) {
          return true;
        }
      }
    }
  }

  #canMove() {
    const upDown = this.#reconstructor();

    if (this.#board.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.#size; i++) {
      for (let j = 0; j < this.#size - 1; j++) {
        if (
          this.#board[i][j] === this.#board[i][j + 1] ||
          upDown[i][j] === upDown[i][j + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
