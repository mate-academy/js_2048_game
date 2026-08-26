'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static numbersToAppear = [2, 2, 2, 2, 4];
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
  constructor() {
    // eslint-disable-next-line no-console
    this.board = Game.initialState;
    this.score = 0;
    this.gameWon = false;
  }

  moveLeft(checkingMoves = false) {
    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheLeft(row, true);
      });

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheLeft(row);
    });
  }

  moveRight(checkingMoves = false) {
    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheRight(row, true);
      });

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheRight(row);
    });
  }

  moveUp() {}
  moveDown() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.addRandomNumbers();
  }

  addRandomNumbers() {
    this.insertNumberOnBoard();
    this.insertNumberOnBoard();
  }

  insertNumberOnBoard() {
    const emptySpacesOnBoard = this.getFreeSpaces();
    const randomNumber = this.getRandomNumber(1, emptySpacesOnBoard);

    let countIndex = 0;

    this.board = this.board.map((row) => {
      return row.map((element) => {
        if (element === 0) {
          if (countIndex === randomNumber - 1) {
            countIndex++;

            return Game.numbersToAppear[
              Math.floor(Math.random() * Game.numbersToAppear.length)
            ];
          }
          countIndex++;

          return element;
        }

        return element;
      });
    });
  }

  getFreeSpaces() {
    let freeSpacesCount = 0;

    this.board.forEach((row) => {
      return row.forEach((element) => {
        if (element === 0) {
          freeSpacesCount++;
        }
      });
    });

    return freeSpacesCount;
  }

  getRandomNumber(min, max) {
    const minCeiled = Math.ceil(min);

    return Math.floor(
      Math.random() * (Math.floor(max) - minCeiled + 1) + minCeiled,
    );
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Game.initialState;
    this.score = 0;
    this.gameWon = false;

    this.insertNumberOnBoard();
    this.insertNumberOnBoard();
  }

  getElementsToTheLeft(values, checkMoves = false) {
    const onlyValues = [];

    for (let i = 0; i < values.length; i++) {
      if (values[i] !== 0) {
        onlyValues.push(values[i]);
      }
    }

    for (let i = 1; i < onlyValues.length; i++) {
      if (onlyValues[i - 1] === onlyValues[i] && onlyValues[i] !== 0) {
        onlyValues[i - 1] *= 2;

        if (!checkMoves) {
          this.score += onlyValues[i - 1];
        }

        if (onlyValues[i - 1] === 2048) {
          this.gameWon = true;
        }
        onlyValues[i] = 0;

        i++;
      }
    }

    const finalValues = [];

    for (const number of onlyValues) {
      if (number !== 0) {
        finalValues.push(number);
      }
    }

    while (values.length > finalValues.length) {
      finalValues.push(0);
    }

    if (checkMoves) {
      if (values.every((value, index) => value === finalValues[index])) {
        return [false];
      }

      return [true];
    }

    return finalValues;
  }

  checkAvailableMoves() {
    return this.moveLeft(true) && this.moveRight(true);
  }

  getElementsToTheRight(values, checkMoves = false) {
    const onlyValues = [];

    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] !== 0) {
        onlyValues.push(values[i]);
      }
    }

    for (let i = 1; i < onlyValues.length; i++) {
      if (onlyValues[i - 1] === onlyValues[i] && onlyValues[i] !== 0) {
        onlyValues[i - 1] *= 2;

        if (!checkMoves) {
          this.score += onlyValues[i - 1];
        }

        if (onlyValues[i - 1] === 2048) {
          this.gameWon = true;
        }
        onlyValues[i] = 0;

        i++;
      }
    }

    const finalValues = [];

    for (const number of onlyValues) {
      if (number !== 0) {
        finalValues.push(number);
      }
    }

    while (values.length > finalValues.length) {
      finalValues.push(0);
    }

    if (checkMoves) {
      if (values.every((value, index) => value === finalValues[index])) {
        return [false];
      }

      return [true];
    }

    return finalValues.reverse();
  }

  // Add your own methods here
}

module.exports = Game;
