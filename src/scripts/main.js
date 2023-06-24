'use strict';

const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const restartMessage = document.querySelector('.message-restart');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const cells = document.querySelectorAll('.field-cell');
const cellArr = [ ...cells ];
const gameScore = document.querySelector('.game-score');
const finalScore = '2048';
let freeCells = [];
let occupiedCells;
let accessToMoveUp;
let accessToMoveDown;
let accessToMoveRight;
let accessToMoveLeft;
let scoreNum;
let startX;
let startY;
// Directions Object
const Directions = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

// cells creator
function createNewCell() {
  const cellNum = Math.floor(Math.random() * freeCells.length);

  freeCells[cellNum].classList.add('field-cell--2');
  freeCells[cellNum].innerText = 2;

  occupiedCells.push(freeCells[cellNum]);

  freeCells.splice(cellNum, 1);
}

//  checker for free cells
function cellsChecker() {
  freeCells = [];
  occupiedCells = [];

  cellArr.forEach(cell => {
    if (cell.textContent === '') {
      freeCells.push(cell);
    } else {
      occupiedCells.push(cell);
    }
  });
}

// checker for access
function accessChecker() {
  return !accessToMoveUp && !accessToMoveDown
  && !accessToMoveRight && !accessToMoveLeft;
}

function handleTouchStart(e) {
  startX = e.pageX || e.touches[0].pageX;
  startY = e.pageY || e.touches[0].pageY;
}

function handleTouchMove(e) {
  if (!startX || !startY) {
    return;
  }

  if (cellArr.length === occupiedCells.length
    && accessChecker()) {
    accessToMoveUp = false;
    accessToMoveDown = false;
    accessToMoveRight = false;
    accessToMoveLeft = false;

    loseMessage.classList.remove('hidden');

    return;
  }

  const currentX = e.pageX || e.touches[0].pageX;
  const currentY = e.pageY || e.touches[0].pageY;

  const deltaX = startX - currentX;
  const deltaY = startY - currentY;

  // Set the minimum swipe distance for it to be considered a swipe
  const minimumSwipeDistance = 5;

  // Check if the swipe is horizontal or vertical based on the distance
  if (Math.abs(deltaX) > minimumSwipeDistance) {
    if (deltaX > 0) {
      // Swipe left
      moveCellsLeft();
    } else {
      // Swipe right
      moveCellsRight();
    }
  } else if (Math.abs(deltaY) > minimumSwipeDistance) {
    if (deltaY > 0) {
      // Swipe up
      moveCellsUp();
    } else {
      // Swipe down
      moveCellsDown();
    }
  }

  // Reset start position
  startX = null;
  startY = null;
}

function moveCellsUp() {
  let accessNum = 0;

  occupiedCells.forEach(cell => {
    let cellNum = cellArr.indexOf(cell);
    let doublCount = 0;

    while (cellNum >= 0) {
      cellNum -= 4;

      if (cellNum < 0) {
        break;
      } else if (cellArr[cellNum].textContent !== '') {
        if (cellArr[cellNum].textContent
          === cellArr[cellNum + 4].textContent
          && doublCount === 0) {
          const celltext = cellArr[cellNum + 4].textContent;

          cellArr[cellNum].classList.add(
            `field-cell--${Number(celltext) * 2}`);
          cellArr[cellNum].innerText = `${Number(celltext) * 2}`;

          cellArr[cellNum].classList.remove(
            `field-cell--${celltext}`);
          cellArr[cellNum + 4].classList.remove(`field-cell--${celltext}`);
          cellArr[cellNum + 4].innerText = '';
          scoreNum += Number(celltext) * 2;
          gameScore.innerText = `${scoreNum}`;
          accessNum = 1;
          doublCount++;
        } else {
          break;
        }
      } else {
        const celltext = cellArr[cellNum + 4].textContent;

        accessNum = 1;
        cellArr[cellNum].innerText = celltext;

        cellArr[cellNum].classList.add(
          `field-cell--${celltext}`);
        cellArr[cellNum + 4].classList.remove(`field-cell--${celltext}`);
        cellArr[cellNum + 4].innerText = '';
      }
    }
  });

  cellsChecker();

  if (!accessNum) {
    accessToMoveUp = false;
  } else {
    createNewCell();
    accessToMoveDown = true;
    accessToMoveRight = true;
    accessToMoveLeft = true;
  }
}

function moveCellsDown() {
  const rvrsdOccpdCells = [ ...occupiedCells ].reverse();
  let accessNum = 0;

  rvrsdOccpdCells.forEach(cell => {
    let cellNum = cellArr.indexOf(cell);
    let doubleCount = 0;

    while (cellNum <= 16) {
      cellNum += 4;

      if (cellNum >= 16) {
        break;
      } else if (cellArr[cellNum].textContent !== '') {
        if (cellArr[cellNum].textContent
          === cellArr[cellNum - 4].textContent
          && doubleCount === 0) {
          const celltext = cellArr[cellNum - 4].textContent;

          cellArr[cellNum].classList.add(
            `field-cell--${Number(celltext) * 2}`);
          cellArr[cellNum].innerText = `${Number(celltext) * 2}`;

          cellArr[cellNum].classList.remove(
            `field-cell--${celltext}`);
          cellArr[cellNum - 4].classList.remove(`field-cell--${celltext}`);
          cellArr[cellNum - 4].innerText = '';
          scoreNum += Number(celltext) * 2;
          gameScore.innerText = `${scoreNum}`;
          accessNum = 1;
          doubleCount++;
        } else {
          break;
        }
      } else {
        const celltext = cellArr[cellNum - 4].textContent;

        accessNum = 1;
        cellArr[cellNum].innerText = celltext;

        cellArr[cellNum].classList.add(
          `field-cell--${celltext}`);
        cellArr[cellNum - 4].classList.remove(`field-cell--${celltext}`);
        cellArr[cellNum - 4].innerText = '';
      }
    }
  });
  cellsChecker();

  if (!accessNum) {
    accessToMoveDown = false;
  } else {
    createNewCell();
    accessToMoveUp = true;
    accessToMoveRight = true;
    accessToMoveLeft = true;
  }
}

