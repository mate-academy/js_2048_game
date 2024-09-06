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
    this.initialState = initialState;
    // console.log(initialState);
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const objArr = [];

    trows.forEach((row, index) => {
      const canMerge = (colIndex, startRow, endRow, content) => {
        for (let j = startRow + 1; j < endRow; j++) {
          const cellValue = parseInt(trows[j].children[colIndex].textContent);

          if (cellValue !== 0 && cellValue !== content) {
            return false;
          }
        }

        return true;
      };

      [...row.children].forEach((cell, i) => {
        const value = parseInt(cell.textContent);

        if (value) {
          const exist = objArr.find((obj) => obj[i] === value);

          if (
            exist &&
            canMerge(
              i,
              index,
              trows.findIndex((r) => r === row),
              value,
            )
          ) {
            exist[i] += value;
          } else {
            objArr.push({ [i]: value });
          }

          const newTag = document.createElement('td');

          newTag.classList.add('field-cell');
          cell.replaceWith(newTag);
        }
      });
    });

    objArr.forEach((obj) => {
      for (const [index, value] of Object.entries(obj)) {
        for (const row of trows) {
          const childIndex = parseInt(index) + 1;
          const rowCell = row.querySelector(`*:nth-child(${childIndex})`);

          if (!rowCell.textContent) {
            rowCell.textContent = value;
            rowCell.classList.add(`field-cell--${value}`);
            break;
          }
        }
      }
    });

    this.addTiles();
    // score
    // check if there is free space if not game over
    // check th score if 2048 win
  }

  moveDown() {}
  /**
   * @returns {number}
   */
  getScore() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    const messageStart = document.querySelector('.message-start');

    this.addTiles();

    messageStart.style.display = 'none';

    this.switchButton();
  }
  /**
   * Resets the game.
   */
  restart() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];

    trows.forEach((row) => {
      [...row.children].forEach((td) => {
        const newTag = document.createElement('td');

        newTag.classList.add('field-cell');
        td.replaceWith(newTag);
      });
    });

    this.switchButton();
  }

  // Add your own methods here

  switchButton() {
    const btn = document.querySelector('.button');
    const hasRestart = btn.classList.contains('restart');

    if (hasRestart) {
      btn.classList.replace('restart', 'start');
      btn.textContent = 'Start';
    } else {
      btn.classList.replace('start', 'restart');
      btn.textContent = 'Restart';
    }
  }

  generateTiles() {
    const set = {
      2: 0.9,
      4: 0.1,
    };

    let sum = 0;

    for (const num in set) {
      sum += set[num];
    }

    function pickRandom() {
      let pick = Math.random() * sum;

      for (const j in set) {
        pick -= set[j];

        if (pick <= 0) {
          return j;
        }
      }
    }

    return pickRandom();
  }

  addTiles() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const randomIndex = () => {
      const randomNumber = Math.floor(Math.random() * 3);

      return randomNumber;
    };
    const numberOfTiles = 2;

    for (let i = 0; i < numberOfTiles; i++) {
      const randomRow = trows[randomIndex()];
      const randomRowChildren = [...randomRow.children];
      let randomCell = randomRowChildren[randomIndex()];

      while (randomCell.textContent) {
        randomCell = randomRowChildren[randomIndex()];
      }

      const randomValue = this.generateTiles();

      randomCell.textContent = randomValue;
      randomCell.classList.add(`field-cell--${randomValue}`);
    }
  }
}
module.exports = Game;

// if (cellValue !== content || cellValue !== null)
