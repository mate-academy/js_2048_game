'use strict';

const mainButton = document.querySelector('.button');
const messageContainer = document.querySelectorAll('.message-container');
const fieldCell = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScoreElement = document.querySelector('.game-score');

let gameStarted = false;
let score = 0;

mainButton.addEventListener('click', () => {
  messageContainer.forEach((element) => {
    element.style.visibility = 'hidden';
  });

  if (mainButton.classList.contains('restart')) {
    restartGame();
  } else {
    startGame();
  }
});

function restartGame() {
  fieldCell.forEach((cell) => {
    cell.innerHTML = '';
    cell.className = 'field-cell';
  });

  mainButton.removeAttribute('tabindex');

  score = 0;
  gameStarted = true;
  updateGameScore();
  createCells();
}

function startGame() {
  mainButton.classList.add('restart');
  mainButton.classList.remove('start');
  mainButton.textContent = 'Restart';
  mainButton.removeAttribute('tabindex');
  gameStarted = true;
  createCells();
}

function createCells() {
  const randomIndexes = getRandomIndexes(2, fieldCell.length);

  randomIndexes.forEach((index) => {
    const random = Math.floor(Math.random() * 11);
    let newClass = 'field-cell--2';
    let newValue = '2';

    if (random === 1) {
      newClass = 'field-cell--4';
      newValue = '4';
    }

    const cell = fieldCell[index];

    cell.classList.add(newClass);

    const textNode = document.createTextNode(newValue);

    cell.appendChild(textNode);
  });
}

function getRandomIndexes(count, max) {
  const indexes = new Set();

  while (indexes.size < count) {
    const randomIndex = Math.floor(Math.random() * max);

    indexes.add(randomIndex);
  }

  return Array.from(indexes);
}

document.addEventListener('keydown', moveCells);

function moveCells(key) {
  key.preventDefault();

  if (!gameStarted) {
    return;
  }

  if (key.key === 'ArrowUp') {
    moveUp();
  }

  if (key.key === 'ArrowDown') {
    moveDown();
  }

  if (key.key === 'ArrowLeft') {
    moveLeft();
  }

  if (key.key === 'ArrowRight') {
    moveRight();
  }

  if (!checkAvailableMoves()) {
    gameOver();
  }
}

function checkAvailableMoves() {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const currentCell = fieldCell[row * 4 + column];
      const value = currentCell.innerHTML;

      if (column < 3) {
        const rightCell = fieldCell[row * 4 + column + 1];

        if (value === rightCell.innerHTML) {
          return true;
        }
      }

      if (row < 3) {
        const bottomCell = fieldCell[(row + 1) * 4 + column];

        if (value === bottomCell.innerHTML) {
          return true;
        }
      }

      if (value === '') {
        return true;
      }
    }
  }

  return false;
}

function checkWin() {
  const hasWinningValue
  = Array.from(fieldCell).some((cell) => cell.innerHTML === '2048');

  if (hasWinningValue) {
    win();
  }
}

function generateNewCell() {
  const emptyCellIndexes = [];

  fieldCell.forEach((c, index) => {
    if (c.innerHTML === '') {
      emptyCellIndexes.push(index);
    }
  });

  if (emptyCellIndexes.length === 0) {
    return;
  }

  const randomIndex
  = emptyCellIndexes[Math.floor(Math.random() * emptyCellIndexes.length)];
  const random = Math.floor(Math.random() * 11);
  let newClass = 'field-cell--2';
  let newValue = '2';

  if (random === 1) {
    newClass = 'field-cell--4';
    newValue = '4';
  }

  const cell = fieldCell[randomIndex];

  cell.classList.add(newClass);

  const textNode = document.createTextNode(newValue);

  cell.appendChild(textNode);

  updateGameScore();
}

