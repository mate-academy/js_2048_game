'use strict';

const start = document.querySelector('.start');
const fieldCell = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const arrayCell = [...fieldCell];
let secondClick = false;

function returnGameOver(action) {
  const checkEmptyCell = arrayCell.filter(cell => !cell.textContent).length;

  if (!action && !checkEmptyCell) {
    messageLose.classList.toggle('hidden');
  }
}

function resetCellAndScore() {
  arrayCell.map(cell => {
    cell.textContent = null;
    cell.className = 'field-cell';
  });
  gameScore.textContent = 0;
}

start.addEventListener('click', () => {
  if (secondClick) {
    resetCellAndScore();
  }

  startGame();
});

document.addEventListener('keydown', (e) => {
  if (start.textContent === 'Start') {
    start.classList.add('restart');
    start.textContent = 'Restart';
    start.style.fontSize = '18px';
  }

  switch (e.key) {
    case 'ArrowDown':
      downSwipe();
      break;
    case 'ArrowUp':
      upSwipe();
      break;
    case 'ArrowRight':
      rightSwipe();
      break;
    case 'ArrowLeft':
      leftSwipe();
      break;

    default:
      break;
  }
});

function startGame() {
  secondClick = true;
  messageStart.classList.add('hidden');
  start.classList.toggle('.restart');
  messageLose.classList.add('hidden');

  const randomNumb = getRandomNumber(15);

  addNewNumberOnField(randomNumb);
  addNewNumberOnField(randomNumb);
}

function addNumber(row, cell) {
  const numb = +arrayCell[cell].textContent;
  const sumNumb = numb + numb;

  gameScore.textContent = +gameScore.textContent + sumNumb;

  arrayCell[row].textContent = sumNumb;
  arrayCell[row].classList.toggle(arrayCell[cell].classList[1]);
  arrayCell[row].classList.add(`field-cell--${sumNumb}`);

  arrayCell[cell].className = 'field-cell';
  arrayCell[cell].textContent = null;
}

function movingCeill(col, cell) {
  const numb = +arrayCell[cell].textContent;

  arrayCell[col].textContent = numb;
  arrayCell[col].classList.toggle(arrayCell[cell].classList[1]);

  arrayCell[cell].className = 'field-cell';
  arrayCell[cell].textContent = null;
}

function addOrMoveCeill(comprativeRowInFuction, ceil) {
  if (!arrayCell[comprativeRowInFuction].textContent) {
    movingCeill(comprativeRowInFuction, ceil);

    return 'moving';
  }

  if (arrayCell[comprativeRowInFuction].textContent
    === arrayCell[ceil].textContent) {
    addNumber(comprativeRowInFuction, ceil);

    return 'add';
  }
}

function downSwipe() {
  let comprativeRow = 12;
  let currentRow = 8;
  let someAction = false;

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    comprativeRow += indexColumn;
    currentRow += indexColumn;

    for (let indexRow = currentRow; indexRow >= 0; indexRow -= 4) {
      if (arrayCell[indexRow].textContent) {
        if (!arrayCell[comprativeRow].textContent) {
          movingCeill(comprativeRow, indexRow);
          someAction = true;
          continue;
        }

        if (arrayCell[comprativeRow].textContent
          === arrayCell[indexRow].textContent) {
          addNumber(comprativeRow, indexRow);
          comprativeRow -= 4;
          someAction = true;
          continue;
        } else {
          if (indexRow - 3 > 0 && ((indexRow - 7) < 0)) {
            if (comprativeRow - 4 !== indexRow) {
              comprativeRow -= 4;
            }

            if (addOrMoveCeill(comprativeRow, indexRow)) {
              someAction = true;
              continue;
            }
          }

          if (indexRow - 4 < 0) {
            if (comprativeRow - 4 !== indexRow) {
              comprativeRow -= 4;
            }

            if (addOrMoveCeill(comprativeRow, indexRow)) {
              someAction = true;
              continue;
            }
          }

          comprativeRow -= 4;
        }
      }
    }
    comprativeRow = 12;
    currentRow = 8;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }
  returnGameOver(someAction);
  someAction = false;
}

