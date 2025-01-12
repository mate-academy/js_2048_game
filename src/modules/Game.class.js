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
    this.initialState = initialState;

    const gameField = document.querySelector('.game-field');
    const cells = gameField.querySelectorAll('.field-cell');
    const regularArray = this.initialState.flat();

    cells.forEach((cell, index) => {
      if (regularArray[index] > 0) {
        cell.textContent = regularArray[index];

        cell.classList.add(`field-cell--${regularArray[index]}`);
      }
    });
  }

  static canCellsMove(grid) {
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

  static cellsMerge(target, second) {
    target.textContent =
      Number(target.textContent) + Number(second.textContent);

    const cellClasses1 = Array.from(target.classList);
    const cellClassNumber1 = cellClasses1.find((className) => {
      return className.startsWith('field-cell--');
    });
    const cellClasses2 = Array.from(second.classList);
    const cellClassNumber2 = cellClasses2.find((className) => {
      return className.startsWith('field-cell--');
    });

    target.classList.remove(cellClassNumber1);

    target.classList.add(`field-cell--${target.textContent}`);

    second.textContent = '';
    second.classList.remove(cellClassNumber2);

    const gameScore = document.querySelector('.game-score');

    gameScore.textContent =
      Number(gameScore.textContent) + Number(target.textContent.trim());
  }

  static cellsMove(rowOrColElements) {
    let insertPosition = 0;

    rowOrColElements.forEach((cell, index) => {
      if (cell.textContent.trim() !== '') {
        if (insertPosition !== index) {
          const cellClasses = Array.from(cell.classList);
          const cellClassNumber = cellClasses.find((className) => {
            return className.startsWith('field-cell--');
          });
          const justNumber = cellClassNumber.replace('field-cell--', '');

          cell.classList.remove(cellClassNumber);
          cell.textContent = '';

          rowOrColElements[insertPosition].classList.add(cellClassNumber);
          rowOrColElements[insertPosition].textContent = justNumber;
        }
        insertPosition++;
      }
    });
  }

  moveLeft() {
    if (event.key === 'ArrowLeft') {
      const startState = this.getState();
      const gameFieldBody = document.querySelector('.game-field tbody');
      const rows = gameFieldBody.querySelectorAll('.field-row');

      rows.forEach((row) => {
        const rowList = row.querySelectorAll('.field-cell');
        const rowArray = [...rowList];
        const rowNumbers = rowArray.map((td) => {
          return Number(td.textContent);
        });

        const ifEquals = Game.ifEqualSeeEach(rowNumbers)[0];
        const indexesOfRights = Game.ifEqualSeeEach(rowNumbers)[1];

        if (ifEquals) {
          Game.cellsMerge(
            rowArray[indexesOfRights[0]],
            rowArray[indexesOfRights[1]],
          );

          if (indexesOfRights.length === 4) {
            Game.cellsMerge(
              rowArray[indexesOfRights[2]],
              rowArray[indexesOfRights[3]],
            );
          }
        }

        Game.cellsMove(rowArray);
      });

      const finishState = this.getState();

      if (!Game.are2DArraysEqual(startState, finishState)) {
        this.addRandomCell();
      }

      if (!Game.canCellsMove(this.getState())) {
        this.ifStateBlocked();
      }
    }
  }

  moveRight() {
    if (event.key === 'ArrowRight') {
      const startState = this.getState();
      const gameFieldBody = document.querySelector('.game-field tbody');
      const rows = gameFieldBody.querySelectorAll('.field-row');

      rows.forEach((row) => {
        const rowList = row.querySelectorAll('.field-cell');
        const rowArray = [...rowList];
        const reverseRow = rowArray.reverse();
        const rowNumbers = reverseRow.map((td) => {
          return Number(td.textContent);
        });

        const ifEquals = Game.ifEqualSeeEach(rowNumbers)[0];
        const indexesOfRights = Game.ifEqualSeeEach(rowNumbers)[1];

        if (ifEquals) {
          Game.cellsMerge(
            reverseRow[indexesOfRights[0]],
            reverseRow[indexesOfRights[1]],
          );

          if (indexesOfRights.length === 4) {
            Game.cellsMerge(
              reverseRow[indexesOfRights[2]],
              reverseRow[indexesOfRights[3]],
            );
          }
        }

        Game.cellsMove(reverseRow);
      });

      const finishState = this.getState();

      if (!Game.are2DArraysEqual(startState, finishState)) {
        this.addRandomCell();
      }

      if (!Game.canCellsMove(this.getState())) {
        this.ifStateBlocked();
      }
    }
  }

  moveUp() {
    if (event.key === 'ArrowUp') {
      const startState = this.getState();
      const gameFieldBody = document.querySelector('.game-field tbody');
      const rows = gameFieldBody.querySelectorAll('.field-row');
      const column0 = [];
      const column1 = [];
      const column2 = [];
      const column3 = [];
      const columns = [];

      columns.push(column0, column1, column2, column3);

      rows.forEach((row) => {
        const cellsArray = [...row.querySelectorAll('.field-cell')];

        column0.push(cellsArray[0]);
        column1.push(cellsArray[1]);
        column2.push(cellsArray[2]);
        column3.push(cellsArray[3]);
      });

      columns.forEach((column) => {
        const colNumbers = column.map((td) => {
          return Number(td.textContent);
        });

        const ifEquals = Game.ifEqualSeeEach(colNumbers)[0];
        const indexesOfRights = Game.ifEqualSeeEach(colNumbers)[1];

        if (ifEquals) {
          Game.cellsMerge(
            column[indexesOfRights[0]],
            column[indexesOfRights[1]],
          );

          if (indexesOfRights.length === 4) {
            Game.cellsMerge(
              column[indexesOfRights[2]],
              column[indexesOfRights[3]],
            );
          }
        }

        Game.cellsMove(column);
      });

      const finishState = this.getState();

      if (!Game.are2DArraysEqual(startState, finishState)) {
        this.addRandomCell();
      }

      if (!Game.canCellsMove(this.getState())) {
        this.ifStateBlocked();
      }
    }
  }

  moveDown() {
    if (event.key === 'ArrowDown') {
      const startState = this.getState();
      const gameFieldBody = document.querySelector('.game-field tbody');
      const rows = gameFieldBody.querySelectorAll('.field-row');
      const column0 = [];
      const column1 = [];
      const column2 = [];
      const column3 = [];
      const columns = [];

      columns.push(column0, column1, column2, column3);

      rows.forEach((row) => {
        const cellsArray = [...row.querySelectorAll('.field-cell')];

        column0.push(cellsArray[0]);
        column1.push(cellsArray[1]);
        column2.push(cellsArray[2]);
        column3.push(cellsArray[3]);
      });

      columns.forEach((column) => {
        const reverseColumn = column.reverse();
        const colNumbers = reverseColumn.map((td) => {
          return Number(td.textContent);
        });

        const ifEquals = Game.ifEqualSeeEach(colNumbers)[0];
        const indexesOfRights = Game.ifEqualSeeEach(colNumbers)[1];

        if (ifEquals) {
          Game.cellsMerge(
            reverseColumn[indexesOfRights[0]],
            reverseColumn[indexesOfRights[1]],
          );

          if (indexesOfRights.length === 4) {
            Game.cellsMerge(
              reverseColumn[indexesOfRights[2]],
              reverseColumn[indexesOfRights[3]],
            );
          }
        }

        Game.cellsMove(reverseColumn);
      });

      const finishState = this.getState();

      if (!Game.are2DArraysEqual(startState, finishState)) {
        this.addRandomCell();
      }

      if (!Game.canCellsMove(this.getState())) {
        this.ifStateBlocked();
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const gameScore = document.querySelector('.game-score');

    return Number(gameScore.textContent);
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const gameFieldBody = document.querySelector('.game-field tbody');
    const rows = gameFieldBody.querySelectorAll('.field-row');
    const result = [];

    rows.forEach((row) => {
      const rowList = row.querySelectorAll('.field-cell');
      const rowArray = [...rowList];
      const rowNumbers = rowArray.map((td) => {
        return Number(td.textContent);
      });

      result.push(rowNumbers);
    });

    return result;
  }

  ifStateBlocked() {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  getDomState() {
    const gameFieldBody = document.querySelector('.game-field tbody');
    const rows = gameFieldBody.querySelectorAll('.field-row');
    const cellsDomLinear = [];

    rows.forEach((row) => {
      const rowList = row.querySelectorAll('.field-cell');

      rowList.forEach((cell) => {
        cellsDomLinear.push(cell);
      });
    });

    return cellsDomLinear;
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
    const gameField = this.getState();
    const flatField = gameField.flat();

    if (flatField.includes(2048)) {
      return 'win';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const gameHeader = document.querySelector('.game-header');
    const button = gameHeader.querySelector('.button');
    const messageStart = document.querySelector('.message-start');

    this.addRandomStartCells();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';
    messageStart.classList.add('hidden');
  }

  /**
   * Resets the game.
   */
  restart() {
    const gameField = document.querySelector('.game-field');
    const cells = gameField.querySelectorAll('.field-cell');
    const regularArray = [];

    document.querySelector('.game-score').textContent = 0;
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');

    this.initialState.forEach((row) => {
      row.forEach((elem) => {
        regularArray.push(elem);
      });
    });

    cells.forEach((cell, index) => {
      const cellClasses = Array.from(cell.classList);
      const cellClassNumber = cellClasses.find((className) => {
        return className.startsWith('field-cell--');
      });

      cell.classList.remove(cellClassNumber);

      if (regularArray[index] > 0) {
        cell.textContent = regularArray[index];
        cell.classList.add(`field-cell--${regularArray[index]}`);
      } else {
        cell.textContent = '';
      }
    });

    this.addRandomStartCells();
  }

  addRandomCell() {
    const currentState = this.getState();
    const linearState = currentState.flat();
    const linearDomState = this.getDomState();

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

      linearDomState[randomIOfNull].textContent = value;
      linearDomState[randomIOfNull].classList.add(`field-cell--${value}`);
    }
  }

  addRandomStartCells() {
    const currentState = this.getState();
    const linearState = [];
    const linearDomState = this.getDomState();

    currentState.forEach((row) => {
      row.forEach((cell) => {
        linearState.push(cell);
      });
    });

    const iOfNulls = [];

    linearState.forEach((cell, index) => {
      if (cell === 0) {
        iOfNulls.push(index);
      }
    });

    if (iOfNulls.length > 0) {
      const randomIndex1 = Math.floor(Math.random() * iOfNulls.length);
      const randomIOfNull1 = iOfNulls[randomIndex1];

      if (randomIndex1 >= 0 && randomIndex1 < iOfNulls.length) {
        iOfNulls.splice(randomIndex1, 1);
      }

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

      linearDomState[randomIOfNull1].textContent = value1;
      linearDomState[randomIOfNull1].classList.add(`field-cell--${value1}`);
      linearDomState[randomIOfNull2].textContent = value2;
      linearDomState[randomIOfNull2].classList.add(`field-cell--${value2}`);
    }
  }
}

module.exports = Game;
