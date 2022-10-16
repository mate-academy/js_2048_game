'use strict';

class Game {
  constructor(game) {
    this.fieldRows = document.querySelectorAll('.field-row');
    this.game = game;
    this.startButton = document.querySelector('.start');
    this.highScoreValue = 0;
    this.bestScore = document.querySelector('.best-score');
    this.gameScore = document.querySelector('.game-score');
    this.gameInfo = document.querySelector('.message-container');
    this.score = 0;
    this.gameOver = false;
    this.restartHandler = this.restartHandler.bind(this);
    this.startHandler = this.startHandler.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    this.verticalUp = this.verticalUp.bind(this);
    this.verticalDown = this.verticalDown.bind(this);
    this.horizontalLeft = this.horizontalLeft.bind(this);
    this.horizontalRight = this.horizontalRight.bind(this);
    this.addNumber = this.addNumber.bind(this);
    this.calculateScore = this.calculateScore.bind(this);

    this.startCoords = {
      x: 0,
      y: 0,
    };

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  start() {
    this.startButton.removeEventListener('click', this.restartHandler);
    this.startButton.addEventListener('click', this.startHandler);
  }

  play() {
    this.addNumber();
    this.addNumber();

    this.startButton.removeEventListener('click', this.startHandler);
    this.gameInfo.classList.add('hidden');

    document.addEventListener('keyup', this.keyHandler);
    document.addEventListener('mousedown', this.touchStartHandler);
    document.addEventListener('mouseup', this.touchEndHandler);
    document.addEventListener('touchstart', this.touchStartHandler);
    document.addEventListener('touchend', this.touchEndHandler);

    this.startButton.addEventListener('click', this.restartHandler);
  }

  startHandler() {
    this.startButton.classList.remove('start');
    this.startButton.classList.add('restart');
    this.startButton.innerText = 'Restart';

    this.play();
  }

  restartHandler() {
    this.startButton.classList.remove('restart');
    this.startButton.classList.add('start');
    this.startButton.innerText = 'Start';

    const currentScore = this.calculateScore();

    if (this.highScoreValue < currentScore) {
      this.highScoreValue = currentScore;
      this.bestScore.innerText = `${this.highScoreValue}`;
    }

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let j = 0; j < this.field.length; j++) {
      for (let i = 0; i < this.field[0].length; i++) {
        this.addNumberOnField(j, i);
      }
    }

    document.removeEventListener('keyup', this.keyHandler);
    document.removeEventListener('mousedown', this.touchStartHandler);
    document.removeEventListener('mouseup', this.touchEndHandler);
    document.removeEventListener('touchstart', this.touchStartHandler);
    document.removeEventListener('touchend', this.touchEndHandler);
    this.startButton.removeEventListener('click', this.startHandler);

    this.start();
  }

  touchStartHandler(e) {
    e.preventDefault();

    this.startCoords.x = e.screenX;
    this.startCoords.y = e.screenY;

    if (e.changedTouches) {
      this.startCoords.x = e.changedTouches[0].screenX;
      this.startCoords.y = e.changedTouches[0].screenY;
    }

    return this.startCoords;
  }

