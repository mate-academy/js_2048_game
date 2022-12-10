'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageHowto = document.querySelector('.message-howto');
const buttonStart = document.querySelector('.button');
const buttonHowto = document.querySelector('.howto');
const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('td');

const boardSideSize = 4;
let score = 0;
let isButtonStart = true;
let isButtonHowto = true;
const board = [];

move();

buttonHowto.addEventListener('click', e => {
  if (isButtonHowto) {
    e.target.innerHTML = 'Hide tips';
    messageHowto.classList.remove('hidden');
    isButtonHowto = false;
  } else {
    e.target.innerHTML = 'How to play';
    messageHowto.classList.add('hidden');
    isButtonHowto = true;
  }
});

buttonStart.addEventListener('click', e => {
  if (isButtonStart) {
    e.target.className = 'button restart';
    e.target.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    isButtonStart = false;

    addNewTile();
    addNewTile();
  } else {
    e.target.className = 'button start';
    e.target.innerHTML = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    isButtonStart = true;
    resetBoard();
  }
});

function addNewTile() {
  const randomNumber = (Math.random() < 0.1) ? 4 : 2;
  const randomPlace = Math.floor(Math.random() * cells.length);

  if (!cells[randomPlace].innerHTML) {
    cells[randomPlace].innerHTML = randomNumber;
    cells[randomPlace].className = `field-cell field-cell--${randomNumber}`;
  } else {
    addNewTile();
    isGameOver();
  }
}

function resetBoard() {
  for (const cell of cells) {
    for (let i = 0; i < 16; i++) {
      cell.innerHTML = '';
      cell.className = 'field-cell';
    }
  }
}

function updateBoard(tiles) {
  gameScore.innerHTML = score;

  tiles.forEach(item => {
    (item.innerHTML)
      ? item.className = `field-cell field-cell--${item.innerHTML}`
      : item.className = 'field-cell';
  });
}

function mergeInRow() {
  let mergedTile;

  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i].innerHTML === cells[i + 1].innerHTML
      && cells[i].parentElement === cells[i + 1].parentElement) {
      mergedTile = parseInt(cells[i].innerHTML)
      + parseInt(cells[i + 1].innerHTML);
      cells[i].innerHTML = mergedTile;
      cells[i + 1].innerHTML = '';

      if (mergedTile === parseInt(mergedTile)) {
        score += mergedTile;
      };
    }
  }
  isWinner();
}

function mergeInColumn() {
  let mergedTile;

  for (let i = 0; i < cells.length - 4; i++) {
    if (cells[i].innerHTML === cells[i + boardSideSize].innerHTML) {
      mergedTile = parseInt(cells[i].innerHTML)
      + parseInt(cells[i + boardSideSize].innerHTML);
      cells[i].innerHTML = mergedTile;
      cells[i + boardSideSize].innerHTML = '';

      if (mergedTile === parseInt(mergedTile)) {
        score += mergedTile;
      };
    }
  }
  isWinner();
}

function isPossibleToMove() {
  for (let i = 0; i < cells.length - 4; i++) {
    if (cells[i].innerHTML === cells[i + boardSideSize].innerHTML) {
      return true;
    }
  }

  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i].innerHTML === cells[i + 1].innerHTML
      && cells[i].parentElement === cells[i + 1].parentElement) {
      return true;
    }
  }

  return false;
}

function boardShot() {
  for (let i = 0; i < cells.length; i++) {
    board[i] = cells[i].innerHTML;
  }
}

function wasMoved() {
  for (let i = 0; i < cells.length; i++) {
    if (board[i] !== cells[i].innerHTML) {
      return true;
    }
  }

  return false;
}

function moveRight() {
  boardShot();
  moveHorisontal(true);
  mergeInRow();
  moveHorisontal(true);

  if (wasMoved()) {
    addNewTile();
  }
}

function moveLeft() {
  boardShot();
  moveHorisontal(false);
  mergeInRow();
  moveHorisontal(false);

  if (wasMoved()) {
    addNewTile();
  }
}

function moveDown() {
  boardShot();
  moveVertical(true);
  mergeInColumn();
  moveVertical(true);

  if (wasMoved()) {
    addNewTile();
  }
}

function moveUp() {
  boardShot();
  moveVertical(false);
  mergeInColumn();
  moveVertical(false);

  if (wasMoved()) {
    addNewTile();
  }
}

function moveHorisontal(isToRight) {
  for (let i = 0; i < cells.length; i = i + 4) {
    const line = [];

    for (let j = 0; j < boardSideSize; j++) {
      line.push(parseInt(cells[i + j].innerHTML));
    }

    const numbersCells = line.filter(number => number);
    const zeroCells = new Array(4 - numbersCells.length).fill('');

    const newRow = (isToRight) ? zeroCells.concat(numbersCells)
      : numbersCells.concat(zeroCells);

    for (let j = 0; j < boardSideSize; j++) {
      cells[i + j].innerHTML = newRow[j];
    }
    updateBoard(cells);
  }
}

function moveVertical(isToDown) {
  for (let i = 0; i < boardSideSize; i++) {
    const line = [];

    for (let j = 0; j < boardSideSize; j++) {
      line.push(parseInt(cells[i + boardSideSize * j].innerHTML));
    }

    const numbersCells = line.filter(number => number);
    const zeroCells = new Array(4 - numbersCells.length).fill('');

    const newRow = (isToDown) ? zeroCells.concat(numbersCells)
      : numbersCells.concat(zeroCells);

    for (let j = 0; j < boardSideSize; j++) {
      cells[i + boardSideSize * j].innerHTML = newRow[j];
    }
    updateBoard(cells);
  }
}

function move() {
  document.body.addEventListener('keydown', e => {
    if (!isButtonStart) {
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;

        case 'ArrowRight':
          moveRight();
          break;

        case 'ArrowUp':
          moveUp();
          break;

        case 'ArrowDown':
          moveDown();
          break;
      }
    }
  });
}

function isWinner() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML === '2048') {
      messageWin.classList.remove('hidden');
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }
}

function isGameOver() {
  let emptyCells = 0;

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].innerHTML) {
      emptyCells++;
    }
  }

  if (!emptyCells && !isPossibleToMove()) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }
}
