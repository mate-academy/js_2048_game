'use strict';

// write your code here
const buttonStart = document.querySelector('button.start');
const field = document.querySelector('.game-field').tBodies[0];
const scoreField = document.querySelector('.controls .game-score');

function getEmptyCells() {
  return field.querySelectorAll('td:not([class*="field-cell--"])');
}

function getFilledCells() {
  return field.querySelectorAll('td[class*="field-cell--"]');
}

function insertRandomNumber() {
  const emptyCells = getEmptyCells();
  const randomCell = Math.floor(Math.random() * (emptyCells.length - 1));
  const randomNumber = randomWithProbability();

  emptyCells[randomCell].innerHTML = `${randomNumber}`;
  emptyCells[randomCell].classList.add(`field-cell--${randomNumber}`);
};

function randomWithProbability() {
  const numberForRandom = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const index = Math.floor(Math.random() * 10);

  return numberForRandom[index];
}

buttonStart.onclick = function() {
  insertRandomNumber();
  document.querySelector('.message-start').classList.add('hidden');
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.innerText = 'Restart';

  buttonStart.onclick = function() {
    const filledCells = getFilledCells();

    for (const cell of filledCells) {
      cell.innerText = '';
      cell.className = 'field-cell';
    };
    scoreField.innerText = '0';
    insertRandomNumber();
  };
};

document.addEventListener('keydown', (e) => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  const mergedCellsArray = [];

  let filledCells = getFilledCells();

  let emptyCells = getEmptyCells();

  switch (e.code) {
    case 'ArrowUp':
      for (const cell of filledCells) {
        const availableCell = [...emptyCells].find(td => {
          return td.cellIndex === cell.cellIndex
          && td.parentElement.rowIndex < cell.parentElement.rowIndex;
        });

        if (availableCell) {
          moveCell(availableCell, cell);
          checkIfDuplicates(availableCell);
        } else {
          checkIfDuplicates(cell);
        }
      };
      break;

    case 'ArrowDown':
      for (let i = filledCells.length - 1; i >= 0; i--) {
        const foundCells = [...emptyCells].filter(td => {
          return td.cellIndex === filledCells[i].cellIndex
          && td.parentElement.rowIndex > filledCells[i].parentElement.rowIndex;
        });

        const availableCell = foundCells[foundCells.length - 1];

        if (availableCell) {
          moveCell(availableCell, filledCells[i]);
          checkIfDuplicates(availableCell);
        } else {
          checkIfDuplicates(filledCells[i]);
        }
      };
      break;

    case 'ArrowLeft':
      for (const cell of filledCells) {
        const availableCell = [...emptyCells].find(td => {
          return td.cellIndex < cell.cellIndex
          && td.parentElement.rowIndex === cell.parentElement.rowIndex;
        });

        if (availableCell) {
          moveCell(availableCell, cell);
          checkIfDuplicates(availableCell);
        } else {
          checkIfDuplicates(cell);
        }
      };
      break;

    case 'ArrowRight':
      for (let i = filledCells.length - 1; i >= 0; i--) {
        const foundCells = [...emptyCells].filter(td => {
          return (td.cellIndex > filledCells[i].cellIndex)
          && (
            td.parentElement.rowIndex === filledCells[i].parentElement.rowIndex
          );
        });

        const availableCell = foundCells[foundCells.length - 1];

        if (availableCell) {
          moveCell(availableCell, filledCells[i]);
          checkIfDuplicates(availableCell);
        } else {
          checkIfDuplicates(filledCells[i]);
        }
      };
      break;
  }

  function moveCell(availableCell, cell) {
    availableCell.innerText = cell.innerText;
    availableCell.classList.add(`field-cell--${cell.innerText}`);
    cell.innerText = '';
    cell.className = 'field-cell';
    emptyCells = getEmptyCells();
  }

  function mergeCells(duplicateCell, cell) {
    duplicateCell.classList.remove(`field-cell--${cell.innerText}`);
    duplicateCell.innerText = `${(+cell.innerText) * 2}`;
    duplicateCell.classList.add(`field-cell--${duplicateCell.innerText}`);
    cell.innerText = '';
    cell.className = 'field-cell';

    scoreField.innerText = `
    ${+scoreField.innerText + +duplicateCell.innerText}
    `;
    mergedCellsArray.push(duplicateCell);
    emptyCells = getEmptyCells();
  }

  function checkIfDuplicates(cell) {
    switch (e.code) {
      case 'ArrowUp':
        let rowToCompare = field.rows[cell.parentElement.sectionRowIndex - 1];

        if (rowToCompare) {
          if (cell.innerText === rowToCompare.cells[cell.cellIndex].innerText
          && !(mergedCellsArray.includes(rowToCompare.cells[cell.cellIndex]))) {
            mergeCells(rowToCompare.cells[cell.cellIndex], cell);
          };
        }
        break;

      case 'ArrowDown':
        rowToCompare = field.rows[cell.parentElement.sectionRowIndex + 1];

        if (rowToCompare) {
          if (cell.innerText === rowToCompare.cells[cell.cellIndex].innerText
            && !(
              mergedCellsArray.includes(rowToCompare.cells[cell.cellIndex]
              ))) {
            mergeCells(rowToCompare.cells[cell.cellIndex], cell);
          };
        }
        break;

      case 'ArrowLeft':
        let cellToCompare = cell.parentElement.cells[cell.cellIndex - 1];

        if (cellToCompare) {
          if (cell.innerText === cellToCompare.innerText
            && !(mergedCellsArray.includes(cellToCompare))) {
            mergeCells(cellToCompare, cell);
          };
        }
        break;

      case 'ArrowRight':
        cellToCompare = cell.parentElement.cells[cell.cellIndex + 1];

        if (cellToCompare) {
          if (cell.innerText === cellToCompare.innerText
            && !(mergedCellsArray.includes(cellToCompare))) {
            mergeCells(cellToCompare, cell);
          };
        }
        break;
    }
  }
  filledCells = getFilledCells();

  const nextPossibleMove = [...filledCells].find(findNextMove);

  function findNextMove(cell) {
    emptyCells = getEmptyCells();

    if (emptyCells.length > 0) {
      return emptyCells[0];
    } else {
      return (
        (cell.innerText === field
          .rows[cell.parentElement.sectionRowIndex - 1]
          .cells[cell.cellIndex].innerText)
        || (cell.innerText === field
          .rows[cell.parentElement.sectionRowIndex + 1]
          .cells[cell.cellIndex].innerText)
        || (cell.innerText === cell
          .parentElement.cells[cell.cellIndex - 1].innerText)
        || (cell.innerText === cell
          .parentElement.cells[cell.cellIndex + 1].innerText)
      );
    }
  }

  if (!nextPossibleMove) {
    document.querySelector('.message-lose').classList.remove('hidden');

    return;
  }

  if (field.querySelector('.field-cell--2048')) {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  // The move is possible if at least one cell is changed after the move
  // emptyCells = getEmptyCells();

  // if (emptyCells.length === 0) {
  //   document.querySelector('.message-lose').classList.remove('hidden');

  //   return;
  // };

  insertRandomNumber();

  e.preventDefault();
});
