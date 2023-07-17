'use strict';

const button = document.querySelector('.game-header .button');

button.addEventListener('click', handleStartClick);

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const gameField = document.querySelector('.game-field');
const rows = [...gameField.rows];
const allCells = [...gameField.querySelectorAll('td')];

function setGlobalHandleKeydown(keyCode) {
  if (keyCode === 'ArrowUp') {
    clickArrowUp();
  }

  if (keyCode === 'ArrowDown') {
    clickArrowDown();
  }

  if (keyCode === 'ArrowRight') {
    clickArrowRight();
  }

  if (keyCode === 'ArrowLeft') {
    clickArrowLeft();
  }
}

function addRandomCell() {
  const emptyCells = allCells.filter(cell => cell.textContent.length === 0);

  const randomCell = Math.floor(Math.random() * emptyCells.length);
  const cellContent = Math.random() < 0.9 ? 2 : 4;

  emptyCells[randomCell].innerText = cellContent;
  emptyCells[randomCell].classList.add(`field-cell--${cellContent}`);
}

function handleRestarClick() {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  for (const cell of allCells) {
    cell.innerHTML = '';
    cell.className = 'field-cell';
  }

  addRandomCell();
  addRandomCell();
  updateScore(0);
  clickArrowUp.isBlocked = false;
  clickArrowDown.isBlocked = false;
  clickArrowRight.isBlocked = false;
  clickArrowLeft.isBlocked = false;
  checkBefoCellChange.isMoved = false;
  checkBefoCellChange.isMerged = false;
}

function handleStartClick() {
  button.innerHTML = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  document.querySelector('.message-start').classList.add('hidden');
  updateScore.value = 0;

  document.addEventListener('keydown', e => setGlobalHandleKeydown(e.code));

  document.querySelector('.restart').addEventListener('click',
    handleRestarClick);

  addRandomCell();
  addRandomCell();
}

function clickArrowUp() {
  for (let i = 0; i < 4; i++) {
    const column = allCells.filter(item => item.cellIndex === i).reverse();

    checkBefoCellChange(column);
  }

  if (checkBefoCellChange.isMerged || checkBefoCellChange.isMoved) {
    addRandomCell();
    checkBefoCellChange.isMerged = false;
    checkBefoCellChange.isMoved = false;
    clickArrowUp.isBlocked = false;
  } else {
    clickArrowUp.isBlocked = true;
    getLoseStatus();
  }
}

function clickArrowDown() {
  for (let i = 0; i < 4; i++) {
    const column = allCells.filter(item => item.cellIndex === i);

    checkBefoCellChange(column);
  }

  if (checkBefoCellChange.isMerged || checkBefoCellChange.isMoved) {
    addRandomCell();
    checkBefoCellChange.isMerged = false;
    checkBefoCellChange.isMoved = false;
    clickArrowDown.isBlocked = false;
  } else {
    clickArrowDown.isBlocked = true;
    getLoseStatus();
  }
}

function clickArrowRight() {
  for (const row of rows) {
    const rowCells = [...row.cells];

    checkBefoCellChange(rowCells);
  }

  if (checkBefoCellChange.isMerged || checkBefoCellChange.isMoved) {
    addRandomCell();
    checkBefoCellChange.isMerged = false;
    checkBefoCellChange.isMoved = false;
    clickArrowRight.isBlocked = false;
  } else {
    clickArrowRight.isBlocked = true;
    getLoseStatus();
  }
}

function clickArrowLeft() {
  for (const row of rows) {
    const rowCells = [...row.cells].reverse();

    checkBefoCellChange(rowCells);
  }

  if (checkBefoCellChange.isMerged || checkBefoCellChange.isMoved) {
    addRandomCell();
    checkBefoCellChange.isMerged = false;
    checkBefoCellChange.isMoved = false;
    clickArrowLeft.isBlocked = false;
  } else {
    clickArrowLeft.isBlocked = true;
    getLoseStatus();
  }
}

function mergeCells(cell1, cell2) {
  const content = +cell2.innerText + +cell1.innerText;

  cell2.innerText = content;
  cell2.classList.remove(cell2.classList[1]);
  cell2.classList.add(`field-cell--${content}`);
  cell1.innerText = '';
  cell1.classList.remove(cell1.classList[1]);
  getWinnerStatus();
}

function moveCells(cell1, cell2) {
  cell2.innerText = cell1.innerText;
  cell2.classList.add(`field-cell--${cell1.innerText}`);
  cell1.innerText = '';
  cell1.classList.remove(cell1.classList[1]);
}

function updateScore(newValue) {
  updateScore.value += newValue;

  const score = document.querySelector('.game-score');

  score.innerText = updateScore.value;
}

function checkBefoCellChange(cells) {
  for (let k = 0; k < cells.length - 1; k++) {
    if (!cells[k].innerText) {
      continue;
    }

    if (!cells[k + 1].innerText) {
      moveCells(cells[k], cells[k + 1]);
      checkBefoCellChange.isMoved = true;
    }

    if (+cells[k].innerText !== +cells[k + 1].innerText) {
      continue;
    }

    if (+cells[k].innerText === +cells[k + 1].innerText) {
      mergeCells(cells[k], cells[k + 1]);
      updateScore(+cells[k].innerText + +cells[k + 1].innerText);
      checkBefoCellChange.isMerged = true;
      break;
    }
  }
}

function getWinnerStatus() {
  const winnerValue = allCells.find(item => +item.innerText === 2048);

  if (winnerValue) {
    messageWin.classList.remove('hidden');
  }
}

function getLoseStatus() {
  const emptyCell = allCells.find(item => item.innerText.length === 0);
  const arrowsStatus = clickArrowUp.isBlocked && clickArrowRight.isBlocked
    && clickArrowLeft.isBlocked && clickArrowDown.isBlocked;

  if (!emptyCell && arrowsStatus) {
    messageLose.classList.remove('hidden');
  }
}
