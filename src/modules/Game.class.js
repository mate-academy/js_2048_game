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
    console.log(initialState);
  }

  FIELD_WIDTH = 4;

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  randomSpawn() {
    const { FIELD_WIDTH, field } = this;
    const hasPlaceForSpawn = field.some((element) => element.includes(0));

    if (!hasPlaceForSpawn) {
      return 'has no place for respawn';
    }

    while (true) {
      const findIndex = Math.floor(Math.random() * (FIELD_WIDTH * FIELD_WIDTH));
      const findColumn = Math.floor(findIndex / FIELD_WIDTH);
      const findRow = findIndex % FIELD_WIDTH;

      if (field[findColumn][findRow] === 0) {
        if (Math.random() < 0.1) {
          field[findColumn][findRow] = 4;
          break;
        }
        field[findColumn][findRow] = 2;
        break;
      }
    }
  }

  moveLeft(field) {
    const { FIELD_WIDTH } = this;

    for (let i = 0; i < FIELD_WIDTH; i += 1) {
      let row = field[i];

      row = row.filter((element) => element !== 0);

      for (let j = 0; j < row.length; j += 1) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          break;
        }
      }

      row = row.filter((element) => element !== 0);

      while (row.length < FIELD_WIDTH) {
        row.push(0);
      }

      field[i] = row;
    }

    return field;
  }

  moveRight(field) {
    const { FIELD_WIDTH } = this;

    for (let i = 0; i < FIELD_WIDTH; i += 1) {
      let row = field[i];

      row = row.filter((element) => element !== 0);

      for (let j = 0; j < row.length; j += 1) {
        if (row[j] === row[j + 1]) {
          row[j] = 0;
          row[j + 1] *= 2;
          break;
        }
      }

      row = row.filter((element) => element !== 0);

      while (row.length < FIELD_WIDTH) {
        row.unshift(0);
      }

      field[i] = row;
    }

    return field;
  }

  moveUp(field) {
    const { FIELD_WIDTH } = this;

    for (let i = 0; i < FIELD_WIDTH; i += 1) {
      let column = [];

      for (let j = 0; j < FIELD_WIDTH; j += 1) {
        column.push(field[j][i]);
      }

      column = column.filter((element) => element !== 0);

      for (let j = 0; j < column.length; j += 1) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          column[j + 1] = 0;
          break;
        }
      }

      column = column.filter((element) => element !== 0);

      while (column.length < FIELD_WIDTH) {
        column.push(0);
      }

      for (let j = 0; j < FIELD_WIDTH; j += 1) {
        field[j][i] = column[j];
      }
    }

    return field;
  }

  moveDown(field) {
    const { FIELD_WIDTH } = this;

    for (let i = 0; i < FIELD_WIDTH; i += 1) {
      let column = [];

      for (let j = 0; j < FIELD_WIDTH; j += 1) {
        column.push(field[j][i]);
      }

      column = column.filter((element) => element !== 0);

      for (let j = 0; j < column.length; j += 1) {
        if (column[j] === column[j + 1]) {
          column[j] = 0;
          column[j + 1] *= 2;
          break;
        }
      }

      column = column.filter((element) => element !== 0);

      while (column.length < FIELD_WIDTH) {
        column.unshift(0);
      }

      for (let j = 0; j < FIELD_WIDTH; j += 1) {
        field[j][i] = column[j];
      }
    }

    return field;
  }

  /**
   * @returns {number}
   */
  getScore() {
    let score = 0;

    for (let i = 0; i < this.field.length; i += 1) {
      for (let j = 0; j < this.field[i].length; j += 1) {
        score += this.field[i][j];
      }
    }

    return score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.field;
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
    const { field, equalMatrix } = this;
    const checkField = [...field];

    const isIdle = field.every((element) => {
      element.every((cell) => {
        return cell === 0;
      });
    });

    if (isIdle) {
      return 'idle';
    }

    if (field.some((element) => element.includes(2048))) {
      return 'win';
    }

    if (
      equalMatrix(this.moveDown(checkField), field) &&
      equalMatrix(this.moveUp(checkField), field) &&
      equalMatrix(this.moveRight(checkField), field) &&
      equalMatrix(this.moveLeft(checkField), field)
    ) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.randomSpawn();
    this.randomSpawn();

    return this.field;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();
  }

  equalMatrix(field1, field2) {
    return field1.every((row, rowIndex) => {
      const targetRow = field2[rowIndex];

      return row.every((element, index) => element === targetRow[index]);
    });
  }
}

module.exports = Game;
