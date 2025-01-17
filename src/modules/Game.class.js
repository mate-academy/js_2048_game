'use strict';

class Game {
  /**
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   */

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.initialState = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  static transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  static ifEqualSeeEach(elements) {
    let ifEqual = false;
    const indexesOfRight = [];
    const allEqual = elements.every((item) => {
      return item === elements[0] && elements[0] !== 0;
    });

    for (let i = 0; i < elements.length - 1; i += 1) {
      let j = i + 1;

      if (elements[j] === 0) {
        j++;

        if (elements[j] === 0) {
          j++;
        }
      }

      if (elements[i] === elements[j] && elements[i] !== 0) {
        ifEqual = true;

        indexesOfRight.push(i);
        indexesOfRight.push(j);

        if (
          !allEqual &&
          !(elements[0] === elements[1] && elements[2] === elements[3])
        ) {
          break;
        }

        i++;
      }
    }

    return [ifEqual, indexesOfRight];
  }

  static convertTo2DArray(arr) {
    const result = [];

    for (let i = 0; i < 4; i++) {
      result.push(arr.slice(i * 4, i * 4 + 4));
    }

    return result;
  }

  static cellsMoveValues(rowOrColValues) {
    let insertPosition = 0;
    const valuesCopy = [...rowOrColValues];

    valuesCopy.forEach((cell, index, row) => {
      if (cell !== 0) {
        if (insertPosition !== index) {
          valuesCopy[insertPosition] = cell;
          row[index] = 0;
        }
        insertPosition++;
      }
    });

    return valuesCopy;
  }

