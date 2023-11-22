'use strict';

const startBtn = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLost = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
// ++++++++++++++++++++++++

class GameFild {
  constructor() {
    this.cells = document.querySelectorAll('.field-cell');
    this.scoreFild = document.querySelector('.game-score');
    this.gameFild = [];
    this.randomCell = 0;
    this.MAX = 15;
    this.MIN = 0;
    this._score = 0;
    this.FIRST_COLUMN = [0, 4, 8, 12];
    this.SECOND_COLUMN = [1, 5, 9, 13];
    this.THIRD_COLUMN = [2, 6, 10, 14];
    this.LAST_COLUMN = [3, 7, 11, 15];
  }

  init() {
    this.gameFild = [];
    this.setScore(0);

    this.cells.forEach((el, i) => {
      el.textContent = this.gameFild[i];
      el.removeAttribute('class');
      el.classList.add('field-cell');
    });

    for (let i = 0; i < 16; i++) {
      this.gameFild.push(null);
    }

    for (let i = 0; i < 2; i++) {
      this.randomCell
        = Math.floor(Math.random() * (this.MAX - this.MIN + 1)) + this.MIN;

      this.gameFild[this.randomCell] = 2;
    }

    this.renderGameFild();
  }

  canContinue() {
    let result = false;

    if (this.gameFild.includes(null)) {
      return true;
    }

    for (let i = 0; i < this.gameFild.length; i++) {
      if (this.LAST_COLUMN.includes(i)) {
        continue;
      }

      if (this.gameFild[i] === this.gameFild[i + 1]) {
        result = true;
        break;
      }
    }

    for (let i = 0; i < this.gameFild.length; i++) {
      if (this.gameFild[i] === this.gameFild[i + 4]) {
        result = true;
        break;
      }
    }

    if (!result) {
      messageLost.classList.remove('hidden');
    }

    return result;
  }

  renderGameFild() {
    this.cells.forEach((el, i) => {
      el.textContent = this.gameFild[i];
      el.removeAttribute('class');
      el.classList.add('field-cell');
      el.classList.add(`field-cell--${el.textContent}`);
    });
  }
  // add new cell with 2 or 4, if it is possible
  addNew() {
    if (!this.gameFild.includes(null)) {
      return;
    }

    let newValue = 2;
    let counter = 5; // to change new cell value from 2 to 4

    if (counter === 15) {
      counter = this.randomCell;
    }

    this.randomCell
      = Math.floor(Math.random() * (this.MAX - this.MIN + 1)) + this.MIN;

    if (this.randomCell === counter) {
      newValue = 4;
    }

    if (this.gameFild[this.randomCell] === null) {
      this.gameFild[this.randomCell] = newValue;

      setTimeout(() => {
        this.renderGameFild();
      }, 300);

      return;
    }

    this.addNew();
  }
  // addition of the nearest cell if they are equal
  sumCells(arr, method) {
    for (let i = arr.length - 1; i > 0; i--) {
      if (arr[i] === null) {
        continue;
      }

      if (arr[i] === arr[i - 1]) {
        arr[i] *= 2;
        arr.splice(i - 1, 1);
        arr[method](null);
        break;
      }
    }
  }

  moveRight() {
    // create rows [[row1], [row2], [row3], [row4]]
    this.gameFild = this.gameFild.reduce(
      (acc, item, i) => {
        if (i < 4) {
          acc[0].push(item);
        }

        if (i > 3 && i < 8) {
          acc[1].push(item);
        }

        if (i > 7 && i < 12) {
          acc[2].push(item);
        }

        if (i > 11 && i < 16) {
          acc[3].push(item);
        }

        return acc;
      },
      [[], [], [], []],
    );

    // move all filled cells to right + add equel cells
    this.gameFild = this.gameFild.map((row, inx) => {
      // move all filled cells to right
      const rowWithoutNull = row.filter((el) => el !== null);

      while (rowWithoutNull.length < 4) {
        rowWithoutNull.unshift(null);
      }

      // add equel cells
      this.sumCells(rowWithoutNull, 'unshift');

      return rowWithoutNull;
    });

    // collect gameFild for render
    this.gameFild = this.gameFild.reduce((acc, row) => {
      return [...acc, ...row];
    }, []);
  }

