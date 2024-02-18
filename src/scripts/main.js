/* eslint-disable max-len */
'use strict';

const startButton = document.querySelector('.button');
const rows = [...document.querySelector('.game-tbody').children];
const cells = [...document.querySelectorAll('.field-cell')];

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const scoreElement = document.querySelector('.game-score');
let score = 0;

const getRandomCell = () => {
  const emptyCells = cells.filter(cell => cell.textContent === '');
  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomIndex];
};

const getRandomNumber = () => {
  const number = Math.random();

  if (number < 0.9) {
    return 2;
  }

  return 4;
};

const setRandomNumber = () => {
  const number = getRandomNumber();
  const cell = getRandomCell();

  cell.classList.add(`field-cell--${number}`);
  cell.textContent = number.toString();
};

const checkRows = (i, c) => {
  if (rows[i].children[c].textContent === rows[i + 1].children[c].textContent) {
    return true;
  }
};

const checkColomns = (i, c) => {
  if (rows[i].children[c].textContent === rows[i].children[c + 1].textContent) {
    return true;
  }
};

const canMove = () => {
  for (let i = 0; i < rows.length; i++) {
    for (let c = 0; c < 4; c++) {
      if (i === 3) {
        if (c === 3) {
          break;
        }

        if (checkColomns(i, c)) {
          return true;
        }
      } else {
        if (checkRows(i, c)) {
          return true;
        }

        if (c === 3) {
          break;
        }

        if (checkColomns(i, c)) {
          return true;
        }
      }
    }
  }

  if (cells.find(cell => !cell.textContent)) {
    return true;
  }

  return false;
};

const updateData = () => {
  scoreElement.textContent = score;

  const canBeMoved = canMove();

  if (cells.find(cell => cell.textContent === '2048')) {
    winMessage.classList.remove('hidden');
  }

  if (!canBeMoved) {
    loseMessage.classList.remove('hidden');

    return;
  }

  setRandomNumber();
};

function arrowDown() {
  let currentCell;
  const wasAdded = [];

  for (let i = rows.length - 1; i >= 0; i--) {
    for (let c = 3; c >= 0; c--) {
      if (rows[i].children[c].textContent !== '') {
        currentCell = rows[i].children[c];

        if (i === 3) {
          break;
        }

        for (let m = i + 1; m < 4; m++) {
          if (rows[m].children[c].textContent === '') {
            rows[m].children[c].textContent = currentCell.textContent;
            rows[m].children[c].className = currentCell.className;

            currentCell = rows[m].children[c];

            rows[m - 1].children[c].textContent = '';
            rows[m - 1].children[c].className = 'field-cell';
          } else if (rows[m].children[c].textContent === rows[m - 1].children[c].textContent) {
            const newNumber = +currentCell.textContent * 2;

            if (wasAdded.includes(rows[m].children[c])) {
              break;
            }

            score += newNumber;

            rows[m].children[c].textContent = newNumber.toString();
            rows[m].children[c].className = `field-cell field-cell--${newNumber}`;
            wasAdded.push(rows[m].children[c]);

            currentCell = rows[m].children[c];

            rows[m - 1].children[c].textContent = '';
            rows[m - 1].children[c].className = 'field-cell';
            break;
          }
        }
      }
    }
  }

  updateData();
}

function arrowUp() {
  let currentCell;
  const wasAdded = [];

  for (let i = 0; i < rows.length; i++) {
    for (let c = 0; c < 4; c++) {
      if (rows[i].children[c].textContent !== '') {
        currentCell = rows[i].children[c];

        if (i === 0) {
          break;
        }

        for (let m = i - 1; m >= 0; m--) {
          if (rows[m].children[c].textContent === '') {
            rows[m].children[c].textContent = currentCell.textContent;
            rows[m].children[c].className = currentCell.className;

            currentCell = rows[m].children[c];

            rows[m + 1].children[c].textContent = '';
            rows[m + 1].children[c].className = 'field-cell';
          } else if (rows[m].children[c].textContent === rows[m + 1].children[c].textContent) {
            const newNumber = +currentCell.textContent * 2;

            if (wasAdded.includes(rows[m].children[c])) {
              break;
            }

            score += newNumber;

            rows[m].children[c].textContent = newNumber.toString();
            rows[m].children[c].className = `field-cell field-cell--${newNumber}`;

            wasAdded.push(rows[m].children[c]);

            currentCell = rows[m].children[c];

            rows[m + 1].children[c].textContent = '';
            rows[m + 1].children[c].className = 'field-cell';
            break;
          }
        }
      }
    }
  }

  updateData();
}

