'use strict';

// <---------- getting elements ----------> \\
const container = document.querySelector('.container');
const gameField = container.querySelector('.game-field');
const header = container.querySelector('.controls');
const startButton = header.querySelector('.start');
const startMessage = container.querySelector('.message-start');
const loseMessage = container.querySelector('.message-lose');
const winMessage = container.querySelector('.message-win');
const score = header.querySelector('.game-score');

class Game {
  constructor() {
    this.size = 4;
    this.field = [[], [], [], []];
  }

  // <---------- creating a field for the game ----------> \\
  createMatrix() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < 4; j++) {
        this.field[i][j] = 0;
      }
    }
  }

  // <---------- render of the field for the game ----------> \\
  renderField() {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const fieldCell = gameField.rows[row].cells[column];

        fieldCell.classList = ['field-cell'];

        if (this.field[row][column] > 0) {
          fieldCell.classList.add(`field-cell--${this.field[row][column]}`);
          fieldCell.textContent = `${this.field[row][column]}`;
        } else {
          fieldCell.textContent = '';
        }

        if (this.field[row][column] === 2048) {
          winMessage.classList.remove('hidden');
        }
      }
    }
  }

  // <---------- getting empty cells to work with ----------> \\
  get emptyCell() {
    const empty = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.field[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    return empty;
  }

  // <---------- generate random number for a random free cell ----------> \\
  generateRandomNumber() {
    const freeCells = this.emptyCell;
    const emptyCount = freeCells.length;

    const [row, column] = freeCells[Math.floor(Math.random() * emptyCount)];

    this.field[row][column] = Math.random() <= 0.1 ? 4 : 2;
  }

  // <---------- add an event to the start button ----------> \\
  startEvents() {
    startButton.addEventListener('click', () => {
      startMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      winMessage.classList.add('hidden');

      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
      score.textContent = 0;

      this.createMatrix(this.size);
      this.generateRandomNumber();
      this.generateRandomNumber();
      this.renderField();
    });
  }

  // <---------- creating an event for the arrow keys ----------> \\
  moveEvents() {
    window.addEventListener('keydown', (e) => {
      e.preventDefault();

      switch (e.key) {
        case 'ArrowUp':
          this.makeMove(0, 0);
          break;
        case 'ArrowLeft':
          this.makeMove(90, -90);
          break;
        case 'ArrowDown':
          this.makeMove(180, -180);
          break;
        case 'ArrowRight':
          this.makeMove(270, -270);
          break;
      }
    });
  }

  // <---------- game initialization ----------> \\
  initGame() {
    this.startEvents();
    this.moveEvents();
  }

  // <-------- method for performing a movement in four directions --------> \\
  makeMove(rotate, back) {
    const prev = this.field.map(row => row.concat());

    this.rotateMatrix(rotate);
    this.moveCell();
    this.mergeSameCell();
    this.rotateMatrix(back);
    this.renderField();

    // <---------- if there are changes add a random number ----------> \\
    if (this.hasChanges(prev, this.field)) {
      this.generateRandomNumber();
      this.renderField();
    }

    // <------- if there are no moves, show a message about the loss -------> \\
    if (!this.canMove(0, 0) && !this.canMove(90, -90)
    && !this.canMove(180, -180) && !this.canMove(270, -270)) {
      loseMessage.classList.remove('hidden');
    }
  }

  // <---------- check if there were any changes ----------> \\
  hasChanges(prev, curr) {
    if (prev.join() !== curr.join()) {
      return true;
    }

    return false;
  }

  // <---------- rotate the matrix in the desired direction ----------> \\
  rotateMatrix(degree) {
    switch (degree) {
      case 90:
      case -270:
        this.field = this.field.map((_, rowIndex) =>
          this.field.map((row) => row[rowIndex]).reverse()
        );
        break;
      case 180:
      case -180:
        this.field = this.field.map((row) => row.reverse()).reverse();
        break;
      case 270:
      case -90:
        this.field = this.field.map((_, rowIndex) =>
          this.field.map((row) => [...row].reverse()[rowIndex])
        );
        break;
      case 0:
        return this.field;
    }
  }

  // <---------- method for merge cell ----------> \\
  mergeSameCell() {
    for (let row = 1; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.field[row - 1][column] === this.field[row][column]
          && this.field[row][column] > 0) {
          this.field[row - 1][column] += this.field[row][column];
          this.field[row][column] = 0;

          score.textContent = +score.textContent + this.field[row - 1][column];
        }
      }
    }
    this.moveCell();
  }

  // <---------- method for making movement ----------> \\
  moveCell() {
    let hasMoved = false;

    for (let row = 1; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.field[row - 1][column] === 0
          && this.field[row][column] > 0) {
          this.field[row - 1][column] = this.field[row][column];
          this.field[row][column] = 0;

          hasMoved = true;
        }
      }
    }

    if (hasMoved) {
      return this.moveCell();
    }
  }

  // <---------- method for checking available movements ----------> \\
  canMove(rotate, back) {
    let can = false;

    for (let row = 1; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        this.rotateMatrix(rotate);

        if (this.field[row][column] > 0
          && (this.field[row][column] === this.field[row - 1][column]
          || this.field[row - 1][column] === 0)) {
          can = true;
        }
        this.rotateMatrix(back);
      }
    }

    if (can) {
      return true;
    } else {
      return false;
    }
  }
}

const game = new Game();

game.initGame();
