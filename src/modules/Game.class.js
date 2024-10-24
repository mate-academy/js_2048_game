'use strict';

import constants from '../scripts/constants.js';

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
  constructor(initialState = constants.INITIAL_STATE) {
    this.gameContext = {
      state: initialState,
      score: 0,
      status: constants.STATUS.idle,
      movePossible: true,
      moves: 0,
    };
  }

  moveLeft() {
    return this.move(constants.DIRECTION.left);
  }
  moveRight() {
    return this.move(constants.DIRECTION.right);
  }
  moveUp() {
    return this.move(constants.DIRECTION.up);
  }
  moveDown() {
    return this.move(constants.DIRECTION.down);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameContext.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return Array.from(this.gameContext.state).map((line) => Array.from(line));
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
    return this.getGameContext().status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.updateGameContext({ status: constants.STATUS.playing });
    this.addRandomCellValue();
    this.addRandomCellValue();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.updateGameContext({
      score: 0,
      state: constants.INITIAL_STATE,
      status: constants.STATUS.playing,
    });
    this.addRandomCellValue();
    this.addRandomCellValue();
  }

  // Add your own methods here
  /**
   * Updates context with 'win' status
   */
  win() {
    this.updateGameContext({ status: constants.STATUS.win });
  }

  /**
   * Updates context with 'lose' status
   */
  lose() {
    this.updateGameContext({ status: constants.STATUS.lose });
  }

  /**
   * returns number of moves made since start/restart of the game
   * @returns {number}
   */
  getMoves() {
    return this.getGameContext().moves;
  }

  /**
   * returns game context contatining core stats of the game
   * @returns {object}
   */
  getGameContext() {
    return this.gameContext;
  }

  /**
   * function checks whether any particular tile can be moved in a position of
   * the next tile in the direction of the move (or merged with it)
   * @param {number} first
   * @param {number} second
   * @returns {boolean} true (if move or merge is possible), otherwise - false
   */
  canMoveOrMergeCells(first, second) {
    return (
      (first === 0 && second !== 0) ||
      ((first !== 0 || second !== 0) && first === second)
    );
  }

  /**
   * checks whether current state of the field has tiles with zero value.
   * @returns {boolean}
   */
  stateHasZeroes() {
    return this.getState().some((line) => {
      return line.some((cell) => cell === 0);
    });
  }

  /**
   * checks whether current state of the field has at least
   * one case of tiles that can be merged
   * @returns {boolean}
   */
  mergeIsPossible() {
    const state = this.getState();

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        const current = state[i][j];
        const right = state[i][j + 1];

        if (right && current === right) {
          return true;
        }

        if (i === state.length - 1) {
          continue;
        }

        const below = state[i + 1][j];

        if (below && current === below) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if the current state of the field has any moves available.
   * @returns {boolean}
   */
  checkIfLost() {
    return !this.stateHasZeroes() && !this.mergeIsPossible();
  }

  /**
   * Checks whether any cell line (1d array) has any moves available.
   * @param {number[][]} state
   * @returns {boolean}
   */
  checkAvailableMovesOnSingleLine(state) {
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length - 1; j++) {
        const first = state[i][j];
        const second = state[i][j + 1];

        if (this.canMoveOrMergeCells(first, second)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Method updates current state of the game context with new values
   * @param {object} keyValuePairObj
   */
  updateGameContext(keyValuePairObj) {
    Object.entries(keyValuePairObj).forEach((entry) => {
      const key = entry[0];
      const value = entry[1];

      this.gameContext[key] = value;
    });
  }

  /**
   * @param {number[][]} state - some form of state of the field
   * @returns {number[][]} copy of the state reversed horizontally
   */
  reverseStateByAxis(state) {
    return Array.from(state.map((line) => Array.from(line).reverse()));
  }

  /**
   * Function calls relevant functions which may need to
   * transpose and/or reverses state of the field
   * depending on direction of the move
   * @param {number[][]} state - some form of state of the field
   * @param {string} direction - 'left', 'right', 'up', 'down'
   * @returns {number[][]} copy of updated state of the field
   */
  transformStatePerDirection(state, direction) {
    switch (direction) {
      case constants.DIRECTION.left: {
        return state;
      }

      case constants.DIRECTION.right: {
        return this.reverseStateByAxis(state);
      }

      case constants.DIRECTION.up: {
        return this.transposeState(state, false);
      }

      case constants.DIRECTION.down: {
        return this.transposeState(state, true);
      }
    }
  }

  /**
   * Function transposes rows of the state of the field into columns.
   * If needed, function reverses the lines of the transposed field.
   * @param {number[][]} state - some form of state of the field
   * @param {boolean} reverse - whether the transposed field should be reversed.
   * @returns copy of the transposed/reversed state of the field.
   */
  transposeState(state, reverse = false) {
    const transposeState = Array.from(state).map((line) => Array.from(line));

    state.forEach((line, i) => {
      line.forEach((cell, j) => {
        transposeState[j][i] = cell;
      });
    });

    return reverse
      ? transposeState.reverse().map((line) => line.reverse())
      : transposeState;
  }

  /**
   * Function removes zeroes from the state of the field.
   * @param {number[][]} state - some form of the state of the field
   * @returns {number[][]} - copy of the the field without zero valued tiles
   */
  removeZeroes(state) {
    return Array.from(state).map((line) => {
      return Array.from(line).filter((num) => num !== 0);
    });
  }

  /**
   * Functions adds zeroes to empty tiles (after moves and merges are complete)
   * @param {number[][]} state - some form of the state of the field
   * @returns {number[][]} - copy of the field filled with 0 valued cells
   */
  fillWithZeroes(state) {
    return Array.from(state).map((line) => {
      if (line.length < constants.FIELD_SIZE) {
        const updatedLine = Array.from(line);

        updatedLine.length = constants.FIELD_SIZE;

        return updatedLine.fill(0, line.length, constants.FIELD_SIZE);
      } else {
        return Array.from(line);
      }
    });
  }

  /**
   * Function that processes:
   * (1) move of non-zero tiles
   * (2) merge of tiles
   * (3) update score per turn
   * (4) removes zeroes got as a result of merge
   * @param {number[][]} state - some form of the field
   * @returns {number[][]} - copy of the field with moved/merged cells
   */
  moveAndMergeTiles(state) {
    const resultField = Array.from(state);
    let score = 0;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length - 1; j++) {
        const current = state[i][j];
        const next = state[i][j + 1];

        if (current === 0) {
          continue;
        }

        if (current === next) {
          const mergeValue = current * 2;

          if (mergeValue === constants.WIN_VALUE) {
            this.updateGameContext({ status: constants.STATUS.win });
          }

          score += mergeValue;
          resultField[i][j] = mergeValue;
          resultField[i][j + 1] = 0;
        }
      }
    }

    const resultWithNoExtraZeroes = this.removeZeroes(resultField);

    return { score: score, stateWithMergedTiles: resultWithNoExtraZeroes };
  }

  /**
   * Function that selects proper move function
   * depending on the direction of the move
   * @param {string} direction - 'left', 'right', 'up', 'down'
   * @returns {function}
   */
  selectMoveFunction(direction) {
    const functions = {
      left: this.moveLeft.bind(this),
      right: this.moveRight.bind(this),
      up: this.moveUp.bind(this),
      down: this.moveDown.bind(this),
    };

    return functions[direction];
  }

  /**
   * Function that coordinates the procedure of the move
   * @param {string} direction - 'left', 'right', 'up', 'down'
   * @returns {boolean} true, if move succesfully processed
   */
  move(direction) {
    // transform state (per X and Y axis) into convenient rows
    const transformedState = this.transformStatePerDirection(
      this.getState(),
      direction,
    );

    // if move is not possible, move is not processed
    this.updateGameContext({
      movePossible: this.checkAvailableMovesOnSingleLine(transformedState),
    });

    if (!this.getGameContext().movePossible) {
      return false;
    }

    // if move possible, remove zero tiles
    const stateWithoutZeroes = this.removeZeroes(transformedState);

    // merge tiles and calculate score
    const { score, stateWithMergedTiles } =
      this.moveAndMergeTiles(stateWithoutZeroes);

    // empty tiles assigned with zero values
    const updatedStateWithZeroes = this.fillWithZeroes(stateWithMergedTiles);

    // re-transform X and Y axes back to their original state
    const reTransformedState = this.transformStatePerDirection(
      updatedStateWithZeroes,
      direction,
    );

    // update game context with results of the move
    this.updateGameContext({
      score: this.getScore() + score,
      state: reTransformedState,
      moves: (this.getGameContext().moves += 1),
    });

    return true;
  }

  /**
   * Function checks whether 4 valued cell should be added
   * with certain probability (currently 10%)
   * @returns {boolean}
   */
  isTimeForFourTile() {
    return Math.random() < constants.PROBABILITY_FOR_FOUR;
  }

  /**
   *
   * @param {number} number
   * @param {number} probability - number between 0 and 1
   * @returns
   */
  randomlyChangeNumberWithProbability(number, probability) {
    const random = Math.random();

    return random < probability ? random : number;
  }

  /**
   * Function analyses current state of the field and randomly adds
   * a new cell with value of 2 (90% probability) or 4 (10% probability).
   * Function is based on Reservoir Sampling algorithm.
   * @returns {object} contains boolean field 'failedToAdd' and,
   * in case of success, also contains row and col numbers and respective value.
   */
  addRandomCellValue() {
    const state = this.getState();
    const updatedField = Array.from(state).map((line) => Array.from(line));

    let count = 1;
    const probability = () => 1 / count;
    let row = -1;
    let col = -1;
    let referenceRandom = -1;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] !== 0) {
          continue;
        }

        const random = this.randomlyChangeNumberWithProbability(
          referenceRandom,
          probability(),
        );

        if (random !== referenceRandom) {
          referenceRandom = random;
          row = i;
          col = j;
        }

        count++;
      }
    }

    if (row === -1 || col === -1 || updatedField[row][col] === undefined) {
      return { failedToAdd: true };
    }

    const value = this.isTimeForFourTile() ? 4 : 2;

    if (updatedField[row][col] === 0) {
      updatedField[row][col] = value;
      this.updateGameContext({ state: updatedField });

      return {
        failedToAdd: false,
        row: row,
        col: col,
        value: value,
      };
    }

    return { failedToAdd: true };
  }
}

module.exports = Game;
