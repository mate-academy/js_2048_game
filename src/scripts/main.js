'use strict';

const start = document.querySelector('.start');
const fieldCell = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const arrayCell = [...fieldCell];
let secondClick = false;
const actionInSwipe = {
  down: false,
  up: false,
  right: false,
  left: false,
};

const arrowCases = {
  down: 'ArrowDown',
  up: 'ArrowUp',
  right: 'ArrowRight',
  left: 'ArrowLeft',
};

function updateActions() {
  for (const swipe in actionInSwipe) {
    actionInSwipe[swipe] = true;
  }
}

function checkGameOver() {
  const checkEmptyCell = arrayCell.filter(cell => !cell.textContent).length;

  function checkSomeAction() {
    for (const swipe in actionInSwipe) {
      if (actionInSwipe[swipe]) {
        return true;
      };
    }

    return false;
  }

  if (!checkSomeAction() && !checkEmptyCell) {
    messageLose.classList.remove('hidden');
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

function addNewNumberOnField(numberCeill, actionRemove) {
  const randomNumber = getRandomNumber(4) === 4 ? 4 : 2;
  const checkEmptyCell = arrayCell.filter(cell => !cell.textContent).length;

  if (checkEmptyCell) {
    if (!arrayCell[numberCeill].textContent) {
      arrayCell[numberCeill].textContent = randomNumber;
      arrayCell[numberCeill].classList.add(`field-cell--${randomNumber}`);
    } else {
      addNewNumberOnField(getRandomNumber(15));
    }
  } else {
    actionInSwipe[actionRemove] = false;
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
    case arrowCases.down:
      downSwipe();
      break;
    case arrowCases.up:
      upSwipe();
      break;
    case arrowCases.right:
      rightSwipe();
      break;
    case arrowCases.left:
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

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    checkedCell += indexColumn;
    currentCell += indexColumn;

    for (let indexCell = currentCell; indexCell >= 0; indexCell -= 4) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          updateActions();
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell -= 4;
          updateActions();
          continue;
        } else {
          if (indexCell - 3 > 0 && ((indexCell - 7) < 0)) {
            if (checkedCell - 4 !== indexCell) {
              checkedCell -= 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
              continue;
            }
          }

          if (indexCell - 4 < 0) {
            if (checkedCell - 4 !== indexCell) {
              checkedCell -= 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
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

  if (actionInSwipe.down) {
    addNewNumberOnField(getRandomNumber(15), 'down');
  }

  checkGameOver();
  checkGameWin();
}

function upSwipe() {
  let checkedCell = 0;
  let currentCell = 4;

  for (let indexColumn = 0; indexColumn < 4; indexColumn++) {
    checkedCell += indexColumn;
    currentCell += indexColumn;

    for (let indexCell = currentCell; indexCell < 16; indexCell += 4) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          updateActions();
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell += 4;
          updateActions();
          continue;
        } else {
          if (indexCell - 7 > 0 && ((indexCell - 12) < 0)) {
            if (checkedCell + 4 !== indexCell) {
              checkedCell += 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
              continue;
            }
          }

          if (indexCell - 11 > 0) {
            if (checkedCell + 4 !== indexCell) {
              checkedCell += 4;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
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

  if (actionInSwipe.up) {
    addNewNumberOnField(getRandomNumber(15), 'up');
  }

  checkGameOver();
  checkGameWin();
}

function rightSwipe() {
  let checkedCell = 3;
  let currentCell = 2;

  for (let indexRow = 0; indexRow < 16; indexRow += 4) {
    checkedCell += indexRow;
    currentCell += indexRow;

    for (let indexCell = currentCell; (indexCell + 1) % 4 !== 0; indexCell--) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[checkedCell].textContent) {
          movingCeill(checkedCell, indexCell);
          updateActions();
          continue;
        }

        if (arrayCell[checkedCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(checkedCell, indexCell);
          checkedCell -= 1;
          updateActions();
          continue;
        } else {
          if ([1, 5, 9, 13].includes(indexCell)) {
            if (checkedCell - 1 !== indexCell) {
              checkedCell -= 1;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
              continue;
            }
          }

          if ([0, 4, 8, 12].includes(indexCell)) {
            if (checkedCell - 1 !== indexCell) {
              checkedCell -= 1;
            }

            if (addOrMoveCeill(checkedCell, indexCell)) {
              updateActions();
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

  if (actionInSwipe.right) {
    addNewNumberOnField(getRandomNumber(15), 'right');
  }

  checkGameOver();
  checkGameWin();
}

function leftSwipe() {
  let comprativeCell = 0;
  let currentCell = 1;

  for (let indexRow = 0; indexRow < 16; indexRow += 4) {
    comprativeCell += indexRow;
    currentCell += indexRow;

    for (let indexCell = currentCell; indexCell % 4 !== 0; indexCell++) {
      if (arrayCell[indexCell].textContent) {
        if (!arrayCell[comprativeCell].textContent) {
          movingCeill(comprativeCell, indexCell);
          updateActions();
          continue;
        }

        if (arrayCell[comprativeCell].textContent
          === arrayCell[indexCell].textContent) {
          addNumber(comprativeCell, indexCell);
          comprativeCell += 1;
          updateActions();
          continue;
        } else {
          if ([2, 6, 10, 14].includes(indexCell)) {
            if (comprativeCell + 1 !== indexCell) {
              comprativeCell += 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              updateActions();
              continue;
            }
          }

          if ([3, 7, 11, 15].includes(indexCell)) {
            if (comprativeCell + 1 !== indexCell) {
              comprativeCell += 1;
            }

            if (addOrMoveCeill(comprativeCell, indexCell)) {
              updateActions();
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

  if (actionInSwipe.left) {
    addNewNumberOnField(getRandomNumber(15), 'left');
  }
  checkGameOver();
  checkGameWin();
}