function moveUp() {
  for (let column = 0; column < 4; column++) {
    for (let row = 1; row < 4; row++) {
      let currentCell = fieldCell[row * 4 + column];
      const value = currentCell.innerHTML;

      if (value === '') {
        continue;
      }

      let targetRow = row - 1;

      while (targetRow >= 0) {
        const targetCell = fieldCell[targetRow * 4 + column];
        const targetValue = targetCell.innerHTML;

        if (targetValue === '') {
          targetCell.innerHTML = value;
          targetCell.className = currentCell.className;
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          currentCell = targetCell;
          targetRow--;
        } else if (targetValue === value) {
          const newValue = parseInt(value) * 2;

          targetCell.innerHTML = newValue.toString();
          targetCell.classList.remove(`field-cell--${value}`);
          targetCell.classList.add(`field-cell--${newValue}`);
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          score += newValue;
          break;
        } else {
          break;
        }
      }
    }
  }

  generateNewCell();
  checkWin();
  updateGameScore();
}

function moveDown() {
  for (let column = 0; column < 4; column++) {
    for (let row = 2; row >= 0; row--) {
      let currentCell = fieldCell[row * 4 + column];
      const value = currentCell.innerHTML;

      if (value === '') {
        continue;
      }

      let targetRow = row + 1;

      while (targetRow < 4) {
        const targetCell = fieldCell[targetRow * 4 + column];
        const targetValue = targetCell.innerHTML;

        if (targetValue === '') {
          targetCell.innerHTML = value;
          targetCell.className = currentCell.className;
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          currentCell = targetCell;
          targetRow++;
        } else if (targetValue === value) {
          const newValue = parseInt(value) * 2;

          targetCell.innerHTML = newValue.toString();
          targetCell.classList.remove(`field-cell--${value}`);
          targetCell.classList.add(`field-cell--${newValue}`);
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          score += newValue;
          break;
        } else {
          break;
        }
      }
    }
  }

  generateNewCell();
  checkWin();
  updateGameScore();
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    for (let column = 1; column < 4; column++) {
      let currentCell = fieldCell[row * 4 + column];
      const value = currentCell.innerHTML;

      if (value === '') {
        continue;
      }

      let targetColumn = column - 1;

      while (targetColumn >= 0) {
        const targetCell = fieldCell[row * 4 + targetColumn];
        const targetValue = targetCell.innerHTML;

        if (targetValue === '') {
          targetCell.innerHTML = value;
          targetCell.className = currentCell.className;
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          currentCell = targetCell;
          targetColumn--;
        } else if (targetValue === value) {
          const newValue = parseInt(value) * 2;

          targetCell.innerHTML = newValue.toString();
          targetCell.classList.remove(`field-cell--${value}`);
          targetCell.classList.add(`field-cell--${newValue}`);
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          score += newValue;
          break;
        } else {
          break;
        }
      }
    }
  }

  generateNewCell();
  checkWin();
  updateGameScore();
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    for (let column = 2; column >= 0; column--) {
      let currentCell = fieldCell[row * 4 + column];
      const value = currentCell.innerHTML;

      if (value === '') {
        continue;
      }

      let targetColumn = column + 1;

      while (targetColumn < 4) {
        const targetCell = fieldCell[row * 4 + targetColumn];
        const targetValue = targetCell.innerHTML;

        if (targetValue === '') {
          targetCell.innerHTML = value;
          targetCell.className = currentCell.className;
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          currentCell = targetCell;
          targetColumn++;
        } else if (targetValue === value) {
          const newValue = parseInt(value) * 2;

          targetCell.innerHTML = newValue.toString();
          targetCell.classList.remove(`field-cell--${value}`);
          targetCell.classList.add(`field-cell--${newValue}`);
          currentCell.innerHTML = '';
          currentCell.className = 'field-cell';
          score += newValue;
          break;
        } else {
          break;
        }
      }
    }
  }

  generateNewCell();
  checkWin();
  updateGameScore();
}

function updateGameScore() {
  gameScoreElement.textContent = score.toString();
}

function gameOver() {
  messageContainer.forEach((element) => {
    element.style.visibility = 'visible';
  });
  messageStart.classList.add('hidden');
  messageLose.classList.remove('hidden');
}

function win() {
  messageContainer.forEach((element) => {
    element.style.visibility = 'visible';
  });
  messageStart.classList.add('hidden');
  messageWin.classList.remove('hidden');
}