function moveCellsRight() {
  const rvrsdOccpdCells = [ ...occupiedCells ].reverse();
  let accessNum = 0;

  rvrsdOccpdCells.forEach(cell => {
    const parentRow = [ ...cell.parentElement.children ].reverse();
    let cellNum = parentRow.indexOf(cell);
    let doubleCount = 0;

    while (cellNum > 0) {
      cellNum -= 1;

      if (cellNum < 0) {
        break;
      } else if (parentRow[cellNum].textContent !== '') {
        if (parentRow[cellNum].textContent
            === parentRow[cellNum + 1].textContent
            && doubleCount === 0) {
          const celltext = parentRow[cellNum + 1].textContent;

          parentRow[cellNum].classList.add(
            `field-cell--${Number(celltext) * 2}`);
          parentRow[cellNum].innerText = `${Number(celltext) * 2}`;

          parentRow[cellNum].classList.remove(
            `field-cell--${celltext}`);
          parentRow[cellNum + 1].classList.remove(`field-cell--${celltext}`);
          parentRow[cellNum + 1].innerText = '';
          scoreNum += Number(celltext) * 2;
          gameScore.innerText = `${scoreNum}`;
          accessNum = 1;
          doubleCount++;
        }
      } else {
        const celltext = parentRow[cellNum + 1].textContent;

        parentRow[cellNum].innerText = celltext;

        parentRow[cellNum].classList.add(
          `field-cell--${celltext}`);
        parentRow[cellNum + 1].classList.remove(`field-cell--${celltext}`);
        parentRow[cellNum + 1].innerText = '';

        accessNum = 1;
      }
    }
  });

  cellsChecker();

  if (!accessNum) {
    accessToMoveRight = false;
  } else {
    createNewCell();
    accessToMoveUp = true;
    accessToMoveDown = true;
    accessToMoveLeft = true;
  }
}

function moveCellsLeft() {
  let accessNum = 0;

  occupiedCells.forEach(cell => {
    const parentRow = [ ...cell.parentElement.children ];
    let cellNum = parentRow.indexOf(cell);
    let doubleCount = 0;

    while (cellNum > 0) {
      cellNum -= 1;

      if (cellNum < 0) {
        break;
      } else if (parentRow[cellNum].textContent !== '') {
        if (parentRow[cellNum].textContent
            === parentRow[cellNum + 1].textContent
            && doubleCount === 0) {
          const celltext = parentRow[cellNum + 1].textContent;

          parentRow[cellNum].classList.add(
            `field-cell--${Number(celltext) * 2}`);
          parentRow[cellNum].innerText = `${Number(celltext) * 2}`;

          parentRow[cellNum].classList.remove(
            `field-cell--${celltext}`);
          parentRow[cellNum + 1].classList.remove(`field-cell--${celltext}`);
          parentRow[cellNum + 1].innerText = '';
          scoreNum += Number(celltext) * 2;
          gameScore.innerText = `${scoreNum}`;
          accessNum = 1;
          doubleCount++;
        }
      } else {
        const celltext = parentRow[cellNum + 1].textContent;

        parentRow[cellNum].innerText = celltext;

        parentRow[cellNum].classList.add(
          `field-cell--${celltext}`);
        parentRow[cellNum + 1].classList.remove(`field-cell--${celltext}`);
        parentRow[cellNum + 1].innerText = '';

        accessNum = 1;
      }
    }
  });

  cellsChecker();

  if (!accessNum) {
    accessToMoveLeft = false;
  } else {
    createNewCell();
    accessToMoveUp = true;
    accessToMoveDown = true;
    accessToMoveRight = true;
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    restartMessage.classList.remove('hidden');
    startButton.classList.add('restart');
    startButton.innerText = 'Restart';
    startMessage.classList.add('hidden');
  }

  gameScore.innerText = '0';
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  freeCells = [ ...cellArr ];
  occupiedCells = [];
  accessToMoveUp = true;
  accessToMoveDown = true;
  accessToMoveRight = true;
  accessToMoveLeft = true;
  scoreNum = 0;

  freeCells.forEach(cell => {
    cell.className = 'field-cell';
    cell.innerText = '';
  });

  for (let i = 0; i < 2; i++) {
    createNewCell();
  }
});

document.addEventListener('keydown', (e) => {
  occupiedCells.forEach(cell => {
    if (cell.textContent === finalScore) {
      accessToMoveUp = false;
      accessToMoveDown = false;
      accessToMoveRight = false;
      accessToMoveLeft = false;

      winMessage.classList.remove('hidden');
    }
  });

  if (cellArr.length === occupiedCells.length
    && accessChecker()) {
    accessToMoveUp = false;
    accessToMoveDown = false;
    accessToMoveRight = false;
    accessToMoveLeft = false;

    loseMessage.classList.remove('hidden');
  }

  if (e.key === Directions.ArrowUp && accessToMoveUp) {
    moveCellsUp();
  }

  if (e.key === Directions.ArrowDown && accessToMoveDown) {
    moveCellsDown();
  }

  if (e.key === Directions.ArrowRight && accessToMoveRight) {
    moveCellsRight();
  }

  if (e.key === Directions.ArrowLeft && accessToMoveLeft) {
    moveCellsLeft();
  }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('mousedown', handleTouchStart, false);

document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('mousemove', handleTouchMove, false);