function upSwipe() {
  let comprativeRow = 0;
  let currentRow = 4;
  let someAction = false;

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    comprativeRow += indexColumn;
    currentRow += indexColumn;

    for (let indexRow = currentRow; indexRow < 16; indexRow += 4) {
      if (arrayCell[indexRow].textContent) {
        if (!arrayCell[comprativeRow].textContent) {
          movingCeill(comprativeRow, indexRow);
          someAction = true;
          continue;
        }

        if (arrayCell[comprativeRow].textContent
          === arrayCell[indexRow].textContent) {
          addNumber(comprativeRow, indexRow);
          comprativeRow += 4;
          someAction = true;
          continue;
        } else {
          if (indexRow - 7 > 0 && ((indexRow - 12) < 0)) {
            if (comprativeRow + 4 !== indexRow) {
              comprativeRow += 4;
            }

            if (addOrMoveCeill(comprativeRow, indexRow)) {
              someAction = true;
              continue;
            }
          }

          if (indexRow - 11 > 0) {
            if (comprativeRow + 4 !== indexRow) {
              comprativeRow += 4;
            }

            if (addOrMoveCeill(comprativeRow, indexRow)) {
              someAction = true;
              continue;
            }
          }

          comprativeRow += 4;
        }
      }
    }
    currentRow = 4;
    comprativeRow = 0;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }

  returnGameOver(someAction);
  someAction = false;
}

function rightSwipe() {
  let comprativeCell = 3;
  let currentCell = 2;
  let someAction = false;

  for (let indexRow = 0; indexRow < 16; indexRow += 4) {
    comprativeCell += indexRow;
    currentCell += indexRow;

    for (let indexCell = currentCell; (indexCell + 1) % 4 !== 0; indexCell--) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[comprativeCell].textContent) {
          movingCeill(comprativeCell, indexCell);
          someAction = true;
          continue;
        }

        if (arrayCell[comprativeCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(comprativeCell, indexCell);
          comprativeCell -= 1;
          someAction = true;
          continue;
        } else {
          if ([1, 5, 9, 13].includes(indexCell)) {
            if (comprativeCell - 1 !== indexCell) {
              comprativeCell -= 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          if ([0, 4, 8, 12].includes(indexCell)) {
            if (comprativeCell - 1 !== indexCell) {
              comprativeCell -= 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          comprativeCell -= 1;
        }
      }
    }
    comprativeCell = 3;
    currentCell = 2;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }
  returnGameOver(someAction);
  someAction = false;
}

function leftSwipe() {
  let comprativeCell = 0;
  let currentCell = 1;
  let someAction = false;

  for (let indexRow = 0; indexRow < 16; indexRow += 4) {
    comprativeCell += indexRow;
    currentCell += indexRow;

    for (let indexCell = currentCell; (indexCell + 1) % 4 !== 0; indexCell++) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[comprativeCell].textContent) {
          movingCeill(comprativeCell, indexCell);
          someAction = true;
          continue;
        }

        if (arrayCell[comprativeCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(comprativeCell, indexCell);
          comprativeCell += 1;
          someAction = true;
          continue;
        } else {
          if ([2, 6, 10, 14].includes(indexCell)) {
            if (comprativeCell + 1 !== indexCell) {
              comprativeCell += 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          if ([3, 7, 11, 15].includes(indexCell)) {
            if (comprativeCell + 1 !== indexCell) {
              comprativeCell += 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          comprativeCell += 1;
        }
      }
    }
    comprativeCell = 0;
    currentCell = 1;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }

  returnGameOver(someAction);

  someAction = false;
}

const getRandomNumber = (numb) => Math.round(Math.random() * numb);

function addNewNumberOnField(numberCeill) {
  const randomNumber = getRandomNumber(4) === 4 ? 4 : 2;

  if (!arrayCell[numberCeill].textContent) {
    arrayCell[numberCeill].textContent = randomNumber;
    arrayCell[numberCeill].classList.add(`field-cell--${randomNumber}`);
  } else {
    addNewNumberOnField(getRandomNumber(15));
  }
};
