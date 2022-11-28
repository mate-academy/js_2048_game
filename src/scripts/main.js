/* eslint-disable no-shadow */
'use strict';

const cellsField = document.querySelector('.cells-field');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
let start = false;
let win = false;
let lose = false;

startButton.addEventListener('click', () => {
  start = true;
  messageStart.classList.add('hidden');
  startButton.classList.add('restart');
  startButton.classList.remove('start');
  startButton.textContent = 'Restart';
  createNewCell();
  createNewCell();
});

document.querySelector('.button').addEventListener('click', () => {
  if (document.querySelector('.button').classList.contains('restart')) {
    document.querySelector('.button').blur();
    [...document.querySelectorAll('.cell-position')].map(cell => cell.remove());
    gameScore.textContent = 0;
    createNewCell();
    createNewCell();
  }
});

window.addEventListener('keyup', (event) => {
  if (start) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      .includes(event.key)) {
      makeStep(event.key);

      setTimeout(() => {
        createNewCell();
      }, 250);
    }
  }

  if (lose) {
    messageLose.classList.remove('hidden');
  }

  if (win) {
    messageWin.classList.remove('hidden');
  }
});

function getNumberPositionOfCell(element) {
  const cellClassName = element.className;
  const cellClassPosition = cellClassName.split(' ')
    .find(cellClass => cellClass.includes('cell-position--'));
  let positionNumber;

  if (cellClassPosition.length === 16) {
    positionNumber = cellClassPosition.slice(-1);
  } else {
    positionNumber = cellClassPosition.slice(-2);
  }

  return +positionNumber;
}

function getFilledCellsPosition() {
  const cellsPositionArray = [...document.querySelectorAll('.cell-position')];
  const filledPositions = cellsPositionArray.map(cellEl => {
    return getNumberPositionOfCell(cellEl);
  });

  return filledPositions;
};

function getNewStartValue() {
  let randomValue;

  const probabilityNumber = Math.floor(Math.random() * 11);

  if (probabilityNumber >= 9) {
    randomValue = 4;
  } else {
    randomValue = 2;
  }

  return randomValue;
};

function createNewCell() {
  let position;

  function getCellPosition() {
    const randomPosition = Math.floor(Math.random() * (16 - 1 + 1)) + 1;

    if (!getFilledCellsPosition().includes(randomPosition)) {
      position = randomPosition;
    }
  }

  while ((position === undefined && cellsField.childElementCount < 16)) {
    getCellPosition();
  }

  if (position === undefined) {
    lose = true;
    start = false;

    return;
  }

  const newValue = getNewStartValue();

  const newCell = `
  <div
    class="cell cell--${newValue} cell-position cell-position--${position}"
  >${newValue}</div>
  `;

  cellsField.insertAdjacentHTML('afterbegin', newCell);
}

