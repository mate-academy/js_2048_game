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
    this.initialState = initialState;
    this.currentState = initialState.map((el) => [...el]);
    this.tbody = document.querySelector('tbody');
    this.score = 0;
  }

  nextMovePossible() {
    return this.currentState.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        let upperCell, lowerCell;
        const rightCell = row[cellIndex + 1];
        const leftCell = row[cellIndex - 1];

        if (rowIndex < 3) {
          lowerCell = this.currentState[rowIndex + 1][cellIndex];
        }

        if (rowIndex > 0) {
          upperCell = this.currentState[rowIndex - 1][cellIndex];
        }

        const zeroValue = [lowerCell, upperCell, leftCell, rightCell].some(
          (el) => el === 0,
        );
        const sameValue = [lowerCell, upperCell, leftCell, rightCell].some(
          (el) => el === cell,
        );
        const possibleForCell = zeroValue || sameValue;

        return possibleForCell;
      });
    });
  }

  renderHTML() {
    this.currentState.forEach((row, rowIndex) => {
      const tr = this.tbody.children[rowIndex];
      const cells = [...tr.children];

      cells.forEach((cell, cellIndex) => {
        if (row[cellIndex] === 0) {
          this.clearCell(cell);
        } else {
          cell.textContent = row[cellIndex];
          cell.className = 'field-cell';
          cell.classList.add(`field-cell--${row[cellIndex]}`);
        }
      });
    });
  }

  createNewCell() {
    const fullField = this.currentState.every((row) => {
      return row.every((cell) => cell !== 0);
    });

    if (fullField) {
      return;
    }

    let rowIndex, cellIndex;

    do {
      rowIndex = Math.floor(Math.random() * 4);
      cellIndex = Math.floor(Math.random() * 4);
    } while (this.currentState[rowIndex][cellIndex] !== 0);

    this.currentState[rowIndex][cellIndex] = 2;
  }

  clearCell(cell) {
    cell.className = 'field-cell';
    cell.textContent = '';
  }

  move(direction) {
    const isVertical = direction === 'up' || direction === 'down';
    const step = direction === 'left' || direction === 'up' ? -1 : 1;
    const start = step === 1 ? 3 : 0;
    const end = (i) => (step === 1 ? i >= 0 : i < 4);

    let moveDone = false;

    for (let rowIndex = start; end(rowIndex); rowIndex -= step) {
      for (let cellIndex = start; end(cellIndex); cellIndex -= step) {
        let n = 0;
        let row = rowIndex;
        let col = cellIndex;
        let nextRow = isVertical ? rowIndex + (n + 1) * step : rowIndex;
        let nextCol = isVertical ? cellIndex : cellIndex + (n + 1) * step;

        let currentCell = this.currentState[row][col];
        let nextCell;

        if (currentCell === 0) {
          continue;
        }

        if (nextRow >= 0 && nextRow < 4) {
          nextCell = this.currentState[nextRow][nextCol];
        }

        while (nextCell === 0 || nextCell === currentCell) {
          moveDone = true;

          if (nextCell === 0) {
            this.currentState[nextRow][nextCol] = currentCell;
            this.currentState[row][col] = 0;

            n++;

            row = isVertical ? rowIndex + n * step : rowIndex;
            col = isVertical ? cellIndex : cellIndex + n * step;
            nextRow = isVertical ? rowIndex + (n + 1) * step : rowIndex;
            nextCol = isVertical ? cellIndex : cellIndex + (n + 1) * step;

            if (nextRow >= 0 && nextRow < 4 && nextCol >= 0 && nextCol < 4) {
              currentCell = this.currentState[row][col];
              nextCell = this.currentState[nextRow][nextCol];
            } else {
              break;
            }
          } else {
            this.currentState[nextRow][nextCol] = currentCell * 2;
            this.currentState[row][col] = 0;
            this.score += currentCell * 2;
            this.getScore();
            break;
          }
        }
      }
    }

    if (moveDone) {
      this.createNewCell();
      this.renderHTML();
      this.getStatus();
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    const scoreField = document.querySelector('.game-score');

    scoreField.textContent = this.score;

    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.currentState;
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
    const emptyField = this.currentState.every((row) => {
      return row.every((cell) => cell === 0);
    });

    if (emptyField) {
      return 'idle';
    }

    const is2048 = this.currentState.some((row) => {
      return row.some((cell) => cell === 2048);
    });

    if (is2048) {
      document.querySelector('.message-win').classList.remove('hidden');

      return 'win';
    }

    if (!this.nextMovePossible()) {
      document.querySelector('.message-lose').classList.remove('hidden');

      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.createNewCell();
    this.createNewCell();
    this.renderHTML();
    document.querySelector('.message-start').classList.add('hidden');
  }

  /**
   * Resets the game.
   */
  restart() {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    this.currentState = this.initialState.map((el) => [...el]);
    this.score = 0;
    this.getScore();
    this.createNewCell();
    this.createNewCell();
    this.renderHTML();
  }
}

module.exports = Game;
