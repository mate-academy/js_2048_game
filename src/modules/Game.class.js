/* eslint-disable indent */
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

  // Default game fiels is 4x4

  constructor(initialCustomState) {
    // declare constants
    this.direction = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
    };

    this.gameStatus = {
      idle: 'idle',
      playing: 'playing',
      win: 'win',
      lose: 'lose',
    };

    this.initialField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.cellMax = 0;
    this.fieldSize = 4;
    this.isAvailableMovement = true;
    this.status = this.gameStatus.idle;
    this.isCustomInitial = !!initialCustomState;
    this.defaultState = initialCustomState || this.initialField;
  }

  moveLeft() {
    this.status = this.gameStatus.playing;
    this.sumGameFieldByRow(this.direction.left);
  }

  moveRight() {
    this.status = this.gameStatus.playing;
    this.sumGameFieldByRow(this.direction.right);
  }

  moveUp() {
    this.status = this.gameStatus.playing;
    this.sumGameFieldByColumn(this.direction.up);
  }

  moveDown() {
    this.status = this.gameStatus.playing;
    this.sumGameFieldByColumn(this.direction.down);
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
    this.state =
      this.isCustomInitial && this.initialCustomState.length === this.fieldSize
        ? this.initialCustomState
        : this.initialField;
    this.status = this.gameStatus.playing;

    this.generateRandomCellOnField(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.isCustomInitial) {
      this.state = this.defaultState;
    } else {
      this.state = this.initialField;
      this.generateRandomCellOnField(2);
    }

    this.score = 0;
    this.status = this.gameStatus.idle;
  }

  /**
   * Get cell's max value.
   */

  gMaxCell() {
    return this.cellMax;
  }

  /**
   * Get if cells can move.
   */

  getMoveAvailability() {
    return this.isAvailableMovement;
  }

  // helpers

  getMaxValueCell(gameField) {
    return Math.max(...gameField.flat());
  }

  getRandomCellValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  getRandomCellIndex(gameFieldSize = this.fieldSize) {
    const row = Math.floor(Math.random() * gameFieldSize);
    const col = Math.floor(Math.random() * gameFieldSize);

    return { row, col };
  }

  sumRow(row, size = this.fieldSize, rtl = true) {
    // right to left (rtl or TRUE) represent summ cell with RIGHT or DOWN click
    // left to right (ltr or FALSE) represent summ cell with LEFT or UP click

    let isSumm = false;
    let sum = 0;

    if (rtl) {
      const rightToLeftSum = row.reduceRight((newRow, value, i) => {
        if (!value) {
          return newRow;
        }

        const firstValue = newRow[0];

        if (value === firstValue && !isSumm) {
          isSumm = true;
          sum = firstValue * 2;

          return [firstValue * 2, ...newRow.slice(1)];
        }

        return [value, ...newRow];
      }, []);

      const rowWithCollapsedRtl =
        rightToLeftSum.length === 4
          ? rightToLeftSum
          : [
              ...new Array(size - rightToLeftSum.length).fill(0),
              ...rightToLeftSum,
            ];

      return {
        row: rowWithCollapsedRtl,
        summCollapsed: sum,
      };
    }

    const leftToRightSum = row.reduce((newRow, value, i) => {
      if (!value) {
        return newRow;
      }

      if (i === 0) {
        newRow.push(value);

        return newRow;
      }

      if (value === newRow[newRow.length - 1] && !isSumm) {
        isSumm = true;
        sum = newRow.slice(-1) * 2;

        return [...newRow.slice(0, -1), newRow.slice(-1) * 2];
      }

      return [...newRow, value];
    }, []);

    const rowWithCollapsedLtr =
      leftToRightSum.length === 4
        ? leftToRightSum
        : [
            ...leftToRightSum,
            ...new Array(size - leftToRightSum.length).fill(0),
          ];

    return {
      row: rowWithCollapsedLtr,
      summCollapsed: sum,
    };
  }

  transposeField(field) {
    const transposedField = field.reduce((newArr, row) => {
      row.forEach((item, itemIdx) => {
        newArr[itemIdx] = [...(newArr[itemIdx] || []), item];
      });

      return newArr;
    }, []);

    return transposedField;
  }

  compareGameField(array1, array2) {
    const array1Json = JSON.stringify(array1);
    const array2Json = JSON.stringify(array2);

    return array1Json === array2Json;
  }

  getAvailabilityMovement(field) {
    let sumOfCollapsedCells = 0;

    // check for free cells

    const hasFreeCell = field.flat().includes(0);

    if (hasFreeCell) {
      return true;
    }

    // check availablityt for left or right movement
    field.forEach((row) => {
      const { summCollapsed: leftCollapsed } = this.sumRow(
        row,
        this.fieldSize,
        this.direction.left,
      );
      const { summCollapsed: rightCollapsed } = this.sumRow(
        row,
        this.fieldSize,
        this.direction.right,
      );

      sumOfCollapsedCells += leftCollapsed + rightCollapsed;
    });

    // check availablity for up or down movement

    const tr = this.transposeField(field);

    tr.forEach((row) => {
      const { summCollapsed: upCollapsed } = this.sumRow(
        row,
        this.fieldSize,
        this.direction.up,
      );
      const { summCollapsed: downCollapsed } = this.sumRow(
        row,
        this.fieldSize,
        this.direction.down,
      );

      sumOfCollapsedCells += upCollapsed + downCollapsed;
    });

    return sumOfCollapsedCells > 0;
  }

  // game logic methods

  sumGameFieldByRow(direction) {
    const gameField = this.state;
    const size = this.fieldSize;
    let scoreByField = this.score || 0;

    const calculatedGameField = gameField.map((row) => {
      const { row: rowCollaped, summCollapsed } = this.sumRow(
        row,
        size,
        // eslint-disable-next-line no-unneeded-ternary
        direction === this.direction.right ? true : false,
      );

      scoreByField += summCollapsed;

      return rowCollaped;
    });

    const isGameFieldChanged = !this.compareGameField(
      gameField,
      calculatedGameField,
    );

    if (!isGameFieldChanged) {
      return;
    }

    this.score = scoreByField;
    this.state = calculatedGameField;
    this.cellMax = this.getMaxValueCell(calculatedGameField);
    this.generateRandomCellOnField();
  }

  sumGameFieldByColumn(direction) {
    const gameField = this.state;
    const size = this.fieldSize;
    let scoreByField = this.score || 0;

    const calculatedGameField = this.transposeField(gameField).map((row) => {
      const { row: rowCollaped, summCollapsed } = this.sumRow(
        row,
        size,
        // eslint-disable-next-line no-unneeded-ternary
        direction === this.direction.down ? true : false,
      );

      scoreByField += summCollapsed;

      return rowCollaped;
    });

    const isGameFieldChanged = !this.compareGameField(
      gameField,
      calculatedGameField,
    );

    if (!isGameFieldChanged) {
      return;
    }

    this.score = scoreByField;
    this.state = this.transposeField(calculatedGameField);
    this.cellMax = this.getMaxValueCell(calculatedGameField);
    this.generateRandomCellOnField();
  }

  generateRandomCellOnField(qty = 1) {
    const gameField = JSON.parse(JSON.stringify(this.state));

    for (let i = 0; i < qty; i++) {
      let cell = this.getRandomCellIndex();
      const cellValue = this.getRandomCellValue();

      while (gameField[cell.row][cell.col]) {
        cell = this.getRandomCellIndex();
      }

      gameField[cell.row][cell.col] = cellValue;
    }
    this.state = gameField;

    this.isAvailableMovement = this.getAvailabilityMovement(gameField);
  }
}

module.exports = Game;
