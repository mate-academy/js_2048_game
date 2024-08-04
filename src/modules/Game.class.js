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
  score = 0;

  status = Game.STATUS_IDLE;

  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';

  static INITIAL_MERGE_FLAGS = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

  constructor(
    table,
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.table = table;
    this.state = initialState;
    this.tableBody = this.table.tBodies[0];
    this.tableRows = [...this.tableBody.rows];
    this.tableRows = this.tableRows.map((row) => [...row.cells]);
  }

  moveLeft() {
    const clone = structuredClone(this.getState());

    const mergeFlags = structuredClone(Game.INITIAL_MERGE_FLAGS);

    this.getState().forEach((row, rowIndex) => {
      for (let columnIndex = 3; columnIndex > 0; columnIndex--) {
        if (row[columnIndex - 2] !== 0 && columnIndex - 3 >= 0) {
          if (
            row[columnIndex - 3] === row[columnIndex - 2] &&
            !mergeFlags[rowIndex][columnIndex - 3] &&
            !mergeFlags[rowIndex][columnIndex - 2]
          ) {
            row[columnIndex - 3] *= 2;
            this.score += row[columnIndex - 3];
            row[columnIndex - 2] = 0;
            mergeFlags[rowIndex][columnIndex - 3] = true;
          } else if (row[columnIndex - 3] === 0) {
            row[columnIndex - 3] = row[columnIndex - 2];
            row[columnIndex - 2] = 0;

            if (mergeFlags[rowIndex][columnIndex - 2]) {
              mergeFlags[rowIndex][columnIndex - 3] = true;
            }
          }
        }

        if (row[columnIndex - 1] !== 0 && columnIndex - 2 >= 0) {
          if (
            row[columnIndex - 2] === row[columnIndex - 1] &&
            !mergeFlags[rowIndex][columnIndex - 2] &&
            !mergeFlags[rowIndex][columnIndex - 1]
          ) {
            row[columnIndex - 2] *= 2;
            this.score += row[columnIndex - 2];
            row[columnIndex - 1] = 0;
            mergeFlags[rowIndex][columnIndex - 2] = true;
          } else if (row[columnIndex - 2] === 0) {
            row[columnIndex - 2] = row[columnIndex - 1];
            row[columnIndex - 1] = 0;

            if (mergeFlags[rowIndex][columnIndex - 1]) {
              mergeFlags[rowIndex][columnIndex - 2] = true;
            }
          }
        }

        if (row[columnIndex] !== 0 && columnIndex - 1 >= 0) {
          if (
            row[columnIndex - 1] === row[columnIndex] &&
            !mergeFlags[rowIndex][columnIndex - 1] &&
            !mergeFlags[rowIndex][columnIndex]
          ) {
            row[columnIndex - 1] *= 2;
            this.score += row[columnIndex - 1];
            row[columnIndex] = 0;
            mergeFlags[rowIndex][columnIndex - 1] = true;
          } else if (row[columnIndex - 1] === 0) {
            row[columnIndex - 1] = row[columnIndex];
            row[columnIndex] = 0;

            if (mergeFlags[rowIndex][columnIndex]) {
              mergeFlags[rowIndex][columnIndex - 1] = true;
            }
          }
        }
      }
    });

    if (!this.areStatesEqual(clone)) {
      this.spawnNumber();
      this.updateTable();
    }

    if (this.checkWin()) {
      this.status = Game.STATUS_WIN;
    }

    if (this.checkLose()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  moveRight() {
    this.getState().map((row) => row.reverse());
    this.moveLeft();
    this.getState().map((row) => row.reverse());
    this.updateTable();
  }

  moveUp() {
    const clone = structuredClone(this.getState());

    const mergeFlags = structuredClone(Game.INITIAL_MERGE_FLAGS);

    this.getState().forEach((row, columnIndex, state) => {
      for (let rowIndex = 3; rowIndex > 0; rowIndex--) {
        if (rowIndex - 3 >= 0 && state[rowIndex - 2][columnIndex] !== 0) {
          if (
            state[rowIndex - 3][columnIndex] ===
              state[rowIndex - 2][columnIndex] &&
            !mergeFlags[rowIndex - 3][columnIndex] &&
            !mergeFlags[rowIndex - 2][columnIndex]
          ) {
            state[rowIndex - 3][columnIndex] *= 2;
            this.score += state[rowIndex - 3][columnIndex];
            state[rowIndex - 2][columnIndex] = 0;
            mergeFlags[rowIndex - 3][columnIndex] = true;
          } else if (state[rowIndex - 3][columnIndex] === 0) {
            state[rowIndex - 3][columnIndex] = state[rowIndex - 2][columnIndex];
            state[rowIndex - 2][columnIndex] = 0;

            if (mergeFlags[rowIndex - 2][columnIndex]) {
              mergeFlags[rowIndex - 3][columnIndex] = true;
            }
          }
        }

        if (rowIndex - 2 >= 0 && state[rowIndex - 1][columnIndex] !== 0) {
          if (
            state[rowIndex - 2][columnIndex] ===
              state[rowIndex - 1][columnIndex] &&
            !mergeFlags[rowIndex - 2][columnIndex] &&
            !mergeFlags[rowIndex - 1][columnIndex]
          ) {
            state[rowIndex - 2][columnIndex] *= 2;
            this.score += state[rowIndex - 2][columnIndex];
            state[rowIndex - 1][columnIndex] = 0;
            mergeFlags[rowIndex - 2][columnIndex] = true;
          } else if (state[rowIndex - 2][columnIndex] === 0) {
            state[rowIndex - 2][columnIndex] = state[rowIndex - 1][columnIndex];
            state[rowIndex - 1][columnIndex] = 0;

            if (mergeFlags[rowIndex - 1][columnIndex]) {
              mergeFlags[rowIndex - 2][columnIndex] = true;
            }
          }
        }

        if (rowIndex - 1 >= 0 && state[rowIndex][columnIndex] !== 0) {
          if (
            state[rowIndex - 1][columnIndex] === state[rowIndex][columnIndex] &&
            !mergeFlags[rowIndex - 1][columnIndex] &&
            !mergeFlags[rowIndex][columnIndex]
          ) {
            state[rowIndex - 1][columnIndex] *= 2;
            this.score += state[rowIndex - 1][columnIndex];
            state[rowIndex][columnIndex] = 0;
            mergeFlags[rowIndex - 1][columnIndex] = true;
          } else if (state[rowIndex - 1][columnIndex] === 0) {
            state[rowIndex - 1][columnIndex] = state[rowIndex][columnIndex];
            state[rowIndex][columnIndex] = 0;

            if (mergeFlags[rowIndex][columnIndex]) {
              mergeFlags[rowIndex - 1][columnIndex] = true;
            }
          }
        }
      }
    });

    if (!this.areStatesEqual(clone)) {
      this.spawnNumber();
      this.updateTable();
    }

    if (this.checkWin()) {
      this.status = Game.STATUS_WIN;
    }

    if (this.checkLose()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  moveDown() {
    this.getState().reverse();
    this.moveUp();
    this.getState().reverse();
    this.updateTable();
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
   * `idle` + the game has not started yet (the initial state);
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
    this.status = Game.STATUS_PLAYING;

    this.spawnNumber();
    this.spawnNumber();

    this.updateTable();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.start();
  }

  checkWin() {
    return this.getState().some((row) => {
      return row.some((cell) => cell === 2048);
    });
  }

  checkLose() {
    const areZeros = this.getState().some((row) => {
      return row.some((cell) => cell === 0);
    });

    const areSameNumbersRows = this.getState().some((row) => {
      return row.some((cell, columnIndex) => {
        return cell === row[columnIndex + 1];
      });
    });

    const areSameNumbersColumns = this.getState().some(
      (row, rowIndex, state) => {
        return row.some((cell, columnIndex) => {
          if (rowIndex + 1 < 4) {
            return cell === state[rowIndex + 1][columnIndex];
          } else {
            return false;
          }
        });
      },
    );

    return !areZeros && !areSameNumbersRows && !areSameNumbersColumns;
  }

  spawnNumber() {
    const emptyCells = [];

    this.getState().forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    const [randomRowIndex, randomColumnIndex] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (Math.floor(Math.random() * 10)) {
      this.getState()[randomRowIndex][randomColumnIndex] = 2;
    } else {
      this.getState()[randomRowIndex][randomColumnIndex] = 4;
    }
  }

  areStatesEqual(clone) {
    return this.getState().every((row, rowIndex) => {
      return row.every(
        (cell, cellIndex) => cell === clone[rowIndex][cellIndex],
      );
    });
  }

  updateTable() {
    this.tableRows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        cell.className = 'field-cell';
        cell.textContent = this.getState()[rowIndex][cellIndex];
        cell.classList.add(`field-cell--${cell.textContent}`);
      });
    });

    this.tableRows.forEach((row) => {
      row.forEach((cell) => {
        if (cell.textContent === '0') {
          cell.textContent = '';
        }
      });
    });
  }
}
