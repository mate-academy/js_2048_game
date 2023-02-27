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

const findRandNunb = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

startButton.addEventListener('click', () => {
  startGame();
});

function findRandCellForStart() {
  const min = 1;
  const max = 16;

  firstField = findRandNunb(min, max);
  secondField = findRandNunb(min, max);

  while (secondField === firstField) {
    secondField = findRandNunb(min, max);
  }

  return [firstField, secondField];
}

function startGame() {
  const arr = findRandCellForStart();
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

function createNewCell() {
  const min = 1;
  const max = 16;

  let newField = findRandNunb(min, max);

  while (findTakenCells().includes(newField)) {
    newField = findRandNunb(min, max);
  }

  listCells[newField].textContent = '2';
  listCells[newField].classList = ('innerField field-cell--2');
  scoreField.textContent = countScore(findTakenCells());
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

const steps = async(oldCellIndex, stepCount, oneStep, didMerge, sideMove) => {
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

const lose = (changeConditions) => {
  const left = changeConditions('left')[1]
  || changeConditions('left')[2] || changeConditions('left')[3];

  const right = changeConditions('right')[1]
  || changeConditions('right')[2] || changeConditions('right')[3];

  const up = changeConditions('up')[1]
  || changeConditions('up')[2] || changeConditions('up')[3];

  const down = changeConditions('down')[1]
  || changeConditions('down')[2] || changeConditions('down')[3];

  if (findTakenCells().length === 16 && !left && !right && !up && !down) {
    loseMessage.classList.remove('hidden');
  }
};

const moveCells = async(sideMove) => {
  const doMove = new Promise(async(resolve) => {
    isMovingNow = true;

    const takenCells = findTakenCells();
    let didMove = false;
    const isDescCycle = (sideMove === 'right' || sideMove === 'down') && true;

    for (let cellIndex = isDescCycle ? (takenCells.length - 1) : 0;
      cellIndex >= 0 && cellIndex <= takenCells.length - 1;
      isDescCycle ? cellIndex-- : cellIndex++) {
      let stepCount = 0;
      let didMerge = false;

      const changeConditions = (moveSide) => {
        let step = 1;
        let firstCondition = (takenCells[cellIndex] % 4 === 1);
        let secondCondition = (takenCells[cellIndex] % 4 === 2);
        let thirdCondition = (takenCells[cellIndex] % 4 === 3);

        if (moveSide === 'up') {
          firstCondition = takenCells[cellIndex] >= 4
          && takenCells[cellIndex] <= 7;

          secondCondition = takenCells[cellIndex] >= 8
          && takenCells[cellIndex] <= 11;

          thirdCondition = takenCells[cellIndex] >= 12
          && takenCells[cellIndex] <= 15;
          step = 4;
        }

        if (moveSide === 'right') {
          step = -1;

          firstCondition = (takenCells[cellIndex] % 4 === 2);
          secondCondition = (takenCells[cellIndex] % 4 === 1);
          thirdCondition = (takenCells[cellIndex] % 4 === 0);
        }

        if (moveSide === 'down') {
          step = -4;

          firstCondition = takenCells[cellIndex] >= 8
            && takenCells[cellIndex] <= 11;

          secondCondition = takenCells[cellIndex] >= 4
            && takenCells[cellIndex] <= 7;

          thirdCondition = takenCells[cellIndex] >= 0
          && takenCells[cellIndex] <= 3;
        }

        return [step, firstCondition, secondCondition, thirdCondition];
      };

      const oneStep = changeConditions(sideMove)[0];
      const oldCellIndex = takenCells[cellIndex];
      const nextCellIndex = takenCells[cellIndex]
      - oneStep;

      if (changeConditions(sideMove)[1]) {
        if (listCells[nextCellIndex].textContent === '') {
          stepCount++;
        } else if (listCells[nextCellIndex].textContent
        === listCells[oldCellIndex].textContent) {
          didMerge = true;
        }
      }

      if (changeConditions(sideMove)[2]) {
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

      if (changeConditions(sideMove)[3]) {
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
        await steps(oldCellIndex, stepCount, oneStep, didMerge, sideMove);
        didMove = true;
      }

      lose(changeConditions);
    };

    didMove && createNewCell();

    resolve();
  });

  await doMove;

  isMovingNow = false;
};

// eslint-disable-next-line no-shadow
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'ArrowLeft':
      !isMovingNow && moveCells('left');
      break;
    case 'ArrowRight':
      !isMovingNow && moveCells('right');
      break;
    case 'ArrowUp':
      !isMovingNow && moveCells('up');
      break;
    case 'ArrowDown':
      !isMovingNow && moveCells('down');
      break;
    default:
      break;
  }
});
