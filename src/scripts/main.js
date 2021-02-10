
'use strict';

const startButton = document.querySelector(`.start`);
const startMessage = document.querySelector(`.message-start`);
const loseMessage = document.querySelector(`.message-lose`);
const winMessage = document.querySelector(`.message-win`);
const gameScore = document.querySelector(`.game-score`);
const rowsCollection = document.querySelectorAll(`tr`);
const arrowButtons = [`ArrowUp`, `ArrowDown`,
  `ArrowLeft`, `ArrowRight`];

class Game {
  constructor() {
    this.gameField = this.createGameField();
    this.randomRawIndex = 0;
    this.randomColumnIndex = 0;
    this.moveWasPerformed = false;
    this.mergingHappened = false;
    this.score = 0;
    this.loseCheck = false;
    this.randomCellIndex = 0;
    this.movesHandler();
  }

  createGameField() {
    const gameField = [];

    for (let i = 0; i < 4; i++) {
      gameField.push(new Array(4).fill(0));
    }

    return gameField;
  }

  startGame() {
    startButton.addEventListener(`click`, () => {
      startButton.className = `button restart`;
      startButton.textContent = `Restart`;
      startMessage.classList.add(`hidden`);
      loseMessage.classList.add(`hidden`);
      winMessage.classList.add(`hidden`);
      this.clearField();
      this.createCell();
      this.createCell();
      this.render();
    });
  }

  randomValue() {
    const random = Math.ceil(Math.random() * 10);
    const newCellValue = random === 10 ? 4 : 2;

    return newCellValue;
  }

  createCell() {
    const emptyCellsArr = [];

    for (let i = 0; i < this.gameField.length; i++) {
      for (let y = 0; y < this.gameField[i].length; y++) {
        if (!this.gameField[i][y]) {
          emptyCellsArr.push([i, y]);
        }
      }
    }
    this.randomCellIndex = Math.floor(Math.random() * emptyCellsArr.length);

    const randomRawIndex = emptyCellsArr[this.randomCellIndex][0];
    const randomColumnIndex = emptyCellsArr[this.randomCellIndex][1];

    this.gameField[randomRawIndex][randomColumnIndex] = this.randomValue();
    this.mergingHappened = false;
    this.moveWasPerformed = false;
  }

  movesHandler() {
    document.addEventListener(`keydown`, (e) => {
      if (!arrowButtons.includes(e.key)) {
        return;
      }

      switch (e.key) {
        case `ArrowUp`:
          this.moveUp();
          break;
        case `ArrowRight`:
          this.rotateMatrix();
          this.rotateMatrix();
          this.rotateMatrix();
          this.moveUp();
          this.rotateMatrix();
          break;
        case `ArrowDown`:
          this.rotateMatrix();
          this.rotateMatrix();
          this.moveUp();
          this.rotateMatrix();
          this.rotateMatrix();
          break;
        case `ArrowLeft`:
          this.rotateMatrix();
          this.moveUp();
          this.rotateMatrix();
          this.rotateMatrix();
          this.rotateMatrix();
          break;
      }
      this.render();
      this.checkForLose();
    });
  }

  moveUp() {
    for (let i = 0; i < this.gameField.length; i++) {
      for (let y = 0; y < this.gameField[i].length; y++) {
        if (!this.gameField[i][y]) {
          continue;
        }

        for (let newIndex = i + 1; newIndex < 4; newIndex++) {
          if (this.gameField[i][y] !== this.gameField[newIndex][y]
             && this.gameField[newIndex][y]) {
            break;
          }

          if (this.gameField[i][y] !== this.gameField[newIndex][y]
             && !this.gameField[newIndex][y]) {
            continue;
          }

          this.merge(newIndex, i, y);
          break;
        }

        for (let newIndex = 0; newIndex < 4; newIndex++) {
          if (i <= newIndex) {
            break;
          }

          if (!this.gameField[newIndex][y]) {
            this.move(newIndex, i, y);
            break;
          }
        }
      }
    }

    if (this.mergingHappened || this.moveWasPerformed) {
      this.createCell();
    }
  }

  recordOfScore(value) {
    this.score += value;
    gameScore.textContent = this.score;

    if (value === 2048) {
      this.winGameMessage();
    }
  }

  winGameMessage() {
    winMessage.classList.remove(`hidden`);
  }

  loseGameMessage() {
    loseMessage.classList.remove(`hidden`);
  }

  clearField() {
    const clearedField = this.gameField.map(row =>
      row.map(el => {
        return el * 0;
      })
    );

    this.gameField = clearedField;
    this.score = 0;
    gameScore.textContent = this.score;
  }

  move(newIndex, i, y) {
    this.gameField[newIndex][y] = this.gameField[i][y];
    this.gameField[i][y] = 0;
    this.moveWasPerformed = true;
  }

  merge(newIndex, i, y) {
    this.gameField[newIndex][y] = 0;
    this.gameField[i][y] *= 2;
    this.mergingHappened = true;
    this.recordOfScore(this.gameField[i][y]);
  }

  rotateMatrix() {
    const arrCopy = [];

    for (let i = 0; i < 4; i++) {
      arrCopy.push(new Array(4).fill(0));
    }

    for (let i = 0; i < this.gameField.length; i++) {
      for (let y = 0; y < this.gameField[i].length; y++) {
        arrCopy[i][y] = this.gameField[arrCopy.length - 1 - y][i];
      }
    }

    this.gameField = arrCopy;
  }

  render() {
    for (let i = 0; i < this.gameField.length; i++) {
      for (let y = 0; y < this.gameField[i].length; y++) {
        const cell = rowsCollection[i].children[y];

        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.textContent = ``;

        if (!this.gameField[i][y]) {
          continue;
        }

        cell.classList.add(`field-cell--${this.gameField[i][y]}`);
        cell.textContent = this.gameField[i][y];
      }
    }
  }

  checkForLose() {
    for (let i = 0; i < this.gameField.length; i++) {
      for (let y = 0; y < this.gameField[i].length; y++) {
        if (!this.gameField[i][y]) {
          return;
        }

        if (i < 3 && this.gameField[i][y] === this.gameField[i + 1][y]) {
          return;
        }

        if (y < 3 && this.gameField[i][y] === this.gameField[i][y + 1]) {
          return;
        }
      }
    }
    this.loseGameMessage();
  }
}

const obj = new Game();

obj.startGame();