  moveLeft() {
    // create rows [[row1], [row2], [row3], [row4]]
    this.gameFild = this.gameFild.reduce(
      (acc, item, i) => {
        if (i < 4) {
          acc[0].push(item);
        };

        if (i > 3 && i < 8) {
          acc[1].push(item);
        };

        if (i > 7 && i < 12) {
          acc[2].push(item);
        };

        if (i > 11 && i < 16) {
          acc[3].push(item);
        };

        return acc;
      },
      [[], [], [], []],
    );

    // move all filled cells to right + add equel cells
    this.gameFild = this.gameFild.map((row, inx) => {
      // move all filled cells to right
      const rowWithoutNull = row.filter((el) => el !== null);

      while (rowWithoutNull.length < 4) {
        rowWithoutNull.push(null);
      }

      // add equel cells
      this.sumCells(rowWithoutNull, 'push');

      return rowWithoutNull;
    });

    // collect gameFild for render
    this.gameFild = this.gameFild.reduce((acc, row) => {
      return [...acc, ...row];
    }, []);
  }

  moveUp() {
    this.gameFild = this.gameFild.reduce(
      (acc, item, i) => {
        if (this.FIRST_COLUMN.includes(i)) {
          acc[0].push(item);
        }

        if (this.SECOND_COLUMN.includes(i)) {
          acc[1].push(item);
        }

        if (this.THIRD_COLUMN.includes(i)) {
          acc[2].push(item);
        }

        if (this.LAST_COLUMN.includes(i)) {
          acc[3].push(item);
        }

        return acc;
      },
      [[], [], [], []],
    );

    // move all filled cells to right + add equel cells
    this.gameFild = this.gameFild.map((row, inx) => {
      // move all filled cells to right
      const rowWithoutNull = row.filter((el) => el !== null);

      while (rowWithoutNull.length < 4) {
        rowWithoutNull.push(null);
      }

      // add equel cells
      this.sumCells(rowWithoutNull.reverse(), 'unshift');

      return rowWithoutNull;
    });

    // collect gameFild for render
    const arr = [];

    for (let n = this.gameFild.length - 1; n >= 0; n--) {
      for (let i = 0; i < this.gameFild.length; i++) {
        arr.push(this.gameFild[i][n]);
      }
    }

    this.gameFild = arr;
  }

  moveDown() {
    this.gameFild = this.gameFild.reduce(
      (acc, item, i) => {
        if (this.FIRST_COLUMN.includes(i)) {
          acc[0].push(item);
        }

        if (this.SECOND_COLUMN.includes(i)) {
          acc[1].push(item);
        }

        if (this.THIRD_COLUMN.includes(i)) {
          acc[2].push(item);
        }

        if (this.LAST_COLUMN.includes(i)) {
          acc[3].push(item);
        }

        return acc;
      },
      [[], [], [], []],
    );

    // move all filled cells to right + add equel cells
    this.gameFild = this.gameFild.map((row, inx) => {
      // move all filled cells to right
      const rowWithoutNull = row.filter((el) => el !== null);

      while (rowWithoutNull.length < 4) {
        rowWithoutNull.unshift(null);
      }

      // add equel cells
      this.sumCells(rowWithoutNull.reverse(), 'push');

      // console.log(rowWithoutNull)
      return rowWithoutNull;
    });

    // collect gameFild for render
    const arr = [];

    for (let n = this.gameFild.length - 1; n >= 0; n--) {
      for (let i = 0; i < this.gameFild.length; i++) {
        arr.push(this.gameFild[i][n]);
      }
    }

    this.gameFild = arr;
  }

  setScore(score) {
    this._score = score === 0 ? 0 : Math.max(...this.gameFild);
    this.scoreFild.textContent = this._score;

    if (this._score === 2048) {
      messageWin.classList.remove('hidden');
    }
  }
}

const game = new GameFild();

startBtn.addEventListener('click', (e) => {
  game.init();
  startBtn.textContent = 'Restart';
  startBtn.classList.add('restart');
  messageStart.classList.add('hidden');
  messageLost.classList.add('hidden');
  messageWin.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (!game.canContinue()) {
    return;
  }

  const buttons = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

  if (e.key === 'ArrowRight') {
    game.moveRight();
  };

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (buttons.includes(e.key)) {
    game.renderGameFild();
    game.setScore();
    game.addNew();
  }
});
