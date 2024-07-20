'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const tbody = document.querySelector('tbody');
const fieldRow = document.querySelector('.field-row');

class Game {
  constructor({ x: sizeX, y: sizeY }, controlButtons) {
    this.size = {
      x: sizeX,
      y: sizeY,
    };
    this.controlBtns = controlButtons;
    this.grid = new Array(this.size.y);

    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(this.size.x).fill(0);
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlers = [];
    this.score = 0;
  }

  addRandomCell(amount = 1) {
    for (let i = 0; i < amount; i++) {
      const yAble = this.grid
        .map((item, index) => (item.includes(0) ? index : undefined))
        .filter(index => index !== undefined);
      // includes array with indexes of rows that have `0`,
      // otherwise undefined

      if (yAble.length === 0) {
        return;
      }
      // check undefined

      const selectRow = yAble[getRandomInteger(0, yAble.length - 1)];
      const xAble = this.grid[selectRow]
        .map((item, index) => (!item ? index : undefined))
        .filter(index => index !== undefined);
      // includes array with indexes of columns
      // in the specific row that have `0`,
      // otherwise undefined

      if (xAble.length === 0) {
        return;
      }
      // check undefined

      const selectColumn = xAble[getRandomInteger(0, xAble.length - 1)];

      if (getRandomInteger(1, 10) === 10) {
        this.grid[selectRow][selectColumn] += 4;
      } else {
        this.grid[selectRow][selectColumn] += 2;
      }
      // add appear random 4 by 10%, otherwise 2
    }
  }

  removeCell(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      this.grid = new Array(this.size.y).fill(0).map(() => {
        return new Array(this.size.x).fill(0);
      });
    } else {
      this.grid[y][x] = 0;
    }

