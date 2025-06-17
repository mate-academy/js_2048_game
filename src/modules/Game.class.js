'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  status = '';

  BOARD_SIZE = 4;
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the gameField.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the gameField will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.status = 'idle';

    if (initialState && initialState.length === this.BOARD_SIZE) {
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let column = 0; column < this.BOARD_SIZE; column++) {
          if (initialState[row][column] === undefined) {
            this.gameField = [
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
              [0, 0, 0, 0],
            ];

            return;
          } else {
            this.gameField[row][column] = initialState[row][column];
          }
        }
      }
    }
  }

  moveLeft() {
    let hasNewPosition = false;

    for (let row = 0; row < this.BOARD_SIZE; row++) {
      const shift = this.lineShift(this.gameField[row]);

      if (shift.isMove) {
        hasNewPosition = true;
        this.gameField[row] = [...shift.line];
      }
    }

    if (hasNewPosition) {
      this.setNewPosition();
    }
  }

  moveRight() {
    let hasNewPosition = false;

    for (let row = 0; row < this.BOARD_SIZE; row++) {
      const shift = this.lineShift([...this.gameField[row]].reverse());

      if (shift.isMove) {
        hasNewPosition = true;
        this.gameField[row] = [...shift.line.reverse()];
      }
    }

    if (hasNewPosition) {
      this.setNewPosition();
    }
  }

  moveUp() {
    let hasNewPosition = false;

    for (let col = 0; col < this.BOARD_SIZE; col++) {
      const shift = this.lineShift([
        this.gameField[0][col],
        this.gameField[1][col],
        this.gameField[2][col],
        this.gameField[3][col],
      ]);

      if (shift.isMove) {
        hasNewPosition = true;

        shift.line.forEach((cell, index) => {
          this.gameField[index][col] = cell;
        });
      }
    }

    if (hasNewPosition) {
      this.setNewPosition();
    }
  }

  moveDown() {
    let hasNewPosition = false;

    for (let col = 0; col < this.BOARD_SIZE; col++) {
      const shift = this.lineShift([
        this.gameField[3][col],
        this.gameField[2][col],
        this.gameField[1][col],
        this.gameField[0][col],
      ]);

      if (shift.isMove) {
        hasNewPosition = true;

        shift.line.reverse().forEach((cell, index) => {
          this.gameField[index][col] = cell;
        });
      }
    }

    if (hasNewPosition) {
      this.setNewPosition();
    }
  }

  lineShift(line) {
    let finish = false;
    let isMove = false;

    while (!finish) {
      finish = true;

      for (let i = 1; i < this.BOARD_SIZE; i++) {
        if (line[i] !== 0) {
          if (line[i - 1] === 0) {
            line[i - 1] = line[i];
            line[i] = 0;
            finish = false;
            isMove = true;
          } else if (line[i - 1] === line[i]) {
            line[i - 1] *= 2;
            line[i] = 0;
            isMove = true;
          }
        }
      }
    }

    return {
      isMove: isMove,
      line: line,
    };
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameField.reduce((score, row) => {
      return score + row.reduce((sum, cell) => sum + cell, 0);
    }, 0);
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.gameField;
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
    let [row1, col1] = this.getRandomPosition();
    let [row2, col2] = this.getRandomPosition();

    this.status = 'playing';

    while (col1 === col2 && row1 === row2) {
      [row1, col1] = this.getRandomPosition();
      [row2, col2] = this.getRandomPosition();
    }

    this.gameField[row1][col1] = 2;
    this.gameField[row2][col2] = 2;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.gameField = this.gameField.map((row) => row.map((cell) => 0));

    this.start();
  }

  getRandomPosition() {
    return [
      Math.floor(Math.random() * this.BOARD_SIZE),
      Math.floor(Math.random() * this.BOARD_SIZE),
    ];
  }

  setNewPosition() {
    if (
      this.gameField.reduce(
        (hasEmptyCell, row) =>
          row.find((cell) => cell === 0) !== undefined ? true : hasEmptyCell,
        false,
      )
    ) {
      let [row, col] = this.getRandomPosition();

      while (this.gameField[row][col] !== 0) {
        [row, col] = this.getRandomPosition();
      }

      this.gameField[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }
}

module.exports = Game;
