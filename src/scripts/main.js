'use strict';

const startButton = document.querySelector('.button');
const gameCells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const scoreUpdateContainer = document.querySelector('.score-update-container');
const rowsCount = gameRows.length;
const colsCount = gameCells.length / rowsCount;
let score = 0;

startButton.addEventListener('click', (e) => {
  if (startButton.classList.contains('start')) {
    randomizingNumInCell();
    randomizingNumInCell();
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else if (startButton.classList.contains('restart')) {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    gameCells.forEach(cell => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
    randomizingNumInCell();
    randomizingNumInCell();
    score = 0;
    gameScore.textContent = score;
  }
});

document.addEventListener('keydown', ev => {
  ev.preventDefault();

  switch (ev.code) {
    case 'ArrowLeft':
      slideHorizontally('Left');
      break;
    case 'ArrowRight':
      slideHorizontally('Right');
      break;
    case 'ArrowUp':
      slideVertically('Up');
      break;
    case 'ArrowDown':
      slideVertically('Down');
      break;
    default:
      break;
  }
});

function slideHorizontally(direction) {
  const gameFieldBeforeMove = makeArrayFromCells();

  for (let r = 0; r < rowsCount; r++) {
    let row = [];

    for (const child of gameRows[r].children) {
      row.push(+child.textContent || 0);
      child.className = 'field-cell';
      child.textContent = '';
    }

    if (direction.toLowerCase() === 'left') {
      row = cellsMergin(row);
    } else if (direction.toLowerCase() === 'right') {
      row = cellsMergin(row.reverse()).reverse();
    }

    for (let i = 0; i < gameRows[r].children.length; i++) {
      if (row[i] > 0) {
        gameRows[r].children[i].textContent = row[i];
        gameRows[r].children[i].classList.add(`field-cell--${row[i]}`);
      }
    }
  }
  addCell(gameFieldBeforeMove);
}

function slideVertically(direction) {
  const gameFieldBeforeMove = makeArrayFromCells();

  for (let c = 0; c < colsCount; c++) {
    let row = [];

    for (let r = 0; r < rowsCount; r++) {
      row.push(+gameRows[r].children[c].textContent || 0);
      gameRows[r].children[c].className = 'field-cell';
      gameRows[r].children[c].textContent = '';
    }

    if (direction.toLowerCase() === 'down') {
      row = cellsMergin(row.reverse()).reverse();
    } else if (direction.toLowerCase() === 'up') {
      row = cellsMergin(row);
    }

    for (let r = 0; r < rowsCount; r++) {
      if (row[r] > 0) {
        gameRows[r].children[c].textContent = row[r];
        gameRows[r].children[c].classList.add(`field-cell--${row[r]}`);
      }
    }
  }
  addCell(gameFieldBeforeMove);
}

function randomizingNumInCell() {
  const arrayForRandomCell = [];

  for (let i = 0; i < gameCells.length; i++) {
    if (!gameCells[i].textContent) {
      arrayForRandomCell.push(i);
    }
  }

  if (arrayForRandomCell.length === 0) {
    return;
  }

  const randIndex = Math.floor(Math.random() * arrayForRandomCell.length);
  const randNumber = Math.random() > 0.9 ? 4 : 2;
  const randCell = arrayForRandomCell[randIndex];

  gameCells[randCell].classList
    .add(`field-cell--${randNumber}`);

  gameCells[randCell].textContent = `${randNumber}`;
  gameScore.textContent = score;
}

function filterZero(row) {
  return row.filter(cell => cell !== 0);
}

function cellsMergin(row) {
  let filteredRow = filterZero(row);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
      scoreUpdater(filteredRow[i]);
    }
  }

  filteredRow = filterZero(filteredRow);

  while (filteredRow.length < colsCount) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function addCell(gameFieldBeforeMove) {
  checkWin();

  if (checkLose()) {
    return;
  }

  const gameFieldAfterMove = makeArrayFromCells();

  if (gameFieldAfterMove.toString() === gameFieldBeforeMove.toString()) {
    return;
  }
  randomizingNumInCell();
}

function makeArrayFromCells() {
  const array = [];

  gameCells.forEach(cell => array.push(cell.textContent));

  return array;
}

function checkWin() {
  if (makeArrayFromCells().some(element => +element === 2048)) {
    messageWin.classList.remove('hidden');

    return true;
  }
}

function checkLose() {
  if (makeArrayFromCells().some(element => element === '')) {
    return false;
  }

  for (let r = 0; r < gameRows.length; r++) {
    for (let c = 0; c < gameRows[r].children.length - 1; c++) {
      if (gameRows[r].children[c].textContent
        === gameRows[r].children[c + 1].textContent) {
        return false;
      }
    }
  }

  for (let c = 0; c < gameRows[0].children.length; c++) {
    for (let r = 0; r < gameRows.length - 1; r++) {
      if (gameRows[r].children[c].textContent
        === gameRows[r + 1].children[c].textContent) {
        return false;
      }
    }
  }
  messageLose.classList.remove('hidden');

  return true;
}

function scoreUpdater(number) {
  scoreUpdateContainer.insertAdjacentHTML('beforeend', `
      <span class="score-update">+${number}</span>
    `);

  setTimeout(() => {
    scoreUpdateContainer.firstElementChild.remove();
  }, 1500);
}
