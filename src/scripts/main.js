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

      cell.classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case cell.previousElementSibling === null:
            condition = false;
            break;

          case cell.previousElementSibling.classList[3] === cell.classList[3]
          && previousMerged !== cell.previousElementSibling:
            cell.previousElementSibling.classList.add(getCurrentClass(cell));
            cell.previousElementSibling.classList.remove(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            previousMerged = cell.previousElementSibling;
            wereMooved = true;
            break;

          case cell.previousElementSibling.classList.length > 3:
            condition = false;
            break;

          default:
            cell.previousElementSibling.classList.add(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            cell = cell.previousElementSibling;
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

      cell.classList.remove('animate');

      if (cell.classList.length < 4) {
        continue;
      }

      while (condition) {
        switch (true) {
          case cell.nextElementSibling === null:
            condition = false;
            break;

          case cell.nextElementSibling.classList[3] === cell.classList[3]
            && previousMerged !== cell.nextElementSibling:
            cell.nextElementSibling.classList.add(getCurrentClass(cell));
            cell.nextElementSibling.classList.remove(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            previousMerged = cell.nextElementSibling;
            wereMooved = true;
            break;

          case cell.nextElementSibling.classList.length > 3:
            condition = false;
            break;

          default:
            cell.nextElementSibling.classList.add(cell.classList[3]);
            cell.classList.remove(cell.classList[3]);
            cell = cell.nextElementSibling;
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
    for (let i = column.length - 1; i >= 0; i--) {
      let condition = true;
      const cell = column[i];

      cell.classList.remove('animate');

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

  cells.forEach(cell => {
    if (cell.classList.length < 4) {
      emptyCell.push(cell);
    }
  });

  if (emptyCell.length === 0) {
    messageEndGame.classList.remove('hidden');
  }

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
