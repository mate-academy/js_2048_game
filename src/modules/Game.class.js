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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.directions = {
      right: 'right',
      left: 'left',
      up: 'up',
      down: 'down',
    };

    this.status = {
      idle: 'idle',
      playing: 'playing',
      win: 'win',
      lose: 'lose',
    };
    this.initialState = initialState;
    this.state = initialState;
    this.currentStatus = this.status.idle;
    this.lastRandomZeroIndex = 0;
    this.score = 0;

    this.copyBoard = (board) => board.map((row) => [...row]);

    this.goThroughCells = (board, callback) =>
      board.map((row) => row.map((n) => callback(n)));

    this.getRandomZeroSerialNumber = (zeros) => {
      let randomNumber;

      if (zeros > 1) {
        const getRandomNumber = () => Math.floor(Math.random() * zeros + 1);

        do {
          randomNumber = getRandomNumber();
        } while (randomNumber === this.lastRandomZeroIndex);
      }

      this.lastRandomZeroIndex = randomNumber;

      return zeros === 1 ? 1 : randomNumber;
    };

    this.getNumberToAdd = (ProbabilityOfFour) => {
      const random = Math.random() * 100 + 1;

      return random < ProbabilityOfFour ? 4 : 2;
    };

    this.getZerosAmount = (board) => {
      return board.flat().filter((number) => number === 0).length;
    };

    this.addNumbersToBoard = (numbersAmount = 1) => {
      let updatedBoard = this.copyBoard(this.state);

      const addOneNumber = (board) => {
        if (this.getZerosAmount(board) > 0) {
          const numberToAdd = this.getNumberToAdd(10);
          const zerosAmount = this.getZerosAmount(board);

          const randomIndex = this.getRandomZeroSerialNumber(zerosAmount);
          let indexCounter = 0;

          updatedBoard = this.goThroughCells(board, (n) => {
            if (n === 0) {
              indexCounter++;
            }

            return randomIndex === indexCounter && n === 0 ? numberToAdd : n;
          });

          return updatedBoard;
        }
      };

      for (let i = 0; i < numbersAmount; i++) {
        const updatedBoardCopy = this.copyBoard(updatedBoard);
        // console.log(updatedBoard);

        updatedBoard = addOneNumber(updatedBoardCopy);

        // console.log(updatedBoard);
      }

      return updatedBoard;
    };

    this.moveValues = (direction) => {
      const turnDirection = (arr) => {
        return arr[0].map((_n, rowIndex) => arr.map((num) => num[rowIndex]));
      };

      const isVertical =
        direction === this.directions.up || direction === this.directions.down;
      const isRightDownDirection =
        direction === this.directions.right ||
        direction === this.directions.down;

      const arrayToMove = isVertical ? turnDirection(this.state) : this.state;

      const movedArray = arrayToMove.map((row) => {
        const values = isRightDownDirection
          ? row.filter((cell) => cell !== 0).reverse()
          : row.filter((cell) => cell !== 0);

        for (let i = 0; i < values.length; i++) {
          if (values[i] === values[i + 1] && values[i] !== 0) {
            values[i + 1] = 0;
            values[i] *= 2;

            this.score += values[i];
          }
        }

        const mergedValues = isRightDownDirection
          ? values.filter((cell) => cell !== 0).reverse()
          : values.filter((cell) => cell !== 0);

        const zeros = new Array(4 - mergedValues.length).fill(0);

        return isRightDownDirection
          ? [...zeros, ...mergedValues]
          : [...mergedValues, ...zeros];
      });

      return isVertical ? turnDirection(movedArray) : movedArray;
    };

    this.canVerticalMerge = () => {
      let isPossible = false;

      this.state.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          let canVerticalMerge;

          if (rowIndex < this.state.length - 1) {
            canVerticalMerge = cell === this.state[rowIndex + 1][cellIndex];
          }

          if (canVerticalMerge) {
            isPossible = true;
          }
        });
      });

      return isPossible;
    };

    this.canHorizontalMerge = () => {
      let isPossible = false;

      this.state.forEach((row) => {
        row.forEach((cell, cellIndex) => {
          let canHorizontalMerge;

          if (cellIndex < row.length - 1) {
            canHorizontalMerge = cell === row[cellIndex + 1];
          }

          if (canHorizontalMerge) {
            isPossible = true;
          }
        });
      });

      return isPossible;
    };

    this.isEquelToState = (board) => {
      const currentBoard = this.state;

      return currentBoard.every((row, rowIndex) => {
        return row.every((cell, cellIndex) => {
          return cell === board[rowIndex][cellIndex];
        });
      });
    };
  }

  moveLeft() {
    const boardAfterMoving = this.moveValues(this.directions.left);

    const canMove =
      this.currentStatus === 'playing' &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }
  moveRight() {
    const boardAfterMoving = this.moveValues(this.directions.right);

    const canMove =
      this.currentStatus === 'playing' &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }

  moveUp() {
    const boardAfterMoving = this.moveValues(this.directions.up);

    const canMove =
      this.currentStatus === 'playing' &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
    }
  }
  moveDown() {
    const boardAfterMoving = this.moveValues(this.directions.down);

    const canMove =
      this.currentStatus === 'playing' &&
      !this.isEquelToState(boardAfterMoving);

    if (canMove) {
      this.state = boardAfterMoving;
      this.state = this.addNumbersToBoard(1);
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
    let isWin = false;
    let currentStatus = this.currentStatus;
    const zerosAmount = this.getZerosAmount(this.state);
    const isMovementExist =
      this.canVerticalMerge() || this.canHorizontalMerge();

    this.state.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          isWin = true;
        }
      });
    });

    const isLose = zerosAmount === 0 && !isMovementExist;

    if (isWin) {
      currentStatus = this.status.win;
    } else if (isLose) {
      currentStatus = this.status.lose;
    }

    return currentStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.currentStatus = 'playing';
    this.state = this.addNumbersToBoard(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.currentStatus = 'idle';
    this.state = this.initialState;
    this.score = 0;
  }

  // Add your own methods here
}

module.exports = Game;
