'use strict';

const boardSize = 16;
const bookedCells = [];
const arrayOfValues = [];
const newValues = [2, 2, 2, 2, 2, 2, 2, 2, 2];

const up = 'ArrowUp';
const down = 'ArrowDown';
const right = 'ArrowRight';
const left = 'ArrowLeft';

const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const start = document.querySelector('.start');

const messageLose = document.querySelector('.message-lose');
let lose = false;

const messageWin = document.querySelector('.message-win');
let win = false;

const score = document.querySelector('.game-score');
let scoreCounter = 0;
let hasUpdates;

newValues.splice(Math.floor(Math.random() * 10), 0, 4);

const takeStep = () => {
  let position = Math.floor(Math.random() * boardSize);

  while (bookedCells.includes(position)) {
    position = Math.floor(Math.random() * boardSize);
  }

  const step = cells[position];
  const value = newValues[Math.floor(Math.random() * 10)];

  step.classList.add(`field-cell--${value}`);
  step.innerHTML = value;

  bookedCells.push(position);
};

const newGame = () => {
  handleScore(0);

  lose = false;
  win = false;

  takeStep();
  takeStep();

  start.classList.replace('start', 'restart');
  start.innerHTML = 'Restart';

  keepCellsValues();
};

const clearBoard = () => {
  for (const cell of cells) {
    if (cell.classList.length > 1) {
      const listOfClasses
        = cell.classList.toString().replace('field-cell ', '');

      cell.classList.remove(listOfClasses);
      cell.innerHTML = '';
    }
  }
};

const keepCellsValues = () => {
  cells.forEach((cell, index) => {
    if (cell.innerHTML) {
      arrayOfValues.push([index, +cell.innerHTML]);
    }
  });
};

const getBookedPositions = () => {
  clearArray(bookedCells);

  cells.forEach((cell, index) => {
    if (cell.innerHTML !== '') {
      bookedCells.push(index);
    }
  });
};

const fillInBoard = (array) => {
  array.forEach(cell => {
    cells[cell[0]].classList.add(`field-cell--${cell[1]}`);
    cells[cell[0]].innerHTML = cell[1];
  });
};

const clearArray = (array) => {
  while (array.length > 0) {
    array.pop();
  }
};

const handleScore = (value) => {
  value === 0 ? scoreCounter = value : scoreCounter += value;
  score.innerHTML = scoreCounter;
};

const handleArrowClick = (side) => {
  hasUpdates = false;

  for (let i = 0; i < 4; i++) {
    const slice = side === up || side === down
      ? arrayOfValues.filter(value => value[0] % 4 === i)
      : arrayOfValues.filter(value => Math.floor(value[0] / 4) === i);

    if (slice.length) {
      let extremeCellStep;
      let extremeCellPosition;

      switch (side) {
        case up:
          extremeCellPosition = i;
          extremeCellStep = 4;
          break;

        case down:
          extremeCellPosition = 12 + i;
          extremeCellStep = -4;
          break;

        case right:
          extremeCellPosition = 4 * i + 3;
          extremeCellStep = -1;
          break;

        case left:
          extremeCellPosition = 4 * i;
          extremeCellStep = 1;
          break;
      }

      const step = extremeCellStep > 0 ? 1 : -1;
      const leftOrUp = (side === up || side === left);

      for (let j = 0; j < slice.length; j++) {
        const k = leftOrUp ? j : slice.length - j - 1;

        if (slice[k + step] && slice[k][1] === slice[k + step][1]) {
          const newValue = slice[k][1] * 2;

          slice[k][1] = newValue;
          slice.splice(k + step, 1);
          handleScore(newValue);

          hasUpdates = true;
        }
      }

      for (let j = 0; j < slice.length; j++) {
        const k = leftOrUp ? j : slice.length - j - 1;

        if (slice[k]) {
          if ((slice[k][0] - extremeCellPosition) * step > 0) {
            slice[k][0] = extremeCellPosition;
            hasUpdates = true;
          }
          extremeCellPosition += extremeCellStep;
        }
      }

      fillInBoard(slice);
    }
  }

  win = document.querySelector('.field-cell--2048');

  if (win) {
    messageWin.classList.remove('hidden');
  }
};

const checkNewStepAvailable = (trigger) => {
  if (trigger) {
    let pairs = 0;

    for (let i = 0; i < boardSize && pairs === 0; i++) {
      const testCell = +cells[i].innerHTML;
      const rightsCell = cells[i + 1] ? +cells[i + 1].innerHTML : undefined;
      const lowerCell = cells[i + 4] ? +cells[i + 4].innerHTML : undefined;

      switch (true) {
        case (rightsCell && testCell === rightsCell):
          pairs++;
          break;

        case (lowerCell && testCell === lowerCell):
          pairs++;
          break;
      }
    }

    lose = pairs === 0;

    if (lose) {
      messageLose.classList.remove('hidden');
    }
  }
};

start.addEventListener('click', () => {
  clearBoard();
  clearArray(bookedCells);
  clearArray(arrayOfValues);

  newGame();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');
});

document.addEventListener('keydown', evn => {
  if (document.querySelector('.restart') && !lose) {
    const key = evn.key;

    clearBoard();
    handleArrowClick(key);
    clearArray(arrayOfValues);
    getBookedPositions();

    if (bookedCells.length !== boardSize && hasUpdates) {
      takeStep();
    }

    keepCellsValues();
    checkNewStepAvailable(bookedCells.length === boardSize);
  }
});
