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
    this.isStart = true;
    this.isChanged = false;
    this.actualScore = 0;
    this.message = [];
    this.busyIndex = [];
  }

  moveLeft(rows, score) {
    this.rows = rows;
    this.isChanged = false;

    rows.forEach((row) => {
      const oldCells = [...row.children];
      const prevTextCells = oldCells.map((elem) => elem.textContent);

      const notEmptyCells = oldCells
        .map((cell) => +cell.textContent)
        .filter((value) => value > 0);

      oldCells.forEach((cell, index) => {
        const value = notEmptyCells[index] || '';

        cell.textContent = value;
        cell.className = 'field-cell';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      });

      for (let i = 0; i < oldCells.length - 1; i++) {
        const valueOne = +oldCells[i].textContent || 0;
        const valueTwo = +oldCells[i + 1].textContent || 0;

        if (valueOne > 0 && valueOne === valueTwo) {
          score.textContent = this.getScore(valueOne, valueTwo);
          this.isWinner(valueOne, valueTwo);

          oldCells[i].textContent = valueOne * 2;
          oldCells[i].classList.add(`field-cell--${valueOne * 2}`);

          oldCells[i + 1].textContent = '';
          oldCells[i + 1].className = 'field-cell';
          this.isChanged = true;
        }
      }

      oldCells.forEach((cell, i) => {
        if (cell.textContent !== prevTextCells[i]) {
          this.isChanged = true;
        }
      });
    });

    if (this.isChanged) {
      this.getRandIndex(this.rows);
    }
  }

  moveRight(rows, score) {
    this.rows = rows;
    this.isChanged = false;

    rows.forEach((row) => {
      const oldCells = [...row.children];

      const prevTextCells = oldCells.map((elem) => elem.textContent);

      const notEmptyCells = oldCells
        .map((cell) => +cell.textContent)
        .filter((value) => value > 0)
        .reverse();

      for (let i = oldCells.length - 1; i >= 0; i--) {
        const value = notEmptyCells[oldCells.length - i - 1] || '';

        oldCells[i].textContent = value;
        oldCells[i].className = 'field-cell';

        if (value > 0) {
          oldCells[i].classList.add(`field-cell--${value}`);
        }
      }

      oldCells.forEach((cell, i) => {
        if (cell.textContent !== prevTextCells[i]) {
          this.isChanged = true;
        }
      });

      for (let i = oldCells.length - 1; i > 0; i--) {
        const valueOne = +oldCells[i].textContent || 0;
        const valueTwo = +oldCells[i - 1].textContent || 0;

        if (valueOne > 0 && valueOne === valueTwo) {
          score.textContent = this.getScore(valueOne, valueTwo);
          this.isWinner(valueOne, valueTwo);

          oldCells[i].textContent = valueOne * 2;
          oldCells[i].classList.add(`field-cell--${valueOne * 2}`);

          oldCells[i - 1].textContent = '';
          oldCells[i - 1].className = 'field-cell';
          this.isChanged = true;
        }
      }
    });

    if (this.isChanged) {
      this.getRandIndex(this.rows);
    }
  }

  moveUp(rows, score) {
    this.rows = rows;
    this.isChanged = false;

    const columns = [];

    rows.forEach((row, i) => {
      const column = [];

      [...row.children].forEach((_, j) => {
        column.push(rows[j].children[i]);
      });
      columns.push(column);
    });

    const prevTextCells = columns.map(
      (col) => col.map((cell) => cell.textContent),
      // eslint-disable-next-line function-paren-newline
    );

    const notEmptyCells = columns.map(
      (col) =>
        col.map((cell) => +cell.textContent).filter((value) => value > 0),
      // eslint-disable-next-line function-paren-newline
    );

    columns.forEach((col, i) => {
      col.forEach((cell, j) => {
        const value = notEmptyCells[i][j] || '';

        cell.textContent = value;
        cell.className = 'field-cell';

        if (+value > 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      });
    });

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows.length - 1; j++) {
        const valueOne = +rows[j].children[i].textContent || 0;
        const valueTwo = +rows[j + 1].children[i].textContent || 0;

        if (valueOne > 0 && valueOne === valueTwo) {
          score.textContent = this.getScore(valueOne, valueTwo);
          this.isWinner(valueOne, valueTwo);

          rows[j].children[i].textContent = valueOne * 2;
          rows[j].children[i].classList.add(`field-cell--${valueOne * 2}`);

          rows[j + 1].children[i].textContent = '';
          rows[j + 1].children[i].className = 'field-cell';

          this.isChanged = true;
        }
      }
    }

    columns.forEach((col, i) => {
      col.forEach((cell, j) => {
        if (cell.textContent !== prevTextCells[i][j]) {
          this.isChanged = true;
        }
      });
    });

    if (this.isChanged) {
      this.getRandIndex(this.rows);
    }
  }

  moveDown(rows, score) {
    this.rows = rows;
    this.isChanged = false;

    const columns = rows.map((_, i) => rows.map((row) => row.children[i]));

    const prevTextCells = columns.map(
      (col) => col.map((cell) => cell.textContent),
      // eslint-disable-next-line function-paren-newline
    );

    const notEmptyCells = columns.map(
      (col) =>
        col.map((cell) => +cell.textContent).filter((value) => value > 0),
      // eslint-disable-next-line function-paren-newline
    );

    notEmptyCells.forEach((colValues, i) => {
      let rowIdx = rows.length - 1;

      colValues.reverse().forEach((value) => {
        const cell = rows[rowIdx].children[i];

        cell.textContent = value;
        cell.className = 'field-cell';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
        }
        rowIdx--;
      });

      while (rowIdx >= 0) {
        const cell = rows[rowIdx].children[i];

        cell.textContent = '';
        cell.className = 'field-cell';
        rowIdx--;
      }
    });

    for (let i = 0; i < rows.length; i++) {
      for (let j = rows.length - 1; j > 0; j--) {
        const valueOne = +rows[j].children[i].textContent || 0;
        const valueTwo = +rows[j - 1].children[i].textContent || 0;

        if (valueOne > 0 && valueOne === valueTwo) {
          score.textContent = this.getScore(valueOne, valueTwo);
          this.isWinner(valueOne, valueTwo);

          rows[j].children[i].textContent = valueOne * 2;
          rows[j].children[i].classList.add(`field-cell--${valueOne * 2}`);

          rows[j - 1].children[i].textContent = '';
          rows[j - 1].children[i].className = 'field-cell';
          this.isChanged = true;
        }
      }
    }

    prevTextCells.forEach((col, i) => {
      col.forEach((cell, j) => {
        if (cell !== columns[i][j].textContent) {
          this.isChanged = true;
        }
      });
    });

    if (this.isChanged) {
      this.getRandIndex(rows);
    }
  }

  /**
   * @returns {number}
   */
  getScore(valueOne, valueTwo) {
    this.actualScore += valueOne + valueTwo;

    return this.actualScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus(message) {
    const [lose, win] = this.message;

    if (message === 'lose') {
      lose.classList.remove('hidden');
    } else if (message === 'win') {
      win.classList.remove('hidden');
    }
  }

  /**
   * Starts the game.
   */
  start(cells, message) {
    this.cells = cells;
    this.message = message;

    const [, , startMessage] = message;

    if (this.isStart) {
      this.isStart = false;
      startMessage.classList.add('hidden');
      this.getTwoRandIndex(cells);
    }
  }

  // Add your own methods here
  /**
   * Resets the game.
   */
  restart(cells, score) {
    this.cells = cells;
    this.actualScore = 0;
    score.textContent = 0;

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });

    this.getTwoRandIndex(cells);
  }

  // Add your own methods here
  getRandIndex(rows) {
    this.busyIndex = [];

    const allCells = [];

    rows.forEach((row) => {
      const cells = [...row.children];

      cells.forEach((cell) => {
        allCells.push(cell);
      });

      if (allCells.length === 16) {
        allCells.map((cell) => {
          const value = +cell.textContent || 0;

          if (value > 0) {
            this.busyIndex.push(allCells.indexOf(cell));
          }
        });
      }
    });

    let randIndex = Math.floor(Math.random() * 16);
    const randValue = Math.random() < 0.9 ? 2 : 4;

    while (this.busyIndex.includes(randIndex)) {
      randIndex = Math.floor(Math.random() * 16);
    }
    this.cells[randIndex].textContent = randValue;

    this.cells[randIndex].classList.add(
      'field-cell',
      `field-cell--${randValue}`,
    );
    this.busyIndex.push(randIndex);

    if (this.busyIndex.length === 16 && !this.hasMove()) {
      this.getStatus('lose');
    }
  }

  getTwoRandIndex(cells) {
    const indexOne = Math.floor(Math.random() * 16);
    let indexTwo = Math.floor(Math.random() * 16);

    const valueOne = Math.random() < 0.9 ? 2 : 4;
    const valueTwo = Math.random() < 0.9 ? 2 : 4;

    while (indexOne === indexTwo) {
      indexTwo = Math.floor(Math.random() * 16);
    }

    cells[indexOne].classList.add(`field-cell--${valueOne}`);
    cells[indexTwo].classList.add(`field-cell--${valueTwo}`);

    cells[indexOne].textContent = valueOne;
    cells[indexTwo].textContent = valueTwo;

    return cells;
  }

  hasMove() {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].children.length; j++) {
        const currentValue = this.rows[i].children[j] || 0;

        const lowerValue =
          i + 1 < this.rows.length ? this.rows[i + 1].children[j] || 0 : 0;
        const rightValue =
          j + 1 < this.rows[i].children.length
            ? this.rows[i].children[j + 1] || 0
            : 0;

        if (
          currentValue.textContent === lowerValue.textContent ||
          currentValue.textContent === rightValue.textContent
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isWinner(valueOne, valueTwo) {
    return valueOne + valueTwo === 2048
      ? this.getStatus('win')
      : this.getStatus('playing');
  }
}

module.exports = Game;
