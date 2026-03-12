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
    this.button = document.querySelector('.start');
    this.table = document.querySelector('.game-field');
    this.score = document.querySelector('.game-score');
    this.allRow = Array.from(this.table.rows);
    this.arrayAllCells = Array.from(document.querySelectorAll('.field-cell'));
    this.move = true;
    this.messageStart = document.querySelector('.message-start');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
    this.bestRecord = 0;
  }

  moveLeft() {
    this.move = false;

    for (const row of this.allRow) {
      const cellsRow = row.cells;
      const newArray = [];

      for (let index = cellsRow.length - 1; index >= 0; index--) {
        const element = cellsRow[index];
        const lastElement = cellsRow[index - 1];

        if (lastElement && element.textContent !== '') {
          if (lastElement.textContent === '') {
            this.move = true;
          }
        }

        if (element.textContent !== '') {
          newArray.push(element);
        }
      }

      newArray.forEach((td) => {
        row.prepend(td);
      });

      for (let i = cellsRow.length - 1; i >= 0; i--) {
        const element = cellsRow[i];
        const lastElement = cellsRow[i - 1];

        if (lastElement && element.textContent !== '') {
          if (element.textContent === lastElement.textContent) {
            const n = Number(lastElement.textContent) * 2;

            element.textContent = '';
            row.append(element);

            const classElement = element.getAttribute('class');
            const secondClassElement = classElement.split(' ')[1];
            const classLastElement = lastElement.getAttribute('class');
            const secondClassLastElement = classLastElement.split(' ')[1];

            i--;
            this.move = true;

            if (secondClassElement && secondClassLastElement) {
              element.classList.remove(secondClassElement);
              lastElement.classList.remove(secondClassLastElement);
            }
            lastElement.textContent = String(n);
            lastElement.classList.add(`field-cell--${n}`);
          }
        }
      }
    }
  }
  moveRight() {
    this.move = false;

    for (const row of this.allRow) {
      const cellsRow = row.cells;
      const newArray = [];

      for (let index = 0; index < cellsRow.length; index++) {
        const element = cellsRow[index];
        const nextElement = cellsRow[index + 1];

        if (nextElement && element.textContent !== '') {
          if (nextElement.textContent === '') {
            this.move = true;
          }
        }

        if (element.textContent !== '') {
          newArray.push(element);
        }
      }

      newArray.forEach((td) => {
        row.append(td);
      });

      for (let i = 0; i < cellsRow.length; i++) {
        const element = cellsRow[i];
        const nextElement = cellsRow[i + 1];

        if (nextElement && element.textContent !== '') {
          if (element.textContent === nextElement.textContent) {
            const n = Number(nextElement.textContent) * 2;

            element.textContent = '';
            row.prepend(element);

            const classElement = element.getAttribute('class');
            const secondClassElement = classElement.split(' ')[1];
            const classNextElement = nextElement.getAttribute('class');
            const secondClassLastElement = classNextElement.split(' ')[1];

            i++;
            this.move = true;

            if (secondClassElement && secondClassLastElement) {
              element.classList.remove(secondClassElement);
              nextElement.classList.remove(secondClassLastElement);
            }
            nextElement.textContent = String(n);
            nextElement.classList.add(`field-cell--${n}`);
          }
        }
      }
    }
  }
  moveUp() {
    this.move = false;

    for (let i = 0; i < 4; i++) {
      const columnRow = [];

      for (const row of this.allRow) {
        columnRow.push(row.cells[i]);
      }

      const newArray = [];

      columnRow.forEach((td) => {
        if (td.textContent !== '') {
          newArray.push(td.textContent);
        }
      });

      for (let n = newArray.length - 1; n >= 0; n--) {
        const element = newArray[n];
        const lastElement = newArray[n - 1];

        if (lastElement && lastElement === element) {
          newArray[n - 1] = String(Number(lastElement) * 2);
          newArray.splice(n, 1);
          this.move = true;
          n--;
        }
      }

      for (let j = 0; j < columnRow.length; j++) {
        const element = columnRow[j];
        const newElement = newArray[j];

        if (newElement && element.textContent !== newElement) {
          this.move = true;
        }

        if (newElement) {
          element.className = 'field-cell';
          element.classList.add(`field-cell--${newElement}`);
          element.textContent = newElement;
        } else {
          element.className = 'field-cell';
          element.textContent = '';
        }
      }
    }
  }
  moveDown() {
    this.move = false;

    for (let i = 0; i < 4; i++) {
      const columnRow = [];

      for (const row of this.allRow) {
        columnRow.push(row.cells[i]);
      }

      const newArray = [];

      columnRow.forEach((td) => {
        if (td.textContent !== '') {
          newArray.push(td.textContent);
        }
      });

      for (let n = 0; n < newArray.length; n++) {
        const element = newArray[n];
        const NextElement = newArray[n + 1];

        if (NextElement && NextElement === element) {
          newArray[n + 1] = String(Number(NextElement) * 2);
          newArray.splice(n, 1);
          this.move = true;
        }
      }

      let count = newArray.length - 1;

      for (let j = columnRow.length - 1; j >= 0; j--) {
        const element = columnRow[j];
        const newElement = newArray[count];

        count--;

        if (newElement && element.textContent !== newElement) {
          this.move = true;
        }

        if (newElement) {
          element.className = 'field-cell';
          element.classList.add(`field-cell--${newElement}`);
          element.textContent = newElement;
        } else {
          element.className = 'field-cell';
          element.textContent = '';
        }
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    let score = 0;

    this.arrayAllCells.forEach((td) => {
      const content = Number(td.textContent);

      score += content;
    });

    this.score.textContent = score;
    this.bestRecord = score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const state = [this.bestRecord, this.score.textContent];

    return state;
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
    const result = this.arrayAllCells.filter((td) => {
      if (td.textContent !== '') {
        return true;
      }
    });

    if (result.length === 0) {
      return 'idle';
    }

    if (result.includes('2048')) {
      return 'win';
    }

    if (result.length === 16) {
      return 'lose';
    }

    return `playing`;
  }

  /**
   * Starts the game.
   */

  start() {
    this.button.classList.remove('start');
    this.button.classList.add('restart');
    this.button.textContent = 'Restart';

    let count = 0;

    this.messageStart.classList.add('hidden');

    while (count === 0) {
      const cells = this.arrayAllCells;
      const lengthAllCells = cells.length;
      const randomIndexFirst = Math.floor(Math.random() * lengthAllCells);
      const randomIndexSecond = Math.floor(Math.random() * lengthAllCells);

      if (randomIndexFirst !== randomIndexSecond) {
        let content;

        if (Math.random() < 0.1) {
          content = 4;
        } else {
          content = 2;
        }
        cells[randomIndexFirst].textContent = `${content}`;
        cells[randomIndexFirst].classList.add(`field-cell--${content}`);
        cells[randomIndexFirst].classList.add('smoothAppearance');

        setTimeout(() => {
          cells[randomIndexFirst].classList.remove('smoothAppearance');
        }, 200);
        cells[randomIndexSecond].textContent = `${content}`;
        cells[randomIndexSecond].classList.add(`field-cell--${content}`);
        cells[randomIndexSecond].classList.add('smoothAppearance');

        setTimeout(() => {
          cells[randomIndexSecond].classList.remove('smoothAppearance');
        }, 200);
        count++;
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    if (!this.messageWin.classList.contains('hidden')) {
      this.messageWin.classList.add('hidden');
    }

    if (!this.messageLose.classList.contains('hidden')) {
      this.messageLose.classList.add('hidden');
    }

    this.arrayAllCells.forEach((td) => {
      if (td.textContent !== '') {
        const classGet = td.getAttribute('class');
        const secondClass = classGet.split(' ')[1];

        td.textContent = '';

        if (secondClass) {
          td.classList.remove(secondClass);
        }
      }
    });

    let count = 0;

    while (count === 0) {
      const cells = this.arrayAllCells;
      const lengthAllCells = cells.length;
      const randomIndexFirst = Math.round(
        0 + Math.random() * (lengthAllCells - 1),
      );
      const randomIndexSecond = Math.round(
        0 + Math.random() * (lengthAllCells - 1),
      );

      if (randomIndexFirst !== randomIndexSecond) {
        let content = 2;

        if (Math.random() < 0.1) {
          content = 4;
        } else {
          content = 2;
        }
        cells[randomIndexFirst].textContent = `${content}`;
        cells[randomIndexFirst].classList.add(`field-cell--${content}`);
        cells[randomIndexFirst].classList.add('smoothAppearance');

        setTimeout(() => {
          cells[randomIndexFirst].classList.remove('smoothAppearance');
        }, 200);
        cells[randomIndexSecond].textContent = `${content}`;
        cells[randomIndexSecond].classList.add(`field-cell--${content}`);
        cells[randomIndexSecond].classList.add('smoothAppearance');

        setTimeout(() => {
          cells[randomIndexSecond].classList.remove('smoothAppearance');
        }, 200);
        count++;
      }
    }
  }

  newElement() {
    const newArray = this.arrayAllCells.filter((td) => {
      if (td.textContent === '') {
        return true;
      }
    });

    const trueOrFalse = this.move;

    if (trueOrFalse === true) {
      let content = 2;
      const random = Math.floor(Math.random() * newArray.length);
      const element = newArray[random];

      if (element instanceof HTMLElement) {
        if (Math.random() < 0.1) {
          content = 4;
        } else {
          content = 2;
        }
        element.textContent = `${content}`;
        element.classList.add(`field-cell--${content}`);
        element.classList.add('smoothAppearance');

        setTimeout(() => {
          element.classList.remove('smoothAppearance');
        }, 200);
      }
    }
  }

  statusGame() {
    const newArray = this.arrayAllCells.filter((td) => {
      if (td.textContent === '') {
        return true;
      }

      if (td.textContent === '2048') {
        this.messageStart.classList.add('hidden');
        this.messageWin.classList.remove('hidden');
      }
    });

    if (newArray.length === 0 && youLose() === true) {
      this.messageStart.classList.add('hidden');
      this.messageLose.classList.remove('hidden');
    }

    function youLose() {
      const table = document.querySelector('.game-field');
      const allRow = Array.from(table.rows);

      for (const tr of allRow) {
        const tdArray = tr.cells;

        for (let index = 0; index < tdArray.length - 1; index++) {
          const element = tdArray[index];
          const nextElement = tdArray[index + 1];

          if (element.textContent === nextElement.textContent) {
            return false;
          }
        }
      }

      for (let i = 0; i < 4; i++) {
        const columnRow = [];

        for (const row of allRow) {
          columnRow.push(row.cells[i]);
        }

        if (
          columnRow[0].textContent === columnRow[1].textContent ||
          columnRow[1].textContent === columnRow[2].textContent ||
          columnRow[2].textContent === columnRow[3].textContent
        ) {
          return false;
        }
      }

      return true;
    }
  }
}

module.exports = Game;
