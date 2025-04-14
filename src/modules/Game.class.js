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

  moveTilesToTheLeft(row, rowIndex, mergeFlags, fromIndex, toIndex) {
    if (toIndex < 0 || row[fromIndex] === 0) {
      return;
    }

    if (
      row[toIndex] === row[fromIndex] &&
      !mergeFlags[rowIndex][toIndex] &&
      !mergeFlags[rowIndex][fromIndex]
    ) {
      row[toIndex] *= 2;
      this.score += row[toIndex];
      row[fromIndex] = 0;
      mergeFlags[rowIndex][toIndex] = true;
    } else if (row[toIndex] === 0) {
      row[toIndex] = row[fromIndex];
      row[fromIndex] = 0;

      if (mergeFlags[rowIndex][fromIndex]) {
        mergeFlags[rowIndex][toIndex] = true;
      }
    }
  }

  moveLeft() {
    const clone = structuredClone(this.getState());

    const mergeFlags = structuredClone(Game.INITIAL_MERGE_FLAGS);

    this.getState().forEach((row, rowIndex) => {
      for (let columnIndex = 3; columnIndex > 0; columnIndex--) {
        this.moveTilesToTheLeft(
          row,
          rowIndex,
          mergeFlags,
          columnIndex - 2,
          columnIndex - 3,
        );

        this.moveTilesToTheLeft(
          row,
          rowIndex,
          mergeFlags,
          columnIndex - 1,
          columnIndex - 2,
        );

        this.moveTilesToTheLeft(
          row,
          rowIndex,
          mergeFlags,
          columnIndex,
          columnIndex - 1,
        );
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

  moveTilesUp(state, columnIndex, mergeFlags, fromIndex, toIndex) {
    if (toIndex < 0 || state[fromIndex][columnIndex] === 0) {
      return;
    }

    if (
      state[toIndex][columnIndex] === state[fromIndex][columnIndex] &&
      !mergeFlags[fromIndex][columnIndex] &&
      !mergeFlags[toIndex][columnIndex]
    ) {
      state[toIndex][columnIndex] *= 2;
      this.score += state[toIndex][columnIndex];
      state[fromIndex][columnIndex] = 0;
      mergeFlags[toIndex][columnIndex] = true;
    } else if (state[toIndex][columnIndex] === 0) {
      state[toIndex][columnIndex] = state[fromIndex][columnIndex];
      state[fromIndex][columnIndex] = 0;

      if (mergeFlags[fromIndex][columnIndex]) {
        mergeFlags[toIndex][columnIndex] = true;
      }
    }
  }

  moveUp() {
    const clone = structuredClone(this.getState());

    const mergeFlags = structuredClone(Game.INITIAL_MERGE_FLAGS);

    this.getState().forEach((_, columnIndex, state) => {
      for (let rowIndex = 3; rowIndex > 0; rowIndex--) {
        this.moveTilesUp(
          state,
          columnIndex,
          mergeFlags,
          rowIndex - 2,
          rowIndex - 3,
        );

        this.moveTilesUp(
          state,
          columnIndex,
          mergeFlags,
          rowIndex - 1,
          rowIndex - 2,
        );

        this.moveTilesUp(
          state,
          columnIndex,
          mergeFlags,
          rowIndex,
          rowIndex - 1,
        );
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
