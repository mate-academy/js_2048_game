'use strict';

// write your code here
const container = document.querySelector('.container');
const button = document.querySelector('.button');
const allTd = document.querySelectorAll('td');
const allTr = document.querySelectorAll('tr');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let clickOnRight;
let countOfMoveCells = 0;
let tdElement;

const arrayOfFields = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

container.addEventListener('click', (event) => {
  const item = event.target;

  if (button.textContent === 'Start' && item === button) {
    addNumber();
    startMessage.classList.add('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else if (button.textContent === 'Restart' && item === button) {
    startMessage.classList.remove('hidden');

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    clickOnRight = true;
    score.textContent = 0;

    restartArray();
    addColorToCell();
  }
});

function getRandomInt(min, max) {
  // eslint-disable-next-line no-param-reassign
  min = Math.ceil(min);
  // eslint-disable-next-line no-param-reassign
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

container.addEventListener('keydown', (event) => {
  if (button.textContent === 'Restart') {
    switch (event.key) {
      case 'ArrowDown': render(arrayOfFields, 1);
        break;
      case 'ArrowRight': render(arrayOfFields, 4);
        break;
      case 'ArrowUp': render(arrayOfFields, 3);
        break;
      case 'ArrowLeft': render(arrayOfFields, 2);
        break;
      default:
        break;
    }

    if (checkLoseGame()) {
      loseMessage.classList.remove('hidden');
    }
  }
});

function addNumber() {
  const probabilityToAddFour = getRandomInt(1, 11);

  do {
    tdElement = getRandomInt(0, allTd.length);
  }
  // eslint-disable-next-line max-len
  while (arrayOfFields[Math.trunc(tdElement / arrayOfFields.length)][tdElement - (Math.trunc(tdElement / arrayOfFields.length)) * arrayOfFields.length] !== 0);

  if (probabilityToAddFour === 1) {
    // eslint-disable-next-line max-len
    arrayOfFields[Math.trunc(tdElement / arrayOfFields.length)][tdElement - (Math.trunc(tdElement / arrayOfFields.length)) * arrayOfFields.length] = 4;
  } else if (probabilityToAddFour !== 1) {
    // eslint-disable-next-line max-len
    arrayOfFields[Math.trunc(tdElement / arrayOfFields.length)][tdElement - (Math.trunc(tdElement / arrayOfFields.length)) * arrayOfFields.length] = 2;
  }
  putNumberFromArrayToTextContent();
  addColorToCell();
};

function winConditional() {
  for (let y = 0; y < arrayOfFields.length; y++) {
    for (let t = 0; t < arrayOfFields[y].length; t++) {
      if (arrayOfFields[y][t] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function restartArray() {
  for (let i = 0; i < arrayOfFields.length; i++) {
    for (let y = 0; y < arrayOfFields[i].length; y++) {
      arrayOfFields[i][y] = 0;
    }
  }
  putNumberFromArrayToTextContent();
}

function addColorToCell() {
  for (let i = 0; i < allTd.length; i++) {
    if (allTd[i].textContent !== '') {
      allTd[i].classList.remove(allTd[i].classList[1]);
      allTd[i].classList.add(`field-cell--${allTd[i].textContent}`);
    }
  }

  for (let q = 0; q < allTd.length; q++) {
    if (allTd[q].textContent === '') {
      allTd[q].classList.remove(allTd[q].classList[1]);
    }
  }
}

function checkLoseGame() {
  for (let y = 0; y < arrayOfFields.length; y++) {
    for (let t = 0; t < arrayOfFields[y].length; t++) {
      if (arrayOfFields[y][t] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < arrayOfFields.length; i++) {
    for (let y = 1; y < arrayOfFields[i].length; y++) {
      if (arrayOfFields[i][y] === arrayOfFields[i][y - 1]) {
        return false;
      }
    }
  }

  for (let w = 1; w < arrayOfFields.length; w++) {
    for (let i = 0; i < arrayOfFields[w].length; i++) {
      if (arrayOfFields[w][i] === arrayOfFields[w - 1][i]) {
        return false;
      }
    }
  }

  return true;
}

function putNumberFromArrayToTextContent() {
  for (let i = 0; i < arrayOfFields.length; i++) {
    for (let y = 0; y < arrayOfFields[i].length; y++) {
      if (arrayOfFields[i][y] === 0) {
        allTr[i].cells[y].textContent = '';
      } else {
        allTr[i].cells[y].textContent = arrayOfFields[i][y];
      }
    }
  }
}

function arrowRight() {
  for (let i = 0; i < arrayOfFields.length; i++) {
    let r = 0;

    for (let a = 0; a < arrayOfFields[i].length; a++) {
      for (let y = arrayOfFields[i].length - 1; y > 0; y--) {
        if (arrayOfFields[i][y] === 0 && arrayOfFields[i][y]
           !== arrayOfFields[i][y - 1]) {
          arrayOfFields[i][y] = arrayOfFields[i][y - 1];
          arrayOfFields[i][y - 1] = 0;
          countOfMoveCells++;
        } else if (arrayOfFields[i][y - r] === arrayOfFields[i][y - 1 - r]
           && arrayOfFields[i][y - r] !== 0) {
          arrayOfFields[i][y - r] = Number(arrayOfFields[i][y - 1 - r])
            + Number(arrayOfFields[i][y - r]);
          arrayOfFields[i][y - 1 - r] = 0;
          countOfMoveCells++;

          score.textContent = Number(score.textContent)
          + Number(arrayOfFields[i][y]);
          r = 4 - y;
        }
      }
    }
    r = 0;
  }

  if (countOfMoveCells === 0) {
    clickOnRight = false;
  } else {
    clickOnRight = true;
  }
  countOfMoveCells = 0;
}

function render(array, numberOfTurn) {
  for (let z = 0; z < 4; z++) {
    for (let d = array.length, a = 0; a < d; a++) {
      for (let c = a + 1; c < d; c++) {
        const e = array[a][c];

        array[a][c] = array[c][a];
        array[c][a] = e;
      }
    }

    for (let q = 0; q < array.length / 2; q++) {
      const temp = array[q];

      array[q] = array[array.length - 1 - q];
      array[array.length - 1 - q] = temp;
    }

    if (z === numberOfTurn - 1) {
      arrowRight();
    }
  }

  if (clickOnRight) {
    winConditional();
    addNumber();
  }

  return array;
};