function makeStep(key) {
  const cellsPositionArray = [...document.querySelectorAll('.cell-position')];

  function processindKeyPress(keyType) {
    switch (keyType) {
      case 'ArrowDown':
        cellsPositionArray
          .sort((el1, el2) =>
            getNumberPositionOfCell(el2) - getNumberPositionOfCell(el1))
          .forEach(cell => {
            if (!cell.className.includes('cell-position--')) {
              return;
            };

            const cellPositionNumber = getNumberPositionOfCell(cell);

            if ([9, 10, 11, 12].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(4, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 4);
                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 4, cellPositionNumber);

                return;
              }
            }

            if ([5, 6, 7, 8].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(4, true, cellPositionNumber)
                && getConditionalForCellMove(8, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 4);
                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)
                && getConditionalForCellMove(8, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  8,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 8);
                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 4, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)
                && getConditionalForCellMove(8, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 8, cellPositionNumber);

                return;
              }
            }

            if ([1, 2, 3, 4].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(4, true, cellPositionNumber)
                && getConditionalForCellMove(8, true, cellPositionNumber)
                && getConditionalForCellMove(12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 4);
                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)
                && getConditionalForCellMove(8, true, cellPositionNumber)
                && getConditionalForCellMove(12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  8,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 8);
                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 4, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)
                && getConditionalForCellMove(8, false, cellPositionNumber)
                && getConditionalForCellMove(12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  12,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 12);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 8, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(4, false, cellPositionNumber)
                && getConditionalForCellMove(8, false, cellPositionNumber)
                && getConditionalForCellMove(12, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 12, cellPositionNumber);
              }
            }
          });
        break;

      case 'ArrowUp':
        cellsPositionArray.sort(
          (el1, el2) =>
            getNumberPositionOfCell(el1) - getNumberPositionOfCell(el2)
        )
          .forEach(cell => {
            if (!cell.className.includes('cell-position--')) {
              return;
            };

            const cellPositionNumber = getNumberPositionOfCell(cell);

            if ([5, 6, 7, 8].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-4, true, cellPositionNumber)) {
                const nexCell = getNextColumnCell(
                  -4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nexCell.textContent === cell.textContent) {
                  if (!nexCell.classList.contains('merged')) {
                    changedCell(cell, nexCell, cellPositionNumber, -4);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -4, cellPositionNumber);

                return;
              }
            }

            if ([9, 10, 11, 12].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-4, true, cellPositionNumber)
                  && getConditionalForCellMove(-8, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -4);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)
                && getConditionalForCellMove(-8, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -8,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -8);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -4, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)
                && getConditionalForCellMove(-8, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -8, cellPositionNumber);

                return;
              }
            }

            if ([13, 14, 15, 16].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-4, true, cellPositionNumber)
                && getConditionalForCellMove(-8, true, cellPositionNumber)
                && getConditionalForCellMove(-12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -4,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -4);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)
                && getConditionalForCellMove(-8, true, cellPositionNumber)
                && getConditionalForCellMove(-12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -8,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -8);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -4, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)
                && getConditionalForCellMove(-8, false, cellPositionNumber)
                && getConditionalForCellMove(-12, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -12,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -12);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -8, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-4, false, cellPositionNumber)
                && getConditionalForCellMove(-8, false, cellPositionNumber)
                && getConditionalForCellMove(-12, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -12, cellPositionNumber);
              }
            }
          });
        break;

      case 'ArrowRight':
        cellsPositionArray.sort(
          (el1, el2) =>
            getNumberPositionOfCell(el2) - getNumberPositionOfCell(el1)
        )
          .forEach(cell => {
            if (!cell.className.includes('cell-position--')) {
              return;
            };

            const cellPositionNumber = getNumberPositionOfCell(cell);

            if ([3, 7, 11, 15].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(1, true, cellPositionNumber)) {
                const nexCell = getNextColumnCell(
                  1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nexCell.textContent === cell.textContent) {
                  if (!nexCell.classList.contains('merged')) {
                    changedCell(cell, nexCell, cellPositionNumber, 1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 1, cellPositionNumber);

                return;
              }
            }

            if ([2, 6, 10, 14].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(1, true, cellPositionNumber)
            && getConditionalForCellMove(2, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)
                && getConditionalForCellMove(2, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  2,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 2);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 1, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)
                && getConditionalForCellMove(2, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 2, cellPositionNumber);
              }
            }

            if ([1, 5, 9, 13].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(1, true, cellPositionNumber)
                && getConditionalForCellMove(2, true, cellPositionNumber)
                && getConditionalForCellMove(3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)
                && getConditionalForCellMove(2, true, cellPositionNumber)
                && getConditionalForCellMove(3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  2,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 2);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 1, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)
                && getConditionalForCellMove(2, false, cellPositionNumber)
                && getConditionalForCellMove(3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  3,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, 3);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, 2, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(1, false, cellPositionNumber)
                && getConditionalForCellMove(2, false, cellPositionNumber)
                && getConditionalForCellMove(3, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, 3, cellPositionNumber);
              }
            }
          });
        break;

      case 'ArrowLeft':
        cellsPositionArray.sort(
          (el1, el2) =>
            getNumberPositionOfCell(el1) - getNumberPositionOfCell(el2)
        )
          .forEach(cell => {
            if (!cell.className.includes('cell-position--')) {
              return;
            };

            const cellPositionNumber = getNumberPositionOfCell(cell);

            if ([2, 6, 10, 14].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-1, true, cellPositionNumber)) {
                const nexCell = getNextColumnCell(
                  -1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nexCell.textContent === cell.textContent) {
                  if (!nexCell.classList.contains('merged')) {
                    changedCell(cell, nexCell, cellPositionNumber, -1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -1, cellPositionNumber);

                return;
              }
            }

            if ([3, 7, 11, 15].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-1, true, cellPositionNumber)
                  && getConditionalForCellMove(-2, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)
                && getConditionalForCellMove(-2, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -2,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -2);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -1, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)
                && getConditionalForCellMove(-2, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -2, cellPositionNumber);

                return;
              }
            }

            if ([4, 8, 12, 16].includes(cellPositionNumber)) {
              if (getConditionalForCellMove(-1, true, cellPositionNumber)
                && getConditionalForCellMove(-2, true, cellPositionNumber)
                && getConditionalForCellMove(-3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -1,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -1);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)
                && getConditionalForCellMove(-2, true, cellPositionNumber)
                && getConditionalForCellMove(-3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -2,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -2);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -1, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)
                && getConditionalForCellMove(-2, false, cellPositionNumber)
                && getConditionalForCellMove(-3, true, cellPositionNumber)) {
                const nextCell = getNextColumnCell(
                  -3,
                  cellsPositionArray,
                  cellPositionNumber
                );

                if (nextCell.textContent === cell.textContent) {
                  if (!nextCell.classList.contains('merged')) {
                    changedCell(cell, nextCell, cellPositionNumber, -3);

                    cell.classList.add('merged');

                    gameScore.textContent = +gameScore.textContent
                      + (+cell.textContent);

                    return;
                  }
                }

                addedAndRemoveClassForCell(cell, -2, cellPositionNumber);

                return;
              }

              if (getConditionalForCellMove(-1, false, cellPositionNumber)
                && getConditionalForCellMove(-2, false, cellPositionNumber)
                && getConditionalForCellMove(-3, false, cellPositionNumber)) {
                addedAndRemoveClassForCell(cell, -3, cellPositionNumber);
              }
            }
          });
        break;
    }
  }

  processindKeyPress(key);
  removeMargedClass();

  win = cellsPositionArray.some(el => el.textContent === '2048');
}

