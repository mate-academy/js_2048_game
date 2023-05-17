'use strict';

const start = document.querySelector('.start');
const fieldCell = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const arrayCell = [...fieldCell];
let secondClick = false;

function checkGameOver(action) {
  const checkEmptyCell = arrayCell.filter(cell => !cell.textContent).length;

  if (!action && !checkEmptyCell) {
    messageLose.classList.toggle('hidden');
  }
}

function checkGameWin() {
  if (arrayCell.find(cell => cell.textContent === '2048')) {
    messageWin.classList.toggle('hidden');
  }
}

function resetCellAndScore() {
  arrayCell.map(cell => {
    cell.textContent = null;
    cell.className = 'field-cell';
  });
  gameScore.textContent = 0;
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
  messageWin.classList.add('hidden');

  addNewNumberOnField(getRandomNumber(15));
  addNewNumberOnField(getRandomNumber(15));
}

function addNumber(checkedCell, currentCell) {
  const numb = +arrayCell[currentCell].textContent;
  const sumNumb = numb + numb;

  gameScore.textContent = +gameScore.textContent + sumNumb;

  arrayCell[checkedCell].textContent = sumNumb;
  arrayCell[checkedCell].classList.toggle(arrayCell[currentCell].classList[1]);
  arrayCell[checkedCell].classList.add(`field-cell--${sumNumb}`);

  arrayCell[currentCell].className = 'field-cell';
  arrayCell[currentCell].textContent = null;
}

function movingCeill(checkedCell, currentCell) {
  const numb = +arrayCell[currentCell].textContent;

  arrayCell[checkedCell].textContent = numb;
  arrayCell[checkedCell].classList.toggle(arrayCell[currentCell].classList[1]);

  arrayCell[currentCell].className = 'field-cell';
  arrayCell[currentCell].textContent = null;
}

function addOrMoveCeill(checkedCellInFunction, currentCell) {
  if (!arrayCell[checkedCellInFunction].textContent) {
    movingCeill(checkedCellInFunction, currentCell);

    return 'moving';
  }

  if (arrayCell[checkedCellInFunction].textContent
    === arrayCell[currentCell].textContent) {
    addNumber(checkedCellInFunction, currentCell);

    return 'add';
  }
}

function downSwipe() {
  let checkedCell = 12;
  let currentCell = 8;
  let someAction = false;

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    checkedCell += indexColumn;
    currentCell += indexColumn;

    for (let indexCell = currentCell; indexCell >= 0; indexCell -= 4) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          someAction = true;
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell -= 4;
          someAction = true;
          continue;
        } else {
          if (indexCell - 3 > 0 && ((indexCell - 7) < 0)) {
            if (checkedCell - 4 !== indexCell) {
              checkedCell -= 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          if (indexCell - 4 < 0) {
            if (checkedCell - 4 !== indexCell) {
              checkedCell -= 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          checkedCell -= 4;
        }
      }
    }
    checkedCell = 12;
    currentCell = 8;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }

  checkGameWin();
  checkGameOver(someAction);
  someAction = false;
}

function upSwipe() {
  let checkedCell = 0;
  let currentCell = 4;
  let someAction = false;

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    checkedCell += indexColumn;
    currentCell += indexColumn;

    for (let indexCell = currentCell; indexCell < 16; indexCell += 4) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          someAction = true;
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell += 4;
          someAction = true;
          continue;
        } else {
          if (indexCell - 7 > 0 && ((indexCell - 12) < 0)) {
            if (checkedCell + 4 !== indexCell) {
              checkedCell += 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          if (indexCell - 11 > 0) {
            if (checkedCell + 4 !== indexCell) {
              checkedCell += 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          checkedCell += 4;
        }
      }
    }
    checkedCell = 0;
    currentCell = 4;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }

  checkGameWin();
  checkGameOver(someAction);
  someAction = false;
}

function rightSwipe() {
  let checkedCell = 3;
  let currentCell = 2;
  let someAction = false;

  for (let indexRow = 0; indexRow < 16; indexRow += 4) {
    checkedCell += indexRow;
    currentCell += indexRow;

    for (let indexCell = currentCell; (indexCell + 1) % 4 !== 0; indexCell--) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          someAction = true;
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell -= 1;
          someAction = true;
          continue;
        } else {
          if ([1, 5, 9, 13].includes(indexCell)) {
            if (checkedCell - 1 !== indexCell) {
              checkedCell -= 1;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          if ([0, 4, 8, 12].includes(indexCell)) {
            if (checkedCell - 1 !== indexCell) {
              checkedCell -= 1;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              someAction = true;
              continue;
            }
          }

          checkedCell -= 1;
        }
      }
    }
    checkedCell = 3;
    currentCell = 2;
  }

  if (someAction) {
    addNewNumberOnField(getRandomNumber(15));
  }
  checkGameWin();
  checkGameOver(someAction);
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

  checkGameWin();
  checkGameOver(someAction);

  someAction = false;
}
