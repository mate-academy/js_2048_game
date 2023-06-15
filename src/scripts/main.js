'use strict';

const body = document.querySelector('body');
const button = body.querySelector('.button');
const messageContainer = body.querySelector('.message-container');
const messageStart = messageContainer.querySelector('.message-start');
const messageWin = messageContainer.querySelector('.message-win');
const messageLose = messageContainer.querySelector('.message-lose');
const gameScore = body.querySelector('.game-score');

const fieldRows = [...body.querySelectorAll('.field-row')];
const fieldCells = [...document.querySelectorAll('.field-cell')];
let theSameCellsAdded = false;

button.addEventListener('click', () => {
  for (let i = 0; i < fieldCells.length; i++) {
    fieldCells[i].className = 'field-cell';
    fieldCells[i].textContent = '';
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  gameScore.textContent = 0;

  addNewCell();
  addNewCell();
});

body.addEventListener('keyup', (e) => {
  const fieldCellsAfterEvent = [...document.querySelectorAll('.field-cell')];

  if (messageStart.classList.contains('hidden')
    && messageWin.classList.contains('hidden')
    && messageLose.classList.contains('hidden')) {
    const columnCells = [];

    for (let i = fieldRows.length; i > 0; i--) {
      columnCells
        .push(fieldCellsAfterEvent.filter((_, index) => (index + i) % 4 === 0));
    }

    switch (e.key) {
      case 'ArrowUp':
        const needAddUp = needAddNewCell(columnCells, e.key);

        for (let i = 0; i < columnCells.length; i++) {
          addCells(columnCells[i], e.key);
        }

        whetherToAddNewCell(needAddUp);
        break;
      case 'ArrowDown':
        const needAddDown = needAddNewCell(columnCells, e.key);

        for (let i = 0; i < columnCells.length; i++) {
          addCells(columnCells[i], e.key);
        }

        whetherToAddNewCell(needAddDown);
        break;
      case 'ArrowLeft':
        const needAddLeft = needAddNewCell(fieldRows, e.key);

        for (let iRow = 0; iRow < fieldRows.length; iRow++) {
          addCells([...fieldRows[iRow].children], e.key, iRow);
        }

        whetherToAddNewCell(needAddLeft);
        break;
      case 'ArrowRight':
        const needAddRigth = needAddNewCell(fieldRows, e.key);

        for (let iRow = 0; iRow < fieldRows.length; iRow++) {
          addCells([...fieldRows[iRow].children], e.key, iRow);
        }

        whetherToAddNewCell(needAddRigth);
        break;
    }
  }

  if (body.querySelector('.field-cell--2048')) {
    messageWin.classList.remove('hidden');
  }

  function whetherToAddNewCell(check) {
    if (theSameCellsAdded || check) {
      addNewCell();
      theSameCellsAdded = false;
    }
  }
});

function addNewCell() {
  let startCell = '';

  do {
    startCell = fieldCells[Math.floor(Math.random() * fieldCells.length)];
  } while (startCell.classList.length !== 1);

  if (Math.random() > 0.9) {
    startCell.classList.add('field-cell--4');
    startCell.textContent = '4';
  } else {
    startCell.classList.add('field-cell--2');
    startCell.textContent = '2';
  }

  endGameCheck();
}

function endGameCheck() {
  const allCellsFilled = fieldCells.every(item => item.classList.length === 2);
  let notTheSameNeighbors = true;

  for (let i = 0; i < fieldRows.length; i++) {
    for (let iInner = 0; iInner < fieldRows[i].children.length; iInner++) {
      if (fieldRows[i].children[iInner].nextElementSibling) {
        if (fieldRows[i]
          .children[iInner].textContent === fieldRows[i]
          .children[iInner].nextElementSibling.textContent) {
          notTheSameNeighbors = false;
        }
      }

      if (i < 3) {
        if (fieldRows[i]
          .children[iInner].textContent === fieldRows[i + 1]
          .children[iInner].textContent) {
          notTheSameNeighbors = false;
        }
      }
    }
  }

  if (allCellsFilled && notTheSameNeighbors) {
    messageLose.classList.remove('hidden');
  }
}

function addCells(sacrifice, direction, indexRow) {
  switch (direction) {
    case 'ArrowUp':
    case 'ArrowLeft':
      sortCells(sacrifice);
      break;

    case 'ArrowDown':
    case 'ArrowRight':
      sacrifice.reverse();
      sortCells(sacrifice);
      sacrifice.reverse();
      break;
  }

  switch (direction) {
    case 'ArrowUp':
    case 'ArrowDown':
      for (let i = 0; i < sacrifice.length; i++) {
        fieldRows[i].append(sacrifice[i]);
      }
      break;

    case 'ArrowLeft':
    case 'ArrowRight':
      for (let i = 0; i < sacrifice.length; i++) {
        fieldRows[indexRow].append(sacrifice[i]);
      }
      break;
  }

  function sortCells(array) {
    array.sort((a, b) => {
      if (!a.textContent) {
        return 1;
      }

      if (!b.textContent) {
        return -1;
      }

      const aMerged = a.getAttribute('data-merged') === 'true';
      const bMerged = b.getAttribute('data-merged') === 'true';

      if (a.textContent === b.textContent && !aMerged && !bMerged) {
        a.classList.remove(`field-cell--${a.textContent}`);
        a.textContent = '';
        b.classList.remove(`field-cell--${b.textContent}`);
        b.textContent = (parseInt(b.textContent) * 2).toString();
        b.classList.add(`field-cell--${b.textContent}`);
        b.setAttribute('data-merged', 'true');
        theSameCellsAdded = true;
        gameScore.textContent = +gameScore.textContent + +b.textContent;
      } else {
        a.setAttribute('data-merged', 'false');
        b.setAttribute('data-merged', 'false');
      }

      return 0;
    });
  }
}

function needAddNewCell(arrayRow, direction) {
  return arrayRow.some(item => {
    switch (direction) {
      case 'ArrowLeft':
        for (let i = item.children.length - 1; i > 0; i--) {
          return item.children[i].textContent
          && !item.children[i - 1].textContent;
        }
        break;

      case 'ArrowRight':
        for (let i = 0; i < item.children.length - 1; i++) {
          if (item.children[i].textContent
            && !item.children[i + 1].textContent) {
            return true;
          }
        }
        break;

      case 'ArrowUp':
        for (let i = item.length - 1; i > 0; i--) {
          if (item[i].textContent && !item[i - 1].textContent) {
            return true;
          }
        }
        break;

      case 'ArrowDown':
        for (let i = 0; i < item.length - 1; i++) {
          if (item[i].textContent && !item[i + 1].textContent) {
            return true;
          }
        }
        break;
    }
  });
}
