'use strict';

const boardSize = 4;
const max = boardSize - 1;
let counterMove = 0;
let score = 0;
let gameOver = false;
let gameStart = false;

const blockHeader = document.querySelector('.game-header');
const blockField = document.querySelector('.game-field');
const blockMessage = document.querySelector('.message-container');
const buttonStart = blockHeader.querySelector('.start');

buttonStart.addEventListener('click', (e) => {
  if (gameStart) {
    return false;
  }

  const rows = blockField.querySelectorAll('.field-row');

  init();

  document.addEventListener('keydown', (eventObj) => {
    eventObj.preventDefault();

    if (gameOver) {
      return false;
    }

    if (e.keyCode < 37 && e.keyCode > 40) {
      return false;
    }

    const direction = e.code.toLowerCase().slice(5);

    if (move(direction, rows)) {
      counterMove++;
      addNumber();
      checkEmptyCells();
      deleteCombineClass();
    }

    blockHeader.querySelector('.game-score').textContent = score;

    if (counterMove === 1) {
      buttonStart.classList.add('restart');
    }
  });
});

function checkEmptyCells() {
  const emptyField = blockField.querySelectorAll('[class*=field-cell--]');

  if (emptyField.length === 16) {
    gameOver = true;
    blockMessage.querySelector('.message-lose').classList.remove('hidden');
  }
}

function deleteCombineClass() {
  const cells = blockField.querySelectorAll('.ceil-combine');

  if (cells.length > 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('ceil-combine');
    }
  }
}

function move(direction, rows) {
  let operation = 0;

  if (direction === 'down') {
    for (let i = max - 1; i >= 0; i--) {
      const row = rows[i];
      const cells = row.cells;

      for (let j = 0; j <= max; j++) {
        checkCeil(cells[j]);
      }
    }
  } else {
    for (let i = 0; i <= max; i++) {
      const row = rows[i];
      const cells = row.cells;

      if (direction === 'right') {
        for (let j = max - 1; j >= 0; j--) {
          checkCeil(cells[j]);
        }
      }

      if (direction === 'left') {
        for (let j = 1; j <= max; j++) {
          checkCeil(cells[j]);
        }
      }

      if (direction === 'up') {
        if (i === 0) {
          continue;
        }

        for (let j = 0; j <= max; j++) {
          checkCeil(cells[j]);
        }
      }
    }
  }

  return !!(operation);

  function checkCeil(ceil) {
    if (ceil.textContent !== '') {
      if (moveCeil(direction, ceil)) {
        operation++;
      }
    }
  }
}

function moveCeil(direction, currentCeil) {
  let nextCeil = null;

  switch (direction) {
    case 'right':
      nextCeil = currentCeil.nextElementSibling;
      break;

    case 'left':
      nextCeil = currentCeil.previousElementSibling;
      break;

    case 'up':
      const nextRowUp = currentCeil.parentElement.previousElementSibling;

      if (nextRowUp) {
        const nextRowCells = nextRowUp.cells;

        nextCeil = nextRowCells[currentCeil.cellIndex];
      }
      break;

    case 'down':
      const nextRowDown = currentCeil.parentElement.nextElementSibling;

      if (nextRowDown) {
        const nextRowCells = nextRowDown.cells;

        nextCeil = nextRowCells[currentCeil.cellIndex];
      }
      break;
  }

  if (!nextCeil) {
    return false;
  }

  if (currentCeil.textContent === nextCeil.textContent) {
    if (!currentCeil.classList.contains('ceil-combine')
      || !nextCeil.classList.contains('ceil-combine')) {
      combineCeil(currentCeil, nextCeil);

      return true;
    }
  }

  if (nextCeil.textContent === '') {
    replaceCeil(direction, currentCeil, nextCeil);

    return true;
  }
}

function replaceCeil(direction, currentCeil, nextCeil) {
  nextCeil.textContent = currentCeil.textContent;
  nextCeil.classList.add('field-cell--' + currentCeil.textContent);
  clearCeil(currentCeil);

  moveCeil(direction, nextCeil);
}

function combineCeil(currentCeil, nextCeil) {
  const newValue = Number(currentCeil.textContent) * 2;

  nextCeil.textContent = newValue;
  nextCeil.className = 'field-cell field-cell--' + newValue;
  nextCeil.classList.add('ceil-combine');
  clearCeil(currentCeil);
  score += newValue;

  if (newValue === 2048) {
    gameOver = true;
    blockMessage.querySelector('.message-win').classList.remove('hidden');
  }
}

function init() {
  gameStart = true;

  blockMessage.querySelector('.message-start').classList.add('hidden');

  const randomData = getRandomDataCeil();
  const rows = blockField.rows;
  const cells = rows[randomData[0]].cells;
  const randomCeil = cells[randomData[1]];

  randomCeil.textContent = 2;
  randomCeil.classList.add('field-cell--2');
}

function getRandomDataCeil() {
  const randomRow = Math.floor(Math.random() * boardSize);
  const randomCeil = Math.floor(Math.random() * boardSize);

  return [randomRow, randomCeil];
}

function addNumber() {
  const randomData = getRandomDataCeil();
  const rows = blockField.rows;
  const cells = rows[randomData[0]].cells;
  const randomCeil = cells[randomData[1]];

  if (randomCeil.textContent === '') {
    randomCeil.textContent = 2;
    randomCeil.classList.add('field-cell--2');
  } else {
    addNumber();
  }
}

function clearCeil(ceil) {
  ceil.textContent = '';
  ceil.className = 'field-cell';
}
