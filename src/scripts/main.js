'use strict';

const cells = document.querySelectorAll('.field-row');
const startButton = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const message = document.querySelector('.message-container');

const gameField = [];
const randomNumbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
const doublingNumbers = [];

let startOrRestart = 'start';
let sum = 0;
let winGame = false;

for (const cell of cells) {
  for (let i = 0; i < 4; i++) {
    gameField.push(cell.children[i]);
  }
}

let cleanField = [...gameField];

const startGame = () => {
  if (startOrRestart === 'start') {
    startButton.textContent = 'Restart';
    startButton.classList = 'button restart';
    startOrRestart = 'restart';
    message.children[2].classList = 'message message-start hidden';
  }

  if (startOrRestart === 'restart') {
    cleanField = [...gameField];

    gameField.map(a => {
      a.textContent = '';
      a.classList = 'field-cell';
    });
    sum = 0;
    gameScore.textContent = '0';
    message.children[1].classList = 'message message-win hidden';
    message.children[0].classList = 'message message-lose hidden';
    winGame = false;
  }
  addRandomNumber();
  addRandomNumber();
};

const finishGame = () => {
  const lateralСells = [3, 4, 7, 8, 11, 12];

  for (let i = 0; i <= 15; i++) {
    if (gameField[i - 4]) {
      if (gameField[i].textContent === gameField[i - 4].textContent) {
        return;
      }
    }

    if (gameField[i - 1]) {
      if (
        gameField[i].textContent === gameField[i - 1].textContent
          && !lateralСells.includes(i)) {
        return;
      }
    }

    if (gameField[i + 1]) {
      if (
        gameField[i].textContent === gameField[i + 1].textContent
          && !lateralСells.includes(i)) {
        return;
      }
    }

    if (gameField[i + 4]) {
      if (gameField[i].textContent === gameField[i + 4].textContent) {
        return;
      }
    }
  }
  message.children[0].classList = 'message message-lose';
};

const addRandomNumber = () => {
  if (cleanField.length === 0) {
    return;
  }

  const indexValue = Math.floor(Math.random() * randomNumbers.length);
  const randomStartValue = randomNumbers[indexValue];
  const randomKlitunka = Math.floor(Math.random() * cleanField.length);

  cleanField[randomKlitunka].textContent = `${randomStartValue}`;

  cleanField[randomKlitunka].classList = (
    `field-cell field-cell--${randomStartValue}`);
  cleanField = gameField.filter(a => a.textContent === '');
};

const doublingCell = (index, step) => {
  gameField[index + step].textContent = `${gameField[index].textContent * 2}`;

  gameField[index + step].classList = `field-cell
    field-cell--${gameField[index].textContent * 2}`;
  gameField[index].textContent = '';
  gameField[index].classList = 'field-cell';
  doublingNumbers.push(index, index + step);
  sum += +gameField[index + step].textContent;

  if (+gameField[index + step].textContent === 2048) {
    message.children[1].classList = 'message message-win';
    winGame = true;
  }
};

const movingCell = (index, step) => {
  gameField[index + step].textContent = gameField[index].textContent;
  gameField[index + step].classList = gameField[index].classList;
  gameField[index].textContent = '';
  gameField[index].classList = 'field-cell';
};

const stepDown = () => {
  for (let i = 11; i >= 0; i--) {
    if (gameField[i].textContent !== '') {
      if (gameField[i].textContent === gameField[i + 4].textContent
        && !doublingNumbers.includes(i)) {
        doublingCell(i, 4);
      }

      if (gameField[i + 4].textContent === '') {
        movingCell(i, 4);
      }
    }
  }
};

const stepUp = () => {
  for (let i = 4; i <= 15; i++) {
    if (gameField[i].textContent !== '') {
      if (gameField[i].textContent === gameField[i - 4].textContent
        && !doublingNumbers.includes(i)) {
        doublingCell(i, -4);
      }

      if (gameField[i - 4].textContent === '') {
        movingCell(i, -4);
      }
    }
  }
};

const stepLeft = () => {
  const leftLateralСells = [0, 4, 8, 12];

  for (let i = 0; i <= 15; i++) {
    if (gameField[i].textContent !== ''
      && !leftLateralСells.includes(i)) {
      if (gameField[i].textContent === gameField[i - 1].textContent
        && !doublingNumbers.includes(i)) {
        doublingCell(i, -1);
      }

      if (gameField[i - 1].textContent === '') {
        movingCell(i, -1);
      }
    }
  }
};

const stepRight = () => {
  const rightLateralСells = [3, 7, 11, 15];

  for (let i = 15; i >= 0; i--) {
    if (gameField[i].textContent !== '' && !rightLateralСells.includes(i)) {
      if (gameField[i].textContent === gameField[i + 1].textContent
        && !doublingNumbers.includes(i)) {
        doublingCell(i, 1);
      }

      if (gameField[i + 1].textContent === '') {
        movingCell(i, 1);
      }
    }
  }
};

startButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown'
    || e.key === 'ArrowUp'
    || e.key === 'ArrowLeft'
    || e.key === 'ArrowRight'
  ) {
    if (winGame) {
      return;
    }

    if (cleanField.length === 0) {
      finishGame();
    }

    const prevGameField = gameField.map(a => a.textContent);

    switch (e.key) {
      case 'ArrowDown':
        stepDown();
        stepDown();
        stepDown();
        break;

      case 'ArrowUp':
        stepUp();
        stepUp();
        stepUp();
        break;

      case 'ArrowLeft':
        stepLeft();
        stepLeft();
        stepLeft();
        break;

      case 'ArrowRight':
        stepRight();
        stepRight();
        stepRight();
        break;

      default:
        break;
    }

    cleanField = gameField.filter(cell => cell.textContent === '');

    if (prevGameField.toString()
      !== gameField.map(cell => cell.textContent).toString()) {
      addRandomNumber();
    }

    doublingNumbers.length = 0;
    gameScore.textContent = `${sum}`;
  }
});
