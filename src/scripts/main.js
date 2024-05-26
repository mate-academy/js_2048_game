'use strict';

class Game {
  constructor(initialState = null) {
    this.rows = 4;
    this.columns = 4;
    this.score = 0;
    this.status = 'playing';

    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initializeGame();
  }

  initializeGame() {
    if (!this.findZero()) {
      this.setRandomNum();
      this.setRandomNum();
    }
    this.updateView();
  }

  getState() {
    return this.field;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    this.slide('left');
  }

  moveRight() {
    this.slide('right');
  }

  moveUp() {
    this.slide('up');
  }

  moveDown() {
    this.slide('down');
  }

  start() {
    this.status = 'playing';
    this.restart();
  }

  restart() {
    this.score = 0;
    this.status = 'playing';

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.setRandomNum();
    this.setRandomNum();
    this.updateView();
  }

  updateView() {
    gameScore.textContent = this.score;

    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        const value = this.field[x][y];
        const cell = document.getElementById(`${x}_${y}`);

        cell.textContent = '';
        cell.classList.value = 'field-cell';

        if (value !== 0) {
          cell.textContent = `${value}`;
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }

    if (this.status === 'won') {
      winMessage.classList.remove('hidden');
    } else if (this.status === 'lost') {
      loseMessage.classList.remove('hidden');
    } else {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }
  }

  findZero() {
    for (let x = 0; x < this.rows; x++) {
      if (this.field[x].includes(0)) {
        return true;
      }
    }

    return false;
  }

  setRandomNum() {
    if (this.findZero()) {
      while (true) {
        const x = Math.floor(Math.random() * this.rows);
        const y = Math.floor(Math.random() * this.columns);

        if (this.field[x][y] === 0) {
          const randomNum = Math.random() < 0.9 ? 2 : 4;

          this.field[x][y] = randomNum;
          break;
        }
      }
    }
  }

  slide(direction) {
    const startField = this.field.map((row) => [...row]);

    switch (direction) {
      case 'left':
        for (let x = 0; x < this.rows; x++) {
          const row = this.field[x];

          this.field[x] = this.slideRow(row);
        }
        break;
      case 'right':
        for (let x = 0; x < this.rows; x++) {
          let row = this.field[x].slice().reverse();

          row = this.slideRow(row).reverse();
          this.field[x] = row;
        }
        break;
      case 'up':
        for (let y = 0; y < this.columns; y++) {
          let column = [
            this.field[0][y],
            this.field[1][y],
            this.field[2][y],
            this.field[3][y],
          ];

          column = this.slideRow(column);

          for (let x = 0; x < this.rows; x++) {
            this.field[x][y] = column[x];
          }
        }
        break;
      case 'down':
        for (let y = 0; y < this.columns; y++) {
          let column = [
            this.field[0][y],
            this.field[1][y],
            this.field[2][y],
            this.field[3][y],
          ].reverse();

          column = this.slideRow(column).reverse();

          for (let x = 0; x < this.rows; x++) {
            this.field[x][y] = column[x];
          }
        }
        break;
    }

    if (!this.identicalFields(startField, this.field)) {
      this.setRandomNum();
      this.updateView();
    }

    if (!this.canMove()) {
      this.status = 'lost';
      this.updateView();
    }
  }

  slideRow(row) {
    let filteredRow = row.filter((num) => num !== 0);

    for (let x = 0; x < filteredRow.length - 1; x++) {
      if (filteredRow[x] === filteredRow[x + 1]) {
        filteredRow[x] *= 2;
        filteredRow[x + 1] = 0;
        this.score += filteredRow[x];
      }
    }

    filteredRow = filteredRow.filter((num) => num !== 0);

    while (filteredRow.length < this.columns) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  canMove() {
    if (this.findZero()) {
      return true;
    }

    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        if (
          this.field[x][y] === this.field[x][y + 1] ||
          this.field[x][y] === this.field[x + 1]?.[y]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  identicalFields(startField, finishField) {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        if (startField[x][y] !== finishField[x][y]) {
          return false;
        }
      }
    }

    return true;
  }
}

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

const game = new Game();

button.addEventListener('click', () => {
  game.start();
  button.blur();
  button.classList.add('restart');
  button.classList.remove('start');
  button.textContent = 'Restart';
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  if (e.code === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.code === 'ArrowRight') {
    game.moveRight();
  }

  if (e.code === 'ArrowUp') {
    game.moveUp();
  }

  if (e.code === 'ArrowDown') {
    game.moveDown();
  }

  gameScore.textContent = `${game.getScore()}`;
});