  touchEndHandler(e) {
    e.preventDefault();

    let mouseUpX = e.screenX;
    let mouseUpY = e.screenY;

    if (e.changedTouches) {
      mouseUpX = e.changedTouches[0].screenX;
      mouseUpY = e.changedTouches[0].screenY;
    }

    const deltaX = this.startCoords.x - mouseUpX;
    const deltaY = this.startCoords.y - mouseUpY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        this.verticalUp();
      } else {
        this.verticalDown();
      }
    } else {
      if (deltaX > 0) {
        this.horizontalLeft();
      } else {
        this.horizontalRight();
      }
    }

    this.addNumber();

    const currentScore = this.calculateScore();

    this.setScore(currentScore);
  }

  keyHandler(e) {
    if (e.key === 'ArrowUp') {
      this.verticalUp();
    } else if (e.key === 'ArrowDown') {
      this.verticalDown();
    } else if (e.key === 'ArrowLeft') {
      this.horizontalLeft();
    } else if (e.key === 'ArrowRight') {
      this.horizontalRight();
    } else {
      return;
    }

    this.addNumber();

    const currentScore = this.calculateScore();

    this.setScore(currentScore);
  }

  horizontalLeft() {
    for (let j = 0; j < this.field.length;) {
      let actions = 0;

      for (let i = 1; i < this.field[0].length; i++) {
        const cellLeft = this.field[j][i - 1];
        const cellRight = this.field[j][i];

        if (cellLeft === 0 && cellRight > 0) {
          this.field[j][i - 1] = this.field[j][i];
          this.field[j][i] = 0;
          actions++;
        }

        if (cellLeft !== 0 && cellLeft === cellRight) {
          this.field[j][i - 1] = cellLeft + cellRight;
          this.field[j][i] = 0;
          actions++;
        }
      }

      if (actions === 0) {
        for (let i = 0; i < this.field[0].length; i++) {
          this.addNumberOnField(j, i);
        }

        j++;
      }
    }
  }

  horizontalRight() {
    for (let j = 0; j < this.field.length;) {
      let actions = 0;

      for (let i = this.field[0].length - 1; i > 0; i--) {
        const cellLeft = this.field[j][i - 1];
        const cellRight = this.field[j][i];

        if (cellRight === 0 && cellLeft > 0) {
          this.field[j][i] = this.field[j][i - 1];
          this.field[j][i - 1] = 0;
          actions++;
        }

        if (cellRight !== 0 && cellLeft === cellRight) {
          this.field[j][i] = cellLeft + cellRight;
          this.field[j][i - 1] = 0;
          actions++;
        }
      }

      if (actions === 0) {
        for (let i = 0; i < this.field[0].length; i++) {
          this.addNumberOnField(j, i);
        }

        j++;
      }
    }
  }

  verticalUp() {
    for (let i = 0; i < this.field[0].length;) {
      let actions = 0;

      for (let j = 1; j < this.field.length; j++) {
        const cellUp = this.field[j - 1][i];
        const cellDown = this.field[j][i];

        if (cellUp === 0 && cellDown > 0) {
          this.field[j - 1][i] = this.field[j][i];
          this.field[j][i] = 0;
          actions++;
        }

        if (cellUp !== 0 && cellUp === cellDown) {
          this.field[j - 1][i] = cellUp + cellDown;
          this.field[j][i] = 0;
          actions++;
        }
      }

      if (actions === 0) {
        for (let j = 0; j < this.field.length; j++) {
          this.addNumberOnField(j, i);
        }

        i++;
      }
    }
  }

  verticalDown() {
    for (let i = this.field[0].length - 1; i >= 0;) {
      let actions = 0;

      for (let j = this.field.length - 1; j > 0; j--) {
        const cellUp = this.field[j - 1][i];
        const cellDown = this.field[j][i];

        if (cellDown === 0 && cellUp > 0) {
          this.field[j][i] = this.field[j - 1][i];
          this.field[j - 1][i] = 0;
          actions++;
        }

        if (cellDown !== 0 && cellUp === cellDown) {
          this.field[j][i] = cellUp + cellDown;
          this.field[j - 1][i] = 0;
          actions++;
        }
      }

      if (actions === 0) {
        for (let j = 0; j < this.field.length; j++) {
          this.addNumberOnField(j, i);
        }

        i--;
      }
    }
  }

  addNumberOnField(j, i) {
    const number = this.field[j][i];
    const workingCell = this.fieldRows[j].children[i];

    workingCell.className = 'field-cell';
    workingCell.innerText = '';

    if (number > 0) {
      workingCell.classList.add(`field-cell--${number}`);
      workingCell.innerText = number;
    }
  }

  calculateScore() {
    return this.field.flat().reduce((a, c) => a + c, 0);
  }

  setScore(score) {
    this.gameScore.innerText = `${score}`;
  }

  addNumber() {
    let posX;
    let posY;

    if (this.haveZero()) {
      do {
        posX = this.findEmpty();
      } while (!(this.field[posX].some(elem => elem === 0)));
    }

    if (this.haveZero()) {
      do {
        posY = this.findEmpty();
      } while (!(this.field[posX][posY] === 0));
    }

    const newNumber = this.calculateChance();
    const cellToAdd = this.fieldRows[posX].children[posY];

    cellToAdd.classList.add(`field-cell--${newNumber}`);
    cellToAdd.innerText = newNumber;
    this.field[posX][posY] = newNumber;
  }

  calculateChance() {
    return Math.random() > 0.1 ? 2 : 4;
  }

  haveZero() {
    return this.field
      .map(cell => cell.some(key => key === 0)).some(key => key);
  }

  findEmpty() {
    return Math.trunc(4 * Math.random());
  }
}

const gameField = document.querySelector('body');
const newGame = new Game(gameField);

newGame.start();
