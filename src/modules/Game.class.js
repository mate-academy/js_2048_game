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
}

module.exports = Game;
