'use strict';

/**
 * This class represents the game.
 */
class Game {
  static initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static numbersToAppear = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    Game.initialState = initialState;
    this.board = initialState;
    this.score = 0;
    this.gameWon = false;
    this.started = false;
    this.defaultStatus = true;
  }

  moveLeft(checkingMoves = false) {
    if (!this.started) {
      return;
    }

    const boardBefore = [...this.board.map((row) => [...row])];

    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheSide(row, true);
      });

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheSide(row);
    });

    if (!this.checkChange(boardBefore, this.board)) {
      this.addRandomNumbers();
    }
  }

  moveRight(checkingMoves = false) {
    if (!this.started) {
      return;
    }

    const boardBefore = [...this.board.map((row) => [...row])];

    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheSide([...row].reverse(), true);
      });

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheSide([...row].reverse()).reverse();
    });

    if (!this.checkChange(boardBefore, this.board)) {
      this.addRandomNumbers();
    }
  }

  moveUp(checkingMoves = false) {
    if (!this.started) {
      return;
    }

    const boardBefore = [...this.board.map((row) => [...row])];

    this.board = this.transposeMatrix();

    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheSide(row, true);
      });

      this.board = this.transposeMatrix();

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheSide(row);
    });

    this.board = this.transposeMatrix();

    if (!this.checkChange(boardBefore, this.board)) {
      this.addRandomNumbers();
    }
  }

  moveDown(checkingMoves = false) {
    if (!this.started) {
      return;
    }

    const boardBefore = [...this.board.map((row) => [...row])];

    this.board = this.transposeMatrix();

    if (checkingMoves) {
      const result = this.board.map((row) => {
        return this.getElementsToTheSide([...row].reverse(), true);
      });

      this.board = this.transposeMatrix();

      return result.some((value) => value[0] === true);
    }

    this.board = this.board.map((row) => {
      return this.getElementsToTheSide([...row].reverse()).reverse();
    });

    this.board = this.transposeMatrix();

    if (!this.checkChange(boardBefore, this.board)) {
      this.addRandomNumbers();
    }
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
    if (this.gameWon) {
      return 'win';
    }

    if (this.defaultStatus) {
      return 'idle';
    }

    if (!this.checkAvailableMoves()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [...Game.initialState.map((row) => [...row])];
    this.addRandomNumbers();
    this.addRandomNumbers();
    this.started = true;
    this.defaultStatus = false;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Game.initialState.map((row) => [...row]);
    this.score = 0;
    this.gameWon = false;
    this.defaultStatus = true;
  }

  addRandomNumbers() {
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

  checkAvailableMoves() {
    return (
      this.moveLeft(true) ||
      this.moveRight(true) ||
      this.moveUp(true) ||
      this.moveDown(true)
    );
  }

  getElementsToTheSide(values, checkMoves = false) {
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

  transposeMatrix() {
    const transposedMatrix = [[], [], [], []];

    this.board.forEach((row, rowIndex) => {
      row.forEach((element, elementIndex) => {
        transposedMatrix[elementIndex][rowIndex] = element;
      });
    });

    return transposedMatrix;
  }

  checkState() {
    return Game.initialState.every((row, rowIndex) => {
      row.every((element, elementIndex) => {
        return element === this.board[rowIndex][elementIndex];
      });
    });
  }

  checkChange(boardBefore, boardAfter) {
    return boardBefore.every((row, rowIndex) => {
      return row.every((element, elementIndex) => {
        return element === boardAfter[rowIndex][elementIndex];
      });
    });
  }
}

module.exports = Game;