  static are2DArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((subArr1, index) => {
      const subArr2 = arr2[index];

      if (subArr1.length !== subArr2.length) {
        return false;
      }

      return subArr1.every((value, subIndex) => value === subArr2[subIndex]);
    });
  }

  canCellsMove(grid) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = grid[row][col];

        if (
          (col < 3 && current === grid[row][col + 1]) ||
          (row < 3 && current === grid[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  cellsMergeValues(target, second) {
    const newTarget = target + second;
    const newSecond = 0;

    this.score += newTarget;

    return [newTarget, newSecond];
  }

  moveLeft() {
    if (this.status === 'playing') {
      const firstState = this.getState();

      this.state = this.state.map((row) => {
        const rowCopy = [...row];
        const ifEquals = Game.ifEqualSeeEach(rowCopy)[0];
        const indexesOfRights = Game.ifEqualSeeEach(rowCopy)[1];

        if (ifEquals) {
          const newCells = this.cellsMergeValues(
            rowCopy[indexesOfRights[0]],
            rowCopy[indexesOfRights[1]],
          );

          rowCopy[indexesOfRights[0]] = newCells[0];
          rowCopy[indexesOfRights[1]] = newCells[1];

          if (indexesOfRights.length === 4) {
            const newCells2 = this.cellsMergeValues(
              rowCopy[indexesOfRights[2]],
              rowCopy[indexesOfRights[3]],
            );

            rowCopy[indexesOfRights[2]] = newCells2[0];
            rowCopy[indexesOfRights[3]] = newCells2[1];
          }
        }

        const rowAfterMove = Game.cellsMoveValues(rowCopy);

        return rowAfterMove;
      });

      const secondState = this.getState();

      if (!Game.are2DArraysEqual(firstState, secondState)) {
        this.addRandomCell();
      }
    }

    const gameField = this.getState();
    const flatField = gameField.flat();

    if (flatField.includes(2048)) {
      this.status = 'win';
    }

    if (!this.canCellsMove(this.getState())) {
      this.status = 'lose';
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const firstState = this.getState();

      this.state = this.state.map((row) => {
        const reverseRow = [...row].reverse();
        const ifEquals = Game.ifEqualSeeEach(reverseRow)[0];
        const indexesOfRights = Game.ifEqualSeeEach(reverseRow)[1];

        if (ifEquals) {
          const newCells = this.cellsMergeValues(
            reverseRow[indexesOfRights[0]],
            reverseRow[indexesOfRights[1]],
          );

          reverseRow[indexesOfRights[0]] = newCells[0];
          reverseRow[indexesOfRights[1]] = newCells[1];

          if (indexesOfRights.length === 4) {
            const newCells2 = this.cellsMergeValues(
              reverseRow[indexesOfRights[2]],
              reverseRow[indexesOfRights[3]],
            );

            reverseRow[indexesOfRights[2]] = newCells2[0];
            reverseRow[indexesOfRights[3]] = newCells2[1];
          }
        }

        const rowAfterMove = Game.cellsMoveValues(reverseRow);

        return rowAfterMove.reverse();
      });

      const secondState = this.getState();

      if (!Game.are2DArraysEqual(firstState, secondState)) {
        this.addRandomCell();
      }
    }

    const gameField = this.getState();
    const flatField = gameField.flat();

    if (flatField.includes(2048)) {
      this.status = 'win';
    }

    if (!this.canCellsMove(this.getState())) {
      this.status = 'lose';
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const firstState = this.getState();

      const currentState = this.state;
      const transState = Game.transposeMatrix(currentState);

      const transMovedState = transState.map((row) => {
        const ifEquals = Game.ifEqualSeeEach(row)[0];
        const indexesOfRights = Game.ifEqualSeeEach(row)[1];

        if (ifEquals) {
          const newCells = this.cellsMergeValues(
            row[indexesOfRights[0]],
            row[indexesOfRights[1]],
          );

          row[indexesOfRights[0]] = newCells[0];
          row[indexesOfRights[1]] = newCells[1];

          if (indexesOfRights.length === 4) {
            const newCells2 = this.cellsMergeValues(
              row[indexesOfRights[2]],
              row[indexesOfRights[3]],
            );

            row[indexesOfRights[2]] = newCells2[0];
            row[indexesOfRights[3]] = newCells2[1];
          }
        }

        const rowAfterMove = Game.cellsMoveValues(row);

        return rowAfterMove;
      });

      this.state = Game.transposeMatrix(transMovedState);

      const secondState = this.getState();

      if (!Game.are2DArraysEqual(firstState, secondState)) {
        this.addRandomCell();
      }
    }

    const gameField = this.getState();
    const flatField = gameField.flat();

    if (flatField.includes(2048)) {
      this.status = 'win';
    }

    if (!this.canCellsMove(this.getState())) {
      this.status = 'lose';
    }
  }

  moveDown() {
    const firstState = this.getState();

    if (this.status === 'playing') {
      const currentState = this.state;
      const transState = Game.transposeMatrix(currentState);

      const transMovedState = transState.map((row) => {
        const reverseRow = [...row].reverse();
        const ifEquals = Game.ifEqualSeeEach(reverseRow)[0];
        const indexesOfRights = Game.ifEqualSeeEach(reverseRow)[1];

        if (ifEquals) {
          const newCells = this.cellsMergeValues(
            reverseRow[indexesOfRights[0]],
            reverseRow[indexesOfRights[1]],
          );

          reverseRow[indexesOfRights[0]] = newCells[0];
          reverseRow[indexesOfRights[1]] = newCells[1];

          if (indexesOfRights.length === 4) {
            const newCells2 = this.cellsMergeValues(
              reverseRow[indexesOfRights[2]],
              reverseRow[indexesOfRights[3]],
            );

            reverseRow[indexesOfRights[2]] = newCells2[0];
            reverseRow[indexesOfRights[3]] = newCells2[1];
          }
        }

        const rowAfterMove = Game.cellsMoveValues(reverseRow);

        return rowAfterMove.reverse();
      });

      this.state = Game.transposeMatrix(transMovedState);

      const secondState = this.getState();

      if (!Game.are2DArraysEqual(firstState, secondState)) {
        this.addRandomCell();
      }
    }

    const gameField = this.getState();
    const flatField = gameField.flat();

    if (flatField.includes(2048)) {
      this.status = 'win';
    }

    if (!this.canCellsMove(this.getState())) {
      this.status = 'lose';
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomStartCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.state = this.initialState;
    this.score = 0;
    this.addRandomStartCells();
  }

  addRandomCell() {
    const currentState = this.getState();
    const linearState = currentState.flat();

    const iOfNulls = [];

    linearState.forEach((cell, index) => {
      if (cell === 0) {
        iOfNulls.push(index);
      }
    });

    if (iOfNulls.length > 0) {
      const randomIndex = Math.floor(Math.random() * iOfNulls.length);
      const randomIOfNull = iOfNulls[randomIndex];

      let value = 0;

      if (Math.random() <= 0.1) {
        value = 4;
      } else {
        value = 2;
      }

      linearState[randomIOfNull] = value;

      this.state = Game.convertTo2DArray(linearState);
    }
  }

  addRandomStartCells() {
    const currentState = this.getState();
    const linearState = currentState.flat();

    const iOfNulls = [];

    linearState.forEach((cell, index) => {
      if (cell === 0) {
        iOfNulls.push(index);
      }
    });

    if (iOfNulls.length > 0) {
      const randomIndex1 = Math.floor(Math.random() * iOfNulls.length);
      const randomIOfNull1 = iOfNulls[randomIndex1];

      iOfNulls.splice(randomIndex1, 1);

      const randomIndex2 = Math.floor(Math.random() * iOfNulls.length);
      const randomIOfNull2 = iOfNulls[randomIndex2];

      let value1 = 0;
      let value2 = 0;

      if (Math.random() <= 0.5) {
        value1 = 4;
      } else {
        value1 = 2;
      }

      if (Math.random() <= 0.5) {
        value2 = 4;
      } else {
        value2 = 2;
      }

      linearState[randomIOfNull1] = value1;
      linearState[randomIOfNull2] = value2;

      this.state = Game.convertTo2DArray(linearState);
    }
  }
}

module.exports = Game;
