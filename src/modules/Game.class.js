'use strict';

class Game {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  gameStatus = 'idle';
  score = 0;

  constructor() {
    this.startButton = document.querySelector('.start');
    this.restartButton = document.querySelector('.restart');
    this.messageStartGame = document.querySelector('.message-start');
    this.messageWinGame = document.querySelector('.message-win');
    this.messageLoseGame = document.querySelector('.message-lose');
    this.gameScore = document.querySelector('.game-score');
    [...this.cells] = document.getElementsByClassName('field-cell');
  }

  moveLeft() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = 1; i < this.field[j].length; i++) {
        let k = i;

        while (k > 0 && this.field[j][k - 1] === 0) {
          this.field[j][k - 1] = this.field[j][k];
          this.field[j][k] = 0;
          k--;
        }

        if (k > 0 && this.field[j][k - 1] === this.field[j][k]) {
          this.score += this.field[j][k - 1] * 2;
          this.field[j][k - 1] *= 2;
          this.field[j][k] = 0;
        }
      }
    }
  }

  moveRight() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 0; i--) {
        let k = i;

        while (k < this.field[j].length - 1 && this.field[j][k + 1] === 0) {
          this.field[j][k + 1] = this.field[j][k];
          this.field[j][k] = 0;
          k++;
        }

        if (
          k < this.field[j].length - 1 &&
          this.field[j][k + 1] === this.field[j][k]
        ) {
          this.score += this.field[j][k + 1] * 2;
          this.field[j][k + 1] *= 2;
          this.field[j][k] = 0;
        }
      }
    }
  }

  moveUp() {
    for (let i = 1; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        let k = i;

        while (k > 0 && this.field[k - 1][j] === 0) {
          this.field[k - 1][j] = this.field[k][j];
          this.field[k][j] = 0;
          k--;
        }

        if (k > 0 && this.field[k - 1][j] === this.field[k][j]) {
          this.score += this.field[k - 1][j] * 2;
          this.field[k - 1][j] *= 2;
          this.field[k][j] = 0;
        }
      }
    }
  }

  moveDown() {
    for (let i = this.field.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.field[i].length; j++) {
        let k = i;

        while (k < this.field.length - 1 && this.field[k + 1][j] === 0) {
          this.field[k + 1][j] = this.field[k][j];
          this.field[k][j] = 0;
          k++;
        }

        if (
          k < this.field.length - 1 &&
          this.field[k + 1][j] === this.field[k][j]
        ) {
          this.score += this.field[k + 1][j] * 2;
          this.field[k + 1][j] *= 2;
          this.field[k][j] = 0;
          break;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.startButton.classList.add('restart');
    this.startButton.classList.remove('start');
    this.startButton.innerText = 'Restart';
    this.messageStartGame.classList.add('hidden');
    this.addingNumberToField();
    this.addingNumberToField();
    this.gameStatus = 'playing';
    this.stylingCells();
  }

  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addingNumberToField();
    this.addingNumberToField();
    this.renderField();
    this.gameStatus = 'playing';
    this.messageLoseGame.classList.add('hidden');
    this.messageWinGame.classList.add('hidden');
    this.score = 0;
    this.gameScore.innerText = this.score;
    this.stylingCells();
  }

  addingNumberToField() {
    const randomRow = +Math.floor(Math.random() * 4);
    const randomCeil = +Math.floor(Math.random() * 4);
    const firstNum = Math.random() >= 0.9 ? 4 : 2;

    if (!this.field[randomRow][randomCeil]) {
      this.field[randomRow][randomCeil] = firstNum;

      this.renderField();
    } else {
      this.addingNumberToField();
    }
  }

  renderField() {
    for (let i = 0; i < this.cells.length; i++) {
      [...this.cells][i].innerText = this.field.flat()[i] || '';
    }
    this.gameScore.innerText = this.score;
  }

  stylingCells() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].className = 'field-cell';

      if (this.field.flat()[i]) {
        this.cells[i].classList.add(`field-cell--${this.field.flat()[i]}`);
      }
    }
  }

  checkVictory() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] === 2048) {
          this.messageWinGame.classList.remove('hidden');
          this.gameStatus = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    const isFilledArray = this.field.flat().includes(0);

    if (isFilledArray) {
      return false;
    }

    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        const cannotBeMerged =
          (isFilledArray && this.field[i][j] !== this.field[i - 1][j]) ||
          this.field[i][j] !== this.field[i + 1][j] ||
          this.field[i][j] !== this.field[i][j + 1] ||
          this.field[i][j] !== this.field[i][j - 1];

        if (cannotBeMerged) {
          this.messageLoseGame.classList.remove('hidden');
          this.gameStatus = 'lose';

          return true;
        }
      }
    }
  }

  canMoveCellsRight() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 0; i--) {
        if (
          (this.field[j][i + 1] === 0 &&
            this.field[j][i] !== this.field[j][i + 1]) ||
          (this.field[j][i + 1] === this.field[j][i] && this.field[j][i] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsLeft() {
    for (let j = 0; j < this.field.length; j++) {
      for (let i = this.field[j].length - 1; i >= 1; i--) {
        if (
          (this.field[j][i - 1] === 0 &&
            this.field[j][i] !== this.field[j][i - 1]) ||
          (this.field[j][i - 1] === this.field[j][i] && this.field[j][i] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsUp() {
    for (let i = 1; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (
          (this.field[i - 1][j] === 0 &&
            this.field[i][j] !== this.field[i - 1][j]) ||
          (this.field[i - 1][j] === this.field[i][j] && this.field[i][j] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveCellsDown() {
    for (let i = 0; i < this.field.length - 1; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (
          (this.field[i + 1][j] === 0 &&
            this.field[i][j] !== this.field[i + 1][j]) ||
          (this.field[i + 1][j] === this.field[i][j] && this.field[i][j] !== 0)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  handleUpButtonClickAndUpdateField() {
    if (!this.checkVictory() && this.gameStatus === 'playing') {
      this.moveUp();
      this.addingNumberToField();
      this.renderField();
      this.checkVictory();
      this.stylingCells();
    }
  }

  handleDownButtonClickAndUpdateField() {
    if (!this.checkVictory() && this.gameStatus === 'playing') {
      this.moveDown();
      this.addingNumberToField();
      this.renderField();
      this.checkVictory();
      this.stylingCells();
    }
  }

  handleRightButtonClickAndUpdateField() {
    if (!this.checkVictory() && this.gameStatus === 'playing') {
      this.moveRight();
      this.addingNumberToField();
      this.renderField();
      this.checkVictory();
      this.stylingCells();
    }
  }

  handleLeftButtonClickAndUpdateField() {
    if (!this.checkVictory() && this.gameStatus === 'playing') {
      this.moveLeft();
      this.addingNumberToField();
      this.renderField();
      this.checkVictory();
      this.stylingCells();
    }
  }
  // Add your own methods here
}

module.exports = Game;
