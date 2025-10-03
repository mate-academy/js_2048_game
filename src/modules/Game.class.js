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
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;

    this.loseMessage = document.querySelector(
      '.container .message-container .message-lose',
    );

    this.startMessage = document.querySelector(
      '.container .message-container .message-start',
    );

    this.winMessage = document.querySelector(
      '.container .message-container .message-win',
    );

    if (initialState) {
      this.state = initialState;
    }
  }

  moveLeft(mode) {
    let changes = false;

    for (let indexOfRow = 0; indexOfRow < this.state.length; indexOfRow++) {
      const res = this.sortRow(this.state[indexOfRow], mode);

      changes = changes ? true : res[1];

      if (mode === 1) {
        this.state[indexOfRow] = [...res[0]];
      }
    }

    if (changes && mode === 1) {
      this.getFreeCellwithRandomValue();
      this.changeCell();
    }

    if (mode === 1) {
      this.updateInfo();
    }

    return changes;
  }

  moveRight(mode) {
    let changes = false;

    for (let indexOfRow = 0; indexOfRow < this.state.length; indexOfRow++) {
      const res = this.sortRow([...this.state[indexOfRow]].reverse(), mode);

      if (mode === 1) {
        this.state[indexOfRow] = [...res[0].reverse()];
      }
      changes = changes ? true : res[1];
    }

    if (changes && mode === 1) {
      this.getFreeCellwithRandomValue();
      this.changeCell();
    }

    if (mode === 1) {
      this.updateInfo();
    }

    return changes;
  }

  moveUp(mode) {
    let changes = false;

    for (let indexOfElem = 0; indexOfElem < this.state.length; indexOfElem++) {
      const arrToSort = [];

      for (let indexOfRow = 0; indexOfRow < this.state.length; indexOfRow++) {
        arrToSort.push(this.state[indexOfRow][indexOfElem]);
      }

      const res = this.sortRow(arrToSort, mode);

      changes = changes ? true : res[1];

      if (changes && mode === 1) {
        res[0].forEach((num, indexOfRow) => {
          this.state[indexOfRow][indexOfElem] = num;
        });
      }
    }

    if (changes && mode === 1) {
      this.getFreeCellwithRandomValue();
      this.changeCell();
    }

    if (mode === 1) {
      this.updateInfo();
    }

    return changes;
  }

  moveDown(mode) {
    let changes = false;
    let res;

    for (let indexOfElem = 0; indexOfElem < this.state.length; indexOfElem++) {
      const arrToSort = [];

      for (let indexOfRow = 0; indexOfRow < this.state.length; indexOfRow++) {
        arrToSort.unshift(this.state[indexOfRow][indexOfElem]);
      }

      res = this.sortRow(arrToSort, mode);

      changes = changes ? true : res[1];

      if (mode === 1) {
        res[0].reverse().forEach((num, indexOfRow) => {
          this.state[indexOfRow][indexOfElem] = num;
        });
      }
    }

    if (changes && mode === 1) {
      this.getFreeCellwithRandomValue();
      this.changeCell();
    }

    if (mode === 1) {
      this.updateInfo();
    }

    return changes;
  }

  /**
   * @returns {number}
   */
  getScore() {
    const gameScore = document.querySelector('.controls p.info .game-score');

    gameScore.textContent = this.score;

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
    if (
      this.state.some((row) => {
        if (
          row.some((num) => {
            if (num === 2048) {
              return true;
            }

            return false;
          })
        ) {
          return true;
        }

        return false;
      })
    ) {
      return 'win';
    } else if (
      this.state.every((row) => {
        if (row.every((num) => num === 0)) {
          return true;
        }

        return false;
      })
    ) {
      return 'idle';
    } else {
      const results = [
        this.moveLeft(0),
        this.moveRight(0),
        this.moveUp(0),
        this.moveDown(0),
      ];

      if (
        results.some((res) => {
          if (res === true) {
            return true;
          }

          return false;
        })
      ) {
        return 'playing';
      }

      return 'lose';
    }
  }
  /**
   * Starts the game.
   */
  start() {
    this.startMessage.classList.add('hidden');

    const button = document.querySelector('.controls .button');

    if (button.classList.contains('start')) {
      button.classList.remove('start');
    }

    button.classList.add('restart');
    button.textContent = 'Restart';

    const firstValue = this.getFreeCellwithRandomValue();

    if (firstValue === 2) {
      this.getFreeCellwithRandomValue();
    } else {
      this.getFreeCellwithRandomValue(2);
    }

    this.changeCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.startMessage.classList.remove('hidden');

    if (!this.loseMessage.classList.contains('hidden')) {
      this.loseMessage.classList.add('hidden');
    }

    if (!this.winMessage.classList.contains('hidden')) {
      this.winMessage.classList.add('hidden');
    }

    const button = document.querySelector('.controls .button');

    if (button.classList.contains('restart')) {
      button.classList.remove('restart');
    }

    button.classList.add('start');
    button.textContent = 'Start';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.getScore();
    this.changeCell();
  }

  // Add your own methods here
  getFreeCellwithRandomValue(value) {
    const freeCells = [];
    let randomValue;

    if (value) {
      randomValue = value;
    } else {
      randomValue = Math.random() > 0.1 ? 2 : 4;
    }

    for (let idxOfRow = 0; idxOfRow < this.state.length; idxOfRow++) {
      const row = this.state[idxOfRow];

      for (let idxOfCell = 0; idxOfCell < row.length; idxOfCell++) {
        if (row[idxOfCell] === 0) {
          freeCells.push([idxOfRow, idxOfCell]);
        }
      }
    }

    const randomIndex = Math.round(Math.random() * (freeCells.length - 1));
    const randomElem = freeCells[randomIndex];

    this.state[randomElem[0]][randomElem[1]] = randomValue;

    return randomValue;
  }

  changeCell() {
    for (let indexOfRow = 0; indexOfRow < this.state.length; indexOfRow++) {
      const tr = document.querySelectorAll('tbody .field-row')[indexOfRow];

      for (
        let indexOfElem = 0;
        tr.children.length > indexOfElem;
        indexOfElem++
      ) {
        const td = tr.children[indexOfElem];
        const value = this.state[indexOfRow][indexOfElem];
        const regExp = /field-cell--(\d+)/;

        for (const cls of [...td.classList]) {
          if (cls.match(regExp)) {
            td.classList.remove(cls);
          }
        }

        if (value === 0) {
          td.textContent = '';
          td.setAttribute('class', 'field-cell');
        } else {
          td.textContent = value;
          td.classList.add(`field-cell--${value}`);
        }
      }
    }
  }

  sortRow(row, mode) {
    let changes = false;

    if (
      row.every((num) => {
        if (num === 0) {
          return true;
        }

        return false;
      })
    ) {
      return [row, changes];
    }

    const arr = row.filter((num) => {
      if (num === 0) {
        return false;
      }

      return true;
    });

    for (let indexOfElem = 0; indexOfElem < arr.length - 1; indexOfElem++) {
      const firstNum = arr[indexOfElem];
      const secondNum = arr[indexOfElem + 1];

      if (firstNum === secondNum && firstNum !== 0) {
        arr[indexOfElem] = firstNum + secondNum;
        arr[indexOfElem + 1] = 0;

        if (mode) {
          this.score += firstNum + secondNum;
        }

        changes = true;
      } else if (firstNum === 0 && secondNum !== 0) {
        arr[indexOfElem] = secondNum;
        arr[indexOfElem + 1] = 0;
        changes = true;
      }
    }

    while (arr.length < 4) {
      arr.push(0);
    }

    for (let indexOfElem = 0; indexOfElem < arr.length; indexOfElem++) {
      if (row[indexOfElem] !== arr[indexOfElem]) {
        changes = true;
      }
    }

    return [arr, changes];
  }

  updateInfo() {
    const sts = this.getStatus();

    this.getScore();

    if (sts === 'lose') {
      this.loseMessage.classList.remove('hidden');
    } else if (sts === 'win') {
      this.winMessage.classList.remove('hidden');
    }
  }
}

module.exports = Game;