function changedCell(
  element,
  nextElement,
  position,
  step
) {
  element.classList
    .remove(`cell-position--${position}`, `cell--${element.innerText}`);
  nextElement.classList.remove(`cell-position--${position + step}`);

  element.classList.add(
    `cell-position--${position + step}`,
    `cell--${+element.innerText * 2}`
  );
  element.innerHTML = `${+element.innerText * 2}`;
  nextElement.remove();
}

function getConditionalForCellMove(
  nextCellPosition,
  isNextCellOccupied,
  position
) {
  const filledPositions = getFilledCellsPosition();

  if (isNextCellOccupied) {
    return filledPositions.includes(position + nextCellPosition);
  } else {
    return !(filledPositions.includes(position + nextCellPosition));
  }
}

function addedAndRemoveClassForCell(element, positionStep, position) {
  element.classList.remove(`cell-position--${position}`);
  element.classList.add(`cell-position--${position + positionStep}`);
}

function getNextColumnCell(step, positionArray, position) {
  const nextCell = positionArray
    .find(cellValue =>
      cellValue.classList.contains(`cell-position--${position + step}`));

  return nextCell;
}

function removeMargedClass() {
  const cellsPositionArray = [...document.querySelectorAll('.cell-position')];

  return cellsPositionArray.map(cell => cell.classList.remove('merged'));
}
