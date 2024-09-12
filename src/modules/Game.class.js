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
    this.messageStart = document.querySelector('.message-start');
    this.messageLose = document.querySelector('.message-lose');
    this.startActive = false;
    this.score = 0;
    // console.log(initialState);
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const objArr = [];
    let rowStartIndex;

    if (this.startActive) {
      trows.forEach((row, index) => {
        const canMerge = (colIndex, startRow, endRow, content) => {
          for (let j = startRow + 1; j < endRow; j++) {
            const cellValue = parseInt(
              [...trows[j].children][colIndex].textContent,
            );

            if (cellValue !== '' && parseInt(cellValue) === content) {
              return false;
            }
          }

          return true;
        };

        [...row.children].forEach((cell, i) => {
          const value = parseInt(cell.textContent);

          if (value) {
            const exist = objArr.find((obj) => obj[i] === value);

            if (exist && canMerge(i, rowStartIndex, index, value)) {
              exist[i] += value;
              this.score += exist[i];
            } else {
              objArr.push({ [i]: value });

              rowStartIndex = index;
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
      this.getScore();
    }

    // score
    // check th score if 2048 win
  }

  moveDown() {}
  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.score;

    return this.score;
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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.messageStart.classList.add('hidden');

    this.switchButton();

    this.startActive = true;

    this.addTiles();
  }
  /**
   * Resets the game.
   */
  restart() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];

    this.messageStart.classList.remove('hidden');
    this.messageLose.classList.add('hidden');

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
    const numberOfTiles = 2;
    const emptyCells = [];

    trows.forEach((row) => {
      const cells = [...row.children];

      cells.forEach((cell) => {
        if (!cell.textContent) {
          emptyCells.push(cell);
        }
      });
    });

    if (emptyCells.length < numberOfTiles) {
      const messageLose = document.querySelector('.message-lose');

      messageLose.classList.remove('hidden');

      return;
    }

    for (let i = 0; i < numberOfTiles; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const selectedCell = emptyCells[randomIndex];

      const randomValue = this.generateTiles();

      selectedCell.textContent = randomValue;
      selectedCell.classList.add(`field-cell--${randomValue}`);

      emptyCells.splice(randomIndex, 1);
    }
  }
}
module.exports = Game;
