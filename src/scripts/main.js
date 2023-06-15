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
const Directions = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

function createNewCell() {
  const cellNum = Math.floor(Math.random() * freeCells.length);

  freeCells[cellNum].classList.add('field-cell--2');
  freeCells[cellNum].innerText = 2;

  occupiedCells.push(freeCells[cellNum]);

  freeCells.splice(cellNum, 1);
}

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
    && !accessToMoveUp && !accessToMoveDown
    && !accessToMoveRight && !accessToMoveLeft) {
    accessToMoveUp = false;
    accessToMoveDown = false;
    accessToMoveRight = false;
    accessToMoveLeft = false;

    loseMessage.classList.remove('hidden');
  }

  if (e.key === Directions.ArrowUp && accessToMoveUp) {
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

    if (accessNum === 0) {
      accessToMoveUp = false;
    } else {
      createNewCell();
      accessToMoveDown = true;
      accessToMoveRight = true;
      accessToMoveLeft = true;
    }
  }

  if (e.key === Directions.ArrowDown && accessToMoveDown) {
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

    if (accessNum === 0) {
      accessToMoveDown = false;
    } else {
      createNewCell();
      accessToMoveUp = true;
      accessToMoveRight = true;
      accessToMoveLeft = true;
    }
  }

  if (e.key === Directions.ArrowRight && accessToMoveRight) {
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

    if (accessNum === 0) {
      accessToMoveRight = false;
    } else {
      createNewCell();
      accessToMoveUp = true;
      accessToMoveDown = true;
      accessToMoveLeft = true;
    }
  }

  if (e.key === Directions.ArrowLeft && accessToMoveLeft) {
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

    if (accessNum === 0) {
      accessToMoveLeft = false;
    } else {
      createNewCell();
      accessToMoveUp = true;
      accessToMoveDown = true;
      accessToMoveRight = true;
    }
  }
});
