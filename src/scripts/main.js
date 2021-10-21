'use strict';

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const directions = ['right', 'left', 'up', 'down'];
const game = {
  rows: document.querySelectorAll('.field-row'),
  cells: document.querySelectorAll('.field-cell'),
  score: document.querySelector('.game-score'),

  get columns() {
    const columns = [];

    for (let i = 0; i < this.rows.length; i++) {
      const column = [
        this.rows[0].children[i],
        this.rows[1].children[i],
        this.rows[2].children[i],
        this.rows[3].children[i],
      ];

      columns.push(column);
    }

    return columns;
  },
  get rowsValuesArr() {
    const rowsValues = [];

    for (const row of this.rows) {
      const rowValues = [];

      for (const cell of row.children) {
        rowValues.push(cell.textContent);
      }

      rowsValues.push(rowValues);
    }

    return rowsValues;
  },
  get columnsValuesArr() {
    const columnsValues = [];

    for (const column of this.columns) {
      const columnValues = [];

      for (const cell of column) {
        columnValues.push(cell.textContent);
      }

      columnsValues.push(columnValues);
    }

    return columnsValues;
  },

  getRandomNumber(number) {
    return Math.floor(Math.random() * number);
  },

  generateRandomCell() {
    const luckyNumber = this.getRandomNumber(10);
    const randomIndex = this.getRandomNumber(this.cells.length);
    const randomCell = this.cells[randomIndex];

    if (randomCell.textContent === '') {
      randomCell.textContent = (luckyNumber === 4)
        ? 4
        : 2;

      randomCell.classList.add(`field-cell--${randomCell.textContent}`);
    } else {
      this.generateRandomCell();
    }
  },

  move(direction) {
    const valuesArr = (direction === directions[0]
      || direction === directions[1])
      ? this.rowsValuesArr
      : this.columnsValuesArr;
    const fieldParts = (direction === directions[0]
      || direction === directions[1])
      ? this.rows
      : this.columns;

    for (let i = 0; i < valuesArr.length; i++) {
      const fieldPart = (direction === directions[0]
        || direction === directions[1])
        ? fieldParts[i].children
        : fieldParts[i];
      const fieldPartValues = valuesArr[i];
      const filteredPart = fieldPartValues.filter(number => number);
      const emptyStringsNumber = fieldPartValues.length - filteredPart.length;
      const emptyStrings = Array(emptyStringsNumber).fill('');
      const newFieldPart = (direction === directions[0]
        || direction === directions[3])
        ? emptyStrings.concat(filteredPart)
        : filteredPart.concat(emptyStrings);

      for (let j = 0; j < fieldPartValues.length; j++) {
        fieldPart[j].textContent = newFieldPart[j];

        fieldPart[j].className = (fieldPart[j].textContent !== '')
          ? `field-cell field-cell--${+fieldPart[j].textContent}`
          : 'field-cell';

        if (fieldPart[j].textContent === '2048') {
          messages[1].classList.remove('hidden');

          document.body.removeEventListener('keydown', game.start);
        }
      }
    }
  },

  combineRow() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i].children;

      for (let j = 0; j < row.length - 1; j++) {
        if (+row[j].textContent > 0
          && +row[j].textContent === +row[j + 1].textContent) {
          row[j].textContent *= 2;

          this.score.textContent = +this.score.textContent
            + +row[j].textContent;
          row[j].className = `field-cell field-cell--${+row[j].textContent}`;
          row[j + 1].textContent = '';
          row[j + 1].className = 'field-cell';
        }
      }
    }
  },

  combineColumn() {
    for (let i = 0; i < this.rows.length - 1; i++) {
      for (let j = 0; j < this.rows[i].children.length; j++) {
        if (+this.rows[i].children[j].textContent > 0
          && this.rows[i].children[j].textContent
          === this.rows[i + 1].children[j].textContent) {
          this.rows[i].children[j].textContent *= 2;

          this.score.textContent = +this.score.textContent
            + +this.rows[i].children[j].textContent;

          this.rows[i].children[j].className = `
            field-cell field-cell--${+this.rows[i].children[j].textContent}
          `;
          this.rows[i + 1].children[j].textContent = '';
          this.rows[i + 1].children[j].className = 'field-cell';
        }
      }
    }
  },

  canMoveRight() {
    for (let i = 0; i < this.rowsValuesArr.length; i++) {
      const row = this.rowsValuesArr[i];

      for (let j = 0; j < row.length - 1; j++) {
        if ((row[j] && row[j] === row[j + 1]) || (row[j] && !row[j + 1])) {
          return true;
        }
      }
    }

    return false;
  },

  canMoveLeft() {
    for (let i = 0; i < this.rowsValuesArr.length; i++) {
      const row = this.rowsValuesArr[i];

      for (let j = 1; j < row.length; j++) {
        if ((row[j] && row[j] === row[j - 1]) || (row[j] && !row[j - 1])) {
          return true;
        }
      }
    }

    return false;
  },

  canMoveUp() {
    for (let i = 0; i < this.columnsValuesArr.length; i++) {
      const column = this.columnsValuesArr[i];

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
    for (let i = 0; i < this.columnsValuesArr.length; i++) {
      const column = this.columnsValuesArr[i];

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

button.addEventListener('click', () => {
  for (const cell of game.cells) {
    cell.textContent = '';
    cell.className = 'field-cell';
  }
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messages.forEach(message => message.classList.add('hidden'));
  game.score.textContent = '0';
  game.generateRandomCell();
  game.generateRandomCell();

  document.body.addEventListener('keydown', game.start);
});
