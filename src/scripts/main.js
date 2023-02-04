'use strict';

require('regenerator-runtime/runtime');

const startButton = document.querySelector('button.button.start');
const listCells = document.querySelectorAll('.innerField');
const scoreField = document.querySelector('span.game-score');
let firstField = 0;
let secondField = 0;
let isMovingNow = false;

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  start();
});

function randomNumbForStart() {
  const min = 1;
  const max = 16;

  firstField = Math.floor(Math.random() * (max - min)) + min;
  secondField = Math.floor(Math.random() * (max - min)) + min;

  while (secondField === firstField) {
    secondField = Math.floor(Math.random() * (max - min)) + min;
  }

  return [firstField, secondField];
}

function start() {
  const arr = randomNumbForStart();
  const startMessage = document.querySelector('.message-start');

  for (let cellIndex = 0; cellIndex < listCells.length; cellIndex++) {
    listCells[cellIndex].className = '';
    listCells[cellIndex].classList.add('field-cell');
    listCells[cellIndex].textContent = '';
  }

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  listCells[arr[0]].textContent = '2';
  listCells[arr[1]].textContent = '2';
  listCells[arr[0]].classList = ('innerField field-cell--2');
  listCells[arr[1]].classList = ('innerField field-cell--2');
  startMessage.classList.add('hidden');
  scoreField.textContent = countScore(findTakenCells());
}

function findTakenCells() {
  const arrTaken = [];

  for (let cellIndex = 0; cellIndex < listCells.length; cellIndex++) {
    if (listCells[cellIndex].textContent !== '') {
      arrTaken.push(cellIndex);
    }
  }

  return arrTaken;
}

function createNewCell(takenCells) {
  const min = 1;
  const max = 16;

  let newField = Math.floor(Math.random() * (max - min)) + min;

  while (takenCells.includes(newField)) {
    newField = Math.floor(Math.random() * (max - min)) + min;
  }

  listCells[newField].textContent = '2';
  listCells[newField].classList = ('innerField field-cell--2');
}

const countScore = (takenCells) => {
  let sum = 0;

  for (let cellIndex = 0; cellIndex < takenCells.length; cellIndex++) {
    if (listCells[takenCells[cellIndex]].textContent !== '') {
      sum += +listCells[takenCells[cellIndex]].textContent;
    }
  }

  return sum;
};

const step = async(oldCellIndex, stepCount, oneStep, didMerge, sideMove) => {
  if (stepCount !== 0 || didMerge) {
    listCells[oldCellIndex].classList
      .add(`field-cell--move-${sideMove}--${didMerge
        ? stepCount + 1 : stepCount}`);

    if (stepCount !== 0) {
      const doStep = new Promise((resolve) => {
        window.setTimeout(() => {
          listCells[oldCellIndex - (oneStep * stepCount)]
            .textContent = listCells[oldCellIndex].textContent;
          listCells[oldCellIndex].textContent = '';

          listCells[oldCellIndex - (oneStep * stepCount)]
            .classList = listCells[oldCellIndex].classList;
          listCells[oldCellIndex].classList = 'innerField';

          resolve();
        }, 100);
      });

      await doStep;
    }

    listCells[oldCellIndex - (oneStep * stepCount)].classList
      .remove(`field-cell--move-${sideMove}--${didMerge
        ? stepCount + 1 : stepCount}`);
  }

  didMerge && merge(oldCellIndex - (oneStep * (stepCount + 1)),
    oldCellIndex - (stepCount && stepCount * oneStep));
};

const merge = async(newCellIndex, oldCellIndex) => {
  const newNumber = +listCells[oldCellIndex].textContent * 2;

  if (newNumber === 2048) {
    winMessage.classList.remove('hidden');
  }

  listCells[newCellIndex]
    .classList = (`innerField field-cell--${newNumber} field-cell--merge`);
  listCells[newCellIndex].textContent = newNumber;

  listCells[oldCellIndex].classList = 'innerField';
  listCells[oldCellIndex].textContent = '';

  const cancelClass = new Promise((resolve) => {
    window.setTimeout(() => {
      listCells[newCellIndex].classList.remove('field-cell--merge');
      resolve();
    }, 150);
  });

  await cancelClass;
};

