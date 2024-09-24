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
    this.messageWin = document.querySelector('.message-win');
    this.startActive = false;
    this.score = 0;
  }

  moveLeft() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const showStatus = this.getStatus();

    if (showStatus === 'playing') {
      trows.forEach((row) => {
        const objArr = [];
        const checkMerge = (startCell, endCell, content) => {
          for (let j = startCell + 1; j < endCell; j++) {
            const prevent = objArr.some(
              (obj) => obj.cellIndex === j && obj.cellContent !== content,
            );

            if (prevent) {
              return false;
            }
          }

          return true;
        };

        [...row.children].forEach((cell, i) => {
          const saveData = {};
          const value = parseInt(cell.textContent);

          if (value) {
            const exist = objArr.find(
              (obj) =>
                obj.cellContent === value &&
                checkMerge(obj.cellIndex, i, value) === true &&
                obj.mergeTry < 1,
            );

            if (exist) {
              exist.cellContent += value;
              exist.mergeTry++;
              this.score += exist.cellContent;
            } else {
              saveData.cellIndex = i;
              saveData.cellContent = value;
              saveData.mergeTry = 0;

              objArr.push(saveData);
            }

            const newTag = document.createElement('td');

            newTag.classList.add('field-cell');
            cell.replaceWith(newTag);
          }
        });

        if (objArr.length !== 0) {
          objArr.forEach((obj) => {
            for (const cell of [...row.children]) {
              if (!cell.textContent) {
                cell.textContent = obj.cellContent;
                cell.classList.add(`field-cell--${obj.cellContent}`);

                if (obj.cellContent === 2048) {
                  this.messageWin.classList.remove('hidden');

                  this.startActive = false;
                }

                break;
              }
            }
          });
        }
      });
    }
  }

  moveRight() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const showStatus = this.getStatus();

    if (showStatus === 'playing') {
      trows.forEach((row) => {
        const objArr = [];
        const checkMerge = (startCell, endCell, content) => {
          for (let j = startCell + 1; j < endCell; j++) {
            const prevent = objArr.some(
              (obj) => obj.cellIndex === j && obj.cellContent !== content,
            );

            if (prevent) {
              return false;
            }
          }

          return true;
        };

        [...row.children].reverse().forEach((cell, i) => {
          const saveData = {};
          const value = parseInt(cell.textContent);

          if (value) {
            const exist = objArr.find(
              (obj) =>
                obj.cellContent === value &&
                checkMerge(obj.cellIndex, i, value) === true &&
                obj.mergeTry < 1,
            );

            if (exist) {
              exist.cellContent += value;
              exist.mergeTry++;
              this.score += exist.cellContent;
            } else {
              saveData.cellIndex = i;
              saveData.cellContent = value;
              saveData.mergeTry = 0;

              objArr.push(saveData);
            }

            const newTag = document.createElement('td');

            newTag.classList.add('field-cell');
            cell.replaceWith(newTag);
          }
        });

        if (objArr.length !== 0) {
          objArr.forEach((obj) => {
            for (const cell of [...row.children].reverse()) {
              if (!cell.textContent) {
                cell.textContent = obj.cellContent;
                cell.classList.add(`field-cell--${obj.cellContent}`);

                if (obj.cellContent === 2048) {
                  this.messageWin.classList.remove('hidden');

                  this.startActive = false;
                }
                break;
              }
            }
          });
        }
      });
    }
  }

  moveUp() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const objArr = [];
    const checkMerge = (colIndex, startRow, endRow, content) => {
      for (let j = startRow + 1; j < endRow; j++) {
        const prevent = objArr.some(
          (obj) =>
            obj.rowIndex === j &&
            obj.cellIndex === colIndex &&
            obj.cellContent !== content,
        );

        if (prevent) {
          return false;
        }
      }

      return true;
    };
    const showStatus = this.getStatus();

    if (showStatus === 'playing') {
      trows.forEach((row, index) => {
        [...row.children].forEach((cell, i) => {
          const saveData = {};
          const value = parseInt(cell.textContent);

          if (value) {
            const exist = objArr.find(
              (obj) =>
                obj.cellIndex === i &&
                obj.cellContent === value &&
                checkMerge(i, obj.rowIndex, index, value) === true,
            );

            if (exist) {
              exist.cellContent += value;
              this.score += exist.cellContent;
            } else {
              saveData.rowIndex = index;
              saveData.cellIndex = i;
              saveData.cellContent = value;

              objArr.push(saveData);
            }

            const newTag = document.createElement('td');

            newTag.classList.add('field-cell');
            cell.replaceWith(newTag);
          }
        });
      });

      objArr.forEach((obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'cellIndex') {
            for (const row of trows) {
              const childIndex = parseInt(value) + 1;
              const rowCell = row.querySelector(`*:nth-child(${childIndex})`);

              if (!rowCell.textContent) {
                rowCell.textContent = obj.cellContent;
                rowCell.classList.add(`field-cell--${obj.cellContent}`);

                if (obj.cellContent === 2048) {
                  this.messageWin.classList.remove('hidden');

                  this.startActive = false;
                }
                break;
              }
            }
          }
        }
      });
    }
  }

  moveDown() {
    const tbody = document.querySelector('tbody');
    const trowsReversed = [...tbody.children].reverse();
    const objArr = [];
    const checkMerge = (colIndex, startRow, endRow, content) => {
      for (let j = startRow + 1; j < endRow; j++) {
        const prevent = objArr.some(
          (obj) =>
            obj.rowIndex === j &&
            obj.cellIndex === colIndex &&
            obj.cellContent !== content,
        );

        if (prevent) {
          return false;
        }
      }

      return true;
    };
    const showStatus = this.getStatus();

    if (showStatus === 'playing') {
      trowsReversed.forEach((row, index) => {
        [...row.children].forEach((cell, i) => {
          const saveData = {};
          const value = parseInt(cell.textContent);

          if (value) {
            const exist = objArr.find(
              (obj) =>
                obj.cellIndex === i &&
                obj.cellContent === value &&
                checkMerge(i, obj.rowIndex, index, value) === true,
            );

            if (exist) {
              exist.cellContent += value;
              this.score += exist.cellContent;
            } else {
              saveData.rowIndex = index;
              saveData.cellIndex = i;
              saveData.cellContent = value;

              objArr.push(saveData);
            }

            const newTag = document.createElement('td');

            newTag.classList.add('field-cell');
            cell.replaceWith(newTag);
          }
        });
      });

      objArr.forEach((obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'cellIndex') {
            for (const row of trowsReversed) {
              const childIndex = parseInt(value) + 1;
              const rowCell = row.querySelector(`*:nth-child(${childIndex})`);

              if (!rowCell.textContent) {
                rowCell.textContent = obj.cellContent;
                rowCell.classList.add(`field-cell--${obj.cellContent}`);

                if (obj.cellContent === 2048) {
                  this.messageWin.classList.remove('hidden');

                  this.startActive = false;
                }
                break;
              }
            }
          }
        }
      });
    }
  }
  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    if (!this.startActive) {
      this.score = 0;
    }

    score.textContent = this.score;

    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];

    this.initialState = trows.map((row) => {
      const rowChildren = [...row.children];
      const numbersArr = rowChildren.map((cell) => {
        let cellContent = parseInt(cell.textContent);

        if (!cellContent) {
          cellContent = 0;
        }

        return cellContent;
      });

      return numbersArr;
    });
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
    let gameStatus = '';

    if (this.startActive === false) {
      gameStatus = 'idle';
    }

    if (this.startActive === true) {
      gameStatus = 'playing';
    }

    if (!this.messageWin.classList.contains('hidden')) {
      gameStatus = 'win';
    }

    if (!this.messageLose.classList.contains('hidden')) {
      gameStatus = 'lose';
    }

    return gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.messageStart.classList.add('hidden');

    this.switchButton();

    this.startActive = true;

    this.addTiles(2);
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

    this.startActive = false;
    this.switchButton();
    this.getScore();
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

  addTiles(num) {
    const tbody = document.querySelector('tbody');
    const trows = [...tbody.children];
    const numberOfTiles = num;
    const emptyCells = [];

    trows.forEach((row) => {
      const cells = [...row.children];

      cells.forEach((cell) => {
        if (!cell.textContent) {
          emptyCells.push(cell);
        }
      });
    });

    for (let i = 0; i < numberOfTiles; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const selectedCell = emptyCells[randomIndex];

      const randomValue = this.generateTiles();

      selectedCell.textContent = randomValue;
      selectedCell.classList.add(`field-cell--${randomValue}`);

      emptyCells.splice(randomIndex, 1);
    }
  }

  hasEmptyCell() {
    for (const row of this.initialState) {
      if (row.some((cell) => cell === 0)) {
        return true;
      }
    }

    return false;
  }
}
module.exports = Game;
