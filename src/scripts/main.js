'use strict';

const page = document.querySelector('.page');
const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageEndGame = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');
const rows = document.querySelectorAll('.field-row');
const columnOne = document.querySelectorAll('.column-1');
const columnTwo = document.querySelectorAll('.column-2');
const columnTree = document.querySelectorAll('.column-3');
const columnFour = document.querySelectorAll('.column-4');
const columns = [columnOne, columnTwo, columnTree, columnFour];

page.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('start')) {
    messageStart.style.visibility = 'hidden';
    getStarted();
    addRandomToEmpty(true);
    addRandomToEmpty(true);
  }

  if (target.classList.contains('restart')) {
    gameScore.innerHTML = 0;
    getStarted();
    addRandomToEmpty(true);
    addRandomToEmpty(true);
    messageEndGame.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      renameStartButton();
      addRandomToEmpty(mooveRight());
      break;

    case 'ArrowLeft':
      renameStartButton();
      addRandomToEmpty(mooveLeft());
      break;

    case 'ArrowUp':
      renameStartButton();
      addRandomToEmpty(mooveUp());
      break;

    case 'ArrowDown':
      renameStartButton();
      addRandomToEmpty(mooveDown());
      break;
  }

  // isThereMoove();
});

function renameStartButton() {
  buttonStart.classList.add('restart');
  buttonStart.innerHTML = 'Restart';
  buttonStart.classList.remove('start');
}

function mooveLeft() {
  let wereMooved = false;

  for (const row of rows) {
    let previousMerged;

    for (let i = 1; i < row.children.length; i++) {
      let condition = true;
      let cell = row.children[i];
      let previousCell = cell.previousElementSibling;

      cell.classList.remove('animate');
      previousCell.classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case previousCell === null:
            condition = false;
            break;

          case previousCell.classList[3] === cell.classList[3]
          && previousMerged !== previousCell:
            previousCell.classList.add(getCurrentClass(cell));
            previousCell.classList.remove(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            previousMerged = previousCell;
            wereMooved = true;
            break;

          case previousCell.classList.length > 3:
            condition = false;
            break;

          default:
            previousCell.classList.add(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            cell = previousCell;
            previousCell = cell.previousElementSibling;
            wereMooved = true;
            break;
        }
      }
    }
  }

  return wereMooved;
}

function mooveRight() {
  let wereMooved = false;

  for (const row of rows) {
    let previousMerged;

    for (let i = row.children.length - 2; i >= 0; i--) {
      let condition = true;
      let cell = row.children[i];
      let nextCell = cell.nextElementSibling;

      cell.classList.remove('animate');
      nextCell.classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case nextCell === null:
            condition = false;
            break;

          case nextCell.classList[3] === cell.classList[3]
            && previousMerged !== nextCell:
            nextCell.classList.add(getCurrentClass(cell));
            nextCell.classList.remove(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            previousMerged = nextCell;
            wereMooved = true;
            break;

          case nextCell.classList.length > 3:
            condition = false;
            break;

          default:
            nextCell.classList.add(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            cell = nextCell;
            nextCell = cell.nextElementSibling;
            wereMooved = true;
            break;
        }
      }
    }
  }

  return wereMooved;
}

function mooveUp() {
  let wereMooved = false;

  for (const column of columns) {
    let previousMerged;

    for (let i = 1; i < column.length; i++) {
      let condition = true;
      const cell = column[i];

      cell.classList.remove('animate');
      column[i - 1].classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case column[i - 1] === undefined:
            condition = false;
            break;

          case column[i - 1].classList[3] === column[i].classList[3]
            && previousMerged !== column[i - 1]:
            column[i - 1].classList.add(getCurrentClass(column[i]));
            column[i - 1].classList.remove(column[i].classList[3]);
            column[i].classList.remove(column[i].classList[3]);
            condition = false;
            previousMerged = column[i - 1];
            wereMooved = true;
            break;

          case column[i - 1].classList.length > 3:
            condition = false;
            break;

          default:
            column[i - 1].classList.add(column[i].classList[3]);
            column[i].classList.remove(column[i].classList[3]);
            i--;
            wereMooved = true;
            break;
        }
      }
    }
  }

  return wereMooved;
}

function mooveDown() {
  let wereMooved = false;
  let previousMerged;

  for (const column of columns) {
    for (let i = column.length - 2; i >= 0; i--) {
      let condition = true;
      const cell = column[i];

      cell.classList.remove('animate');
      column[i + 1].classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case column[i + 1] === undefined:
            condition = false;
            break;

          case column[i + 1].classList[3] === column[i].classList[3]
            && previousMerged !== column[i + 1]:
            column[i + 1].classList.add(getCurrentClass(column[i]));
            column[i + 1].classList.remove(column[i].classList[3]);
            column[i].classList.remove(column[i].classList[3]);
            condition = false;
            // i = column.length;
            previousMerged = column[i + 1];
            wereMooved = true;
            break;

          case column[i + 1].classList.length > 3:
            condition = false;
            // i = -1;
            break;

          default:
            column[i + 1].classList.add(column[i].classList[3]);
            column[i].classList.remove(column[i].classList[3]);
            i++;
            wereMooved = true;
            break;
        }
      }
    }
  }

  return wereMooved;
}

function getStarted() {
  let columnIndex = 1;

  for (let i = 0; i < cells.length; i++) {
    cells[i].className = 'field-cell column';

    if (columnIndex <= 4) {
      cells[i].classList.add(`column-${columnIndex}`);
      columnIndex++;
    }

    if (columnIndex >= 5) {
      columnIndex = 1;
    }
  }
}

function getCurrentClass(cell) {
  const currentClass = cell.classList[cell.classList.length - 1].split('');
  const position = currentClass.lastIndexOf('-');
  const index = currentClass.slice(position + 1, currentClass.length).join('');

  let score = +gameScore.innerHTML;

  score += +index * 2;

  if (index * 2 === 2048) {
    messageWin.classList.remove('hidden');
  }

  gameScore.innerHTML = score;

  return 'field-cell--' + index * 2;
}

function addRandomToEmpty(wereMooved) {
  const emptyCell = [];

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].classList.length < 4) {
      emptyCell.push(cells[i]);
    }
  }

  isThereMoove(emptyCell.length);

  if (!wereMooved) {
    return;
  }

  const index = Math.floor(Math.random() * (emptyCell.length));
  const min = 1;
  const max = 100;
  const number = Math.floor(min + Math.random() * (max + 1 - min));

  const twoOrfour = number >= 91 ? 'field-cell--4' : 'field-cell--2';

  emptyCell[index].classList.add(twoOrfour);
  emptyCell[index].classList.add('animate');
}

function isThereMoove(isThereEmptyCells) {
  let mooves = 0;
  const lastCellInRowArray = [3, 7, 11];

  for (let i = 0; i < cells.length; i++) {
    const nextCell = cells[i + 1] ? cells[i + 1] : cells[cells.length - 2];

    if (mooves === 0
        & !lastCellInRowArray.includes(i)
        & cells[i].classList[3] === nextCell.classList[3]) {
      mooves++;
      break;
    }

    if (mooves === 0
        & i < 12
        && cells[i].classList[3] === cells[i + 4].classList[3]) {
      mooves++;
      break;
    }
  }

  if (!mooves & !isThereEmptyCells) {
    messageEndGame.classList.remove('hidden');
  }
}