const moveCells = async(sideMove) => {
  const doMove = new Promise(async(resolve) => {
    const takenCells = findTakenCells();
    let didMove = false;
    const isDescCycle = (sideMove === 'right' || sideMove === 'down') && true;

    for (let cellIndex = isDescCycle ? (takenCells.length - 1) : 0;
      cellIndex >= 0 && cellIndex <= takenCells.length - 1;
      isDescCycle ? cellIndex-- : cellIndex++) {
      let stepCount = 0;
      let didMerge = false;

      let oneStep = 1;
      let firstCondition = (takenCells[cellIndex] % 4 === 1) && true;
      let secondCondition = (takenCells[cellIndex] % 4 === 2) && true;
      let thirdCondition = (takenCells[cellIndex] % 4 === 3) && true;

      if (sideMove === 'up') {
        firstCondition = takenCells[cellIndex] >= 4
        && takenCells[cellIndex] <= 7;

        secondCondition = takenCells[cellIndex] >= 8
        && takenCells[cellIndex] <= 11;

        thirdCondition = takenCells[cellIndex] >= 12
        && takenCells[cellIndex] <= 15;
        oneStep = 4;
      }

      if (sideMove === 'right') {
        oneStep = -1;

        firstCondition = (takenCells[cellIndex] % 4 === 2) && true;
        secondCondition = (takenCells[cellIndex] % 4 === 1) && true;
        thirdCondition = (takenCells[cellIndex] % 4 === 0) && true;
      }

      if (sideMove === 'down') {
        oneStep = -4;

        firstCondition = takenCells[cellIndex] >= 8
          && takenCells[cellIndex] <= 11;

        secondCondition = takenCells[cellIndex] >= 4
          && takenCells[cellIndex] <= 7;

        thirdCondition = takenCells[cellIndex] >= 0
        && takenCells[cellIndex] <= 3;
      }

      const oldCellIndex = takenCells[cellIndex];
      const nextCellIndex = takenCells[cellIndex] - oneStep;

      if (firstCondition) {
        if (listCells[nextCellIndex].textContent === '') {
          stepCount++;
        } else if (listCells[nextCellIndex].textContent
        === listCells[oldCellIndex].textContent) {
          didMerge = true;
        }
      }

      if (secondCondition) {
        if (listCells[nextCellIndex].textContent === '') {
          stepCount++;

          if (listCells[nextCellIndex - oneStep].textContent === '') {
            stepCount++;
          } else if (listCells[nextCellIndex - oneStep].textContent
          === listCells[oldCellIndex].textContent) {
            didMerge = true;
          }
        } else if (listCells[nextCellIndex].textContent
        === listCells[oldCellIndex].textContent) {
          didMerge = true;
        }
      }

      if (thirdCondition) {
        if (listCells[nextCellIndex].textContent === '') {
          stepCount++;

          if (listCells[nextCellIndex - oneStep].textContent === '') {
            stepCount++;

            if (listCells[nextCellIndex - (oneStep * 2)].textContent === '') {
              stepCount++;
            } else if (listCells[nextCellIndex - (oneStep * 2)].textContent
            === listCells[oldCellIndex].textContent) {
              didMerge = true;
            }
          } else if (listCells[nextCellIndex - oneStep].textContent
          === listCells[oldCellIndex].textContent) {
            didMerge = true;
          }
        } else if (listCells[nextCellIndex].textContent
        === listCells[oldCellIndex].textContent) {
          didMerge = true;
        }
      }

      if (stepCount !== 0 || didMerge) {
        await step(oldCellIndex, stepCount, oneStep, didMerge, sideMove);
        didMove = true;
      }

      if (takenCells.length === 16 && !stepCount && !didMerge) {
        loseMessage.classList.remove('hidden');
      }
    };

    if (didMove) {
      window.setTimeout(() => {
        createNewCell(findTakenCells());
        scoreField.textContent = countScore(findTakenCells());
      }, 200);
    }

    resolve();
  });

  await doMove;
};

if (isMovingNow === false) {
  // eslint-disable-next-line no-shadow
  document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'ArrowLeft':
        isMovingNow = true;
        moveCells('left');
        isMovingNow = false;
        break;
      case 'ArrowRight':
        isMovingNow = true;
        moveCells('right');
        isMovingNow = false;
        break;
      case 'ArrowUp':
        isMovingNow = true;
        moveCells('up');
        isMovingNow = false;
        break;
      case 'ArrowDown':
        isMovingNow = true;
        moveCells('down');
        isMovingNow = false;
        break;
      default:
        break;
    }
  });
}
