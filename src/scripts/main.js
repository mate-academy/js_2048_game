'use strict';

const boardSize = 16;
const bookedCells = [];
const arrayOfValues = [];
const newValues = [2, 2, 2, 2, 2, 2, 2, 2, 2];

const cells = document.querySelectorAll('.field-cell');
const messagStart = document.querySelector('.message-start');
const start = document.querySelector('.start');

const messageLose = document.querySelector('.message-lose');
let lose = false;

const messagWin = document.querySelector('.message-win');
let win = false;

const score = document.querySelector('.game-score');
let scoreCounter = 0;

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

  start.classList.remove('start');
  start.classList.add('restart');
  start.innerHTML = 'Restart';
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
  for (let i = 0; i < 4; i++) {
    let slice;

    if (side === 'ArrowUp' || side === 'ArrowDown') {
      slice = arrayOfValues.filter(value => value[0] % 4 === i);
    } else {
      slice = arrayOfValues.filter(value => Math.floor(value[0] / 4) === i);
    }

    if (slice.length) {
      let extremeCellStep;
      let extremeCellPosition;

      switch (side) {
        case 'ArrowUp':
          extremeCellPosition = i;
          extremeCellStep = 4;
          break;

        case 'ArrowDown':
          extremeCellPosition = 12 + i;
          extremeCellStep = -4;
          break;

        case 'ArrowRight':
          extremeCellPosition = 4 * i + 3;
          extremeCellStep = -1;
          break;

        case 'ArrowLeft':
          extremeCellPosition = 4 * i;
          extremeCellStep = 1;
          break;
      }

      const step = extremeCellStep > 0 ? 1 : -1;
      const leftOrUp = (side === 'ArrowUp' || side === 'ArrowLeft');

      for (let j = 0; j < slice.length; j++) {
        const k = leftOrUp ? j : slice.length - j - 1;

        if (slice[k + step] && slice[k][1] === slice[k + step][1]) {
          const newValue = slice[k][1] * 2;

          slice[k][1] = newValue;
          slice.splice(k + step, 1);
          handleScore(newValue);
        }
      }

      for (let j = 0; j < slice.length; j++) {
        const k = leftOrUp ? j : slice.length - j - 1;

        if (slice[k]) {
          if ((slice[k][0] - extremeCellPosition) * step > 0) {
            slice[k][0] = extremeCellPosition;
          }
          extremeCellPosition += extremeCellStep;
        }
      }

      fillInBoard(slice);
    }
  }

  win = document.querySelector('.field-cell--2048');
  messagWin.classList.toggle('hidden', !win);
};

const checkNewStepAvailable = (trigger) => {
  if (trigger) {
    let pairs = 0;

    for (let i = 0; i < boardSize && pairs === 0; i += 2) {
      const testCell = +cells[i].innerHTML;
      const rightsCell = +cells[i + 1].innerHTML;
      const lowerCell = +cells[i + 4].innerHTML;

      switch (true) {
        case (testCell === rightsCell):
          pairs++;
          break;

        case (lowerCell && testCell === lowerCell):
          pairs++;
          break;
      }
    }

    lose = pairs === 0;
    messageLose.classList.toggle('hidden', !lose);
  }
};

start.addEventListener('click', () => {
  clearBoard();
  clearArray(bookedCells);
  clearArray(arrayOfValues);

  newGame();

  messagWin.classList.toggle('hidden', !win);
  messageLose.classList.toggle('hidden', !lose);
  messagStart.classList.toggle('hidden', true);
});

document.addEventListener('keydown', evn => {
  if (document.querySelector('.restart') && !lose) {
    const key = evn.key;

    keepCellsValues();
    clearBoard();
    handleArrowClick(key);
    clearArray(arrayOfValues);
    getBookedPositions();

    if (bookedCells.length !== boardSize) {
      setTimeout(() => takeStep(), 150);
    }

    checkNewStepAvailable(bookedCells.length === boardSize);
  }
});