    this.render();
  }

  render() {
    this.grid.forEach((row, rowIndex) => {
      const rowElement = document
        .querySelector(`tbody .field-row:nth-child(${rowIndex + 1})`);

      this.grid[rowIndex].forEach((column, columnIndex) => {
        const columnElement = rowElement
          .querySelector(`.field-cell:nth-child(${columnIndex + 1})`);

        columnElement.classList.value = `field-cell field-cell--${column}`;

        if (column) {
          columnElement.textContent = column;
        } else {
          columnElement.textContent = '';
        }

        this.checkWin(column);
        this.checkLose();
      });
    });
  }

  renderScore(num = 0) {
    this.score += num;

    const gameScore = document.querySelector('.game-score');

    gameScore.textContent = this.score;
  }

  combineAdjacentDuplicates(array, isMove = false) {
    const nums = filterZero(array);
    let totalScore = 0;

    for (let i = 0; i < nums.length - 1; i++) {
      const firstNum = nums[i];
      const secondNum = nums[i + 1];

      if (firstNum === secondNum) {
        nums[i] += secondNum;
        nums[i + 1] = 0;
        totalScore += nums[i];
      }
    }

    if (isMove) {
      this.renderScore(totalScore);
    }

    return filterZero(nums);
  }

  checkWin(item) {
    if (item >= 2048) {
      const messageWin = document.querySelector('.message-win');

      messageWin.classList.remove('hidden');
      this.removeAllEventListeners();
    }
  }

  checkLose() {
    const messageLose = document.querySelector('.message-lose');
    let lose = this.size.x + this.size.y;

    this.grid.forEach(row => {
      if (JSON.stringify(this.combineAdjacentDuplicates(row)).length
        === JSON.stringify(row).length) {
        lose -= 1;
      }
    });

    for (let i = 0; i < this.size.x; i++) {
      const array = [];

      this.grid.forEach(row => {
        array.push(row[i]);
      });

      const resultArray = this.combineAdjacentDuplicates(array);

      if (JSON.stringify(resultArray).length
        === JSON.stringify(array).length) {
        lose -= 1;
      }
    }

    if (lose <= 0) {
      this.removeAllEventListeners();

      messageLose.classList.remove('hidden');
    }
  }

  removeAllEventListeners() {
    for (const { eventHandler, handler } of this.handlers) {
      document.removeEventListener(eventHandler, handler);
    }

    this.handlers = [];
  }

  setupRestartButton(buttonElement) {
    buttonElement.addEventListener('click', () => {
      this.restartGame();
    });
  }

  setupControlButtons(buttons) {
    for (const group of buttons) {
      const handler = (e) => this.handleKeyPress(e, group);

      document.addEventListener('keydown', handler);

      this.handlers.push({
        eventHandler: 'keydown', handler,
      });
    }
  }

  handleKeyPress(e, group) {
    const [left, up, right, down] = group;

    switch (e.key) {
      case left:
        this.moveLeft();
        break;

      case up:
        this.moveUp();
        break;

      case right:
        this.moveRight();
        break;

      case down:
        this.moveDown();
        break;
    }
  };

  moveLeft() {
    const check = deepCopy(this.grid);

    this.grid.forEach((row, rowIndex) => {
      const resultArray = this.combineAdjacentDuplicates(row, true);

      this.grid[rowIndex].unshift(...resultArray);
      this.grid[rowIndex].length = this.size.x;
      this.grid[rowIndex].fill(0, resultArray.length);
    });

    if (JSON.stringify(check) !== JSON.stringify(this.grid)) {
      this.addRandomCell(1);
    }
    this.render();
  }

  moveUp() {
    const check = deepCopy(this.grid);

    for (let i = 0; i < this.size.x; i++) {
      const array = [];

      this.grid.forEach(row => {
        array.push(row[i]);
      });

      const resultArray = this.combineAdjacentDuplicates(array, true);

      if (resultArray.length !== this.size.y) {
        const resultArrayLength = resultArray.length;

        resultArray.length = this.size.y;

        resultArray.fill(0, resultArrayLength);
      }

      this.grid.forEach((row, index) => {
        this.grid[index][i] = resultArray[index];
      });
    }

    if (JSON.stringify(check) !== JSON.stringify(this.grid)) {
      this.addRandomCell(1);
    }
    this.render();
  }

  moveRight() {
    const check = deepCopy(this.grid);

    this.grid.forEach((row, rowIndex) => {
      const resultArray = this.combineAdjacentDuplicates(row.slice()
        .reverse(), true);

      this.grid[rowIndex].unshift(...resultArray);
      this.grid[rowIndex].length = this.size.x;
      this.grid[rowIndex].fill(0, resultArray.length);

      if (JSON.stringify(row) !== JSON.stringify(resultArray.reverse())) {
        this.grid[rowIndex].reverse();
      };
    });

    if (JSON.stringify(check) !== JSON.stringify(this.grid)) {
      this.addRandomCell(1);
    }
    this.render();
  }

  moveDown() {
    const check = deepCopy(this.grid);

    for (let i = 0; i < this.size.x; i++) {
      const array = [];

      this.grid.forEach(row => {
        array.push(row[i]);
      });

      const resultArray = this.combineAdjacentDuplicates(array
        .slice().reverse(), true).reverse();

      if (resultArray.length !== this.size.y) {
        const lengthToAdd = this.size.y - resultArray.length;

        resultArray.unshift(...new Array(lengthToAdd).fill(0));

        this.grid.forEach((row, index) => {
          this.grid[index][i] = resultArray[index];
        });
      }
    }

    if (JSON.stringify(check) !== JSON.stringify(this.grid)) {
      this.addRandomCell(1);
    }
    this.render();
  }

  restartGame() {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    messages.forEach(message => {
      if (!message.classList.contains('hidden')) {
        message.classList.add('hidden');
      }
    });

    this.removeCell();
    this.addRandomCell(2);
    this.render();
    this.removeAllEventListeners();
    this.setupControlButtons(this.controlBtns);
    this.score = 0;
    this.renderScore();
  }

  gridState() {
    window.console.log(this.grid);
  }
}

const btns = [['a', 'w', 'd', 's'],
  ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']];

const game = new Game(
  {
    x: fieldRow.childElementCount,
    y: tbody.childElementCount,
  },
  btns,
);

game.setupRestartButton(button);

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function filterZero(array) {
  return array.filter(item => item !== 0);
}

function deepCopy(array) {
  return array.map(row => [...row]);
}