function arrowLeft() {
  let currentCell;
  const wasAdded = [];

  for (let c = 0; c < 4; c++) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].children[c].textContent !== '') {
        currentCell = rows[i].children[c];

        if (c === 0) {
          break;
        }

        for (let m = c - 1; m >= 0; m--) {
          if (rows[i].children[m].textContent === '') {
            rows[i].children[m].textContent = currentCell.textContent;
            rows[i].children[m].className = currentCell.className;

            currentCell = rows[i].children[m];

            rows[i].children[m + 1].textContent = '';
            rows[i].children[m + 1].className = 'field-cell';
          } else if (rows[i].children[m].textContent === rows[i].children[m + 1].textContent) {
            const newNumber = +currentCell.textContent * 2;

            if (wasAdded.includes(rows[i].children[m])) {
              break;
            }

            score += newNumber;

            rows[i].children[m].textContent = newNumber.toString();
            rows[i].children[m].className = `field-cell field-cell--${newNumber}`;

            wasAdded.push(rows[i].children[m]);

            currentCell = rows[i].children[m];

            rows[i].children[m + 1].textContent = '';
            rows[i].children[m + 1].className = 'field-cell';
            break;
          }
        }
      }
    }
  }

  updateData();
}

function arrowRight() {
  let currentCell;
  const wasAdded = [];

  for (let c = 3; c >= 0; c--) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].children[c].textContent !== '') {
        currentCell = rows[i].children[c];

        if (c === 3) {
          break;
        }

        for (let m = c + 1; m < 4; m++) {
          if (rows[i].children[m].textContent === '') {
            rows[i].children[m].textContent = currentCell.textContent;
            rows[i].children[m].className = currentCell.className;

            currentCell = rows[i].children[m];

            rows[i].children[m - 1].textContent = '';
            rows[i].children[m - 1].className = 'field-cell';
          } else if (rows[i].children[m].textContent === rows[i].children[m - 1].textContent) {
            const newNumber = +currentCell.textContent * 2;

            if (wasAdded.includes(rows[i].children[m])) {
              break;
            }

            score += newNumber;

            rows[i].children[m].textContent = newNumber.toString();
            rows[i].children[m].className = `field-cell field-cell--${newNumber}`;

            wasAdded.push(rows[i].children[m]);

            currentCell = rows[i].children[m];

            rows[i].children[m - 1].textContent = '';
            rows[i].children[m - 1].className = 'field-cell';
            break;
          }
        }
      }
    }
  }

  updateData();
}

document.addEventListener('click', (e) => {
  const start = e.target.closest('.start');
  const restart = e.target.closest('.restart');

  if (start) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = ('Restart');

    setRandomNumber();
    setRandomNumber();

    startMessage.classList.add('hidden');
  }

  if (restart) {
    cells.forEach(cell => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });

    setRandomNumber();
    setRandomNumber();

    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    score = 0;
    scoreElement.textContent = score;
  }
});

window.addEventListener('keydown', (e) => {
  if (startButton.classList.contains('start')) {
    return;
  }

  if (e.key === 'ArrowDown') {
    arrowDown();
  };

  if (e.key === 'ArrowUp') {
    arrowUp();
  };

  if (e.key === 'ArrowLeft') {
    arrowLeft();
  };

  if (e.key === 'ArrowRight') {
    arrowRight();
  };
});
