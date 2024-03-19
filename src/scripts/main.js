'use strict';


const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const score = document.querySelector('.game-score');
const directions = ['right', 'left', 'up', 'down'];
const game = {
  cells: document.querySelectorAll('.field-cell'),
  field: document.querySelector('tbody').children,
  score: 0,

  getRandomNumber(number) {
    return Math.floor(Math.random() * number);
  },

  generateRandomCell() {
    const luckyNumber = this.getRandomNumber(10);
    const randomRow = this.getRandomNumber(this.fieldArr.length);
    const randomCell = this.getRandomNumber(this.fieldArr.length);

    if (this.fieldArr[randomRow][randomCell] === '') {
      this.fieldArr[randomRow][randomCell] = (luckyNumber === 4)
        ? 4
        : 2;

      score.textContent = this.score;

      for (let i = 0; i < this.fieldArr.length; i++) {
        for (let j = 0; j < this.fieldArr.length; j++) {
          const arrItem = this.fieldArr[i][j];
          const cell = this.field[i].children[j];

          cell.textContent = arrItem;

          cell.className = (arrItem === '')
            ? 'field-cell'
            : `field-cell field-cell--${arrItem}`;

          if (arrItem === 2048) {
            messages[1].classList.remove('hidden');

            document.body.removeEventListener('keydown', game.start);
          }
        }
      }
    } else {
      this.generateRandomCell();
    }
  },

  move(direction) {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const fieldPart = (direction === directions[0]
        || direction === directions[1])
        ? this.fieldArr[i]
        : [
          this.fieldArr[0][i],
          this.fieldArr[1][i],
          this.fieldArr[2][i],
          this.fieldArr[3][i],
        ];

      const filteredPart = fieldPart.filter(number => number);
      const emptyStringsNumber = fieldPart.length - filteredPart.length;
      const emptyStrings = Array(emptyStringsNumber).fill('');
      const newFieldPart = (direction === directions[0]
        || direction === directions[3])
        ? emptyStrings.concat(filteredPart)
        : filteredPart.concat(emptyStrings);

      if (direction === directions[0] || direction === directions[1]) {
        this.fieldArr[i] = newFieldPart;
      }

      if (direction === directions[2] || direction === directions[3]) {
        this.fieldArr[0][i] = newFieldPart[0];
        this.fieldArr[1][i] = newFieldPart[1];
        this.fieldArr[2][i] = newFieldPart[2];
        this.fieldArr[3][i] = newFieldPart[3];
      }
    }
  },

  combineRow() {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const row = this.fieldArr[i];

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] > 0 && row[j] === row[j + 1]) {
          row[j] *= 2;

          this.score += row[j];
          row[j + 1] = '';
        }
      }
    }
  },

  combineColumn() {
    for (let i = 0; i < this.fieldArr.length - 1; i++) {
      for (let j = 0; j < this.fieldArr[i].length; j++) {
        if (+this.fieldArr[i][j] > 0
          && this.fieldArr[i][j] === this.fieldArr[i + 1][j]) {
          this.fieldArr[i][j] *= 2;

          this.score += this.fieldArr[i][j];
          this.fieldArr[i + 1][j] = '';
        }
      }
    }
  },

  canMoveRight() {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const row = this.fieldArr[i];

      for (let j = 0; j < row.length - 1; j++) {
        if ((!!row[j] && row[j] === row[j + 1]) || (!!row[j] && !row[j + 1])) {
          return true;
        }
      }
    }

    return false;
  },

  canMoveLeft() {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const row = this.fieldArr[i];

      for (let j = 1; j < row.length; j++) {
        if ((row[j] && row[j] === row[j - 1]) || (row[j] && !row[j - 1])) {
          return true;
        }
      }
    }

    return false;
  },

  canMoveUp() {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const column = [
        this.fieldArr[0][i],
        this.fieldArr[1][i],
        this.fieldArr[2][i],
        this.fieldArr[3][i],
      ];

      for (let j = 1; j < column.length; j++) {
        if ((column[j] && column[j] === column[j - 1])
          || (column[j] && !column[j - 1])) {
          return true;
        }
      }
    }

    return false;
  },

  canMoveDown() {
    for (let i = 0; i < this.fieldArr.length; i++) {
      const column = [
        this.fieldArr[0][i],
        this.fieldArr[1][i],
        this.fieldArr[2][i],
        this.fieldArr[3][i],
      ];

      for (let j = 0; j < column.length - 1; j++) {
        if ((column[j] && column[j] === column[j + 1])
          || (column[j] && !column[j + 1])) {
          return true;
        }
      }
    }

    return false;
  },

  checkForLose() {
    if (!game.canMoveDown()
      && !game.canMoveUp()
      && !game.canMoveRight()
      && !game.canMoveLeft()) {
      messages[0].classList.remove('hidden');

      document.body.removeEventListener('keydown', game.start);

      return true;
    }

    return false;
  },

  start(e) {
    switch (e.code) {
      case 'ArrowRight':
        if (game.canMoveRight()) {
          game.move(directions[0]);
          game.combineRow();
          game.move(directions[0]);
          game.generateRandomCell();
        }
        game.checkForLose();
        break;

      case 'ArrowLeft':
        if (game.canMoveLeft()) {
          game.move(directions[1]);
          game.combineRow();
          game.move(directions[1]);
          game.generateRandomCell();
        }
        game.checkForLose();
        break;

      case 'ArrowUp':
        if (game.canMoveUp()) {
          game.move(directions[2]);
          game.combineColumn();
          game.move(directions[2]);
          game.generateRandomCell();
        }
        game.checkForLose();
        break;

      case 'ArrowDown':
        if (game.canMoveDown()) {
          game.move(directions[3]);
          game.combineColumn();
          game.move(directions[3]);
          game.generateRandomCell();
        }
        game.checkForLose();
        break;
    }
  },
};

console.log(3)
button.addEventListener('click', () => {
  console.log(4)
  game.fieldArr = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  button.classList.remove('start');
  console.log(5)
  button.classList.add('restart');
  button.textContent = 'Restart';
  messages.forEach(message => message.classList.add('hidden'));
  console.log(6)
  game.score = 0;
  game.generateRandomCell();
  game.generateRandomCell();
  console.log(7)
  document.body.addEventListener('keydown', game.start);
});
