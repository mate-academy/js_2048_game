'use strict';

const cells = document.querySelectorAll('td');
const vinMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let cellsArray = [...cells];

const horizontalMapArray = [];

while (cellsArray.length > 0) {
  const row = [];

  for (let i = 0; i <= 3; i++) {
    row.push(cellsArray[i]);
  }
  cellsArray = cellsArray.slice(4);
  horizontalMapArray.push(row);
}

const verticalMapArray = [];

for (let i = 0; i < horizontalMapArray.length; i++) {
  const newRow = [];

  for (const row of horizontalMapArray) {
    newRow.push(row[i]);
  }
  verticalMapArray.push(newRow);
}

const addValues = [];
let count2 = 9;
const value2 = 2;
const value4 = 4;

for (let i = 0; i < 10; i++) {
  if (count2 !== 0) {
    addValues.push(value2);
    count2--;
    continue;
  }
  addValues.push(value4);
}

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  score.innerText = 0;
  startButton.classList.toggle('restart');

  startButton.innerText = startButton.classList.contains('restart')
    ? 'Restart'
    : 'Start';

  startButton.classList.toggle('start');
  startMessage.hidden = !startMessage.hidden;
  vinMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (!startButton.classList.contains('restart')) {
    cells.forEach(el => {
      el.innerText = '';
      el.classList = 'field-cell';
    });

    return;
  }
  getRandomCell();
  getRandomCell();
});

const score = document.querySelector('.game-score');

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'ArrowRight') {
    if (startButton.innerText === 'Start') {
      return;
    }

    for (const row of horizontalMapArray) {
      shiftCells(row);
      addCells(row);
      shiftCells(row);
    }
    getRandomCell();
    verifyMapArray();
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'ArrowLeft') {
    if (startButton.innerText === 'Start') {
      return;
    }

    for (const row of horizontalMapArray) {
      row.reverse();
      shiftCells(row);
      addCells(row);
      shiftCells(row);
      row.reverse();
    }
    getRandomCell();
    verifyMapArray();
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'ArrowUp') {
    if (startButton.innerText === 'Start') {
      return;
    }

    for (const row of verticalMapArray) {
      row.reverse();
      shiftCells(row);
      addCells(row);
      shiftCells(row);
      row.reverse();
    }
    getRandomCell();
    verifyMapArray();
  }
});

document.addEventListener('keydown', (ev) => {
  if (ev.code === 'ArrowDown') {
    if (startButton.innerText === 'Start') {
      return;
    }

    for (const row of verticalMapArray) {
      shiftCells(row);
      addCells(row);
      shiftCells(row);
    }
    getRandomCell();
    verifyMapArray();
  }
});

function getRandomCell() {
  // eslint-disable-next-line max-len
  const cell = horizontalMapArray[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];

  if (cell.innerText === '') {
    const valueCell = addValues[getRandomInt(10)];

    cell.classList.add(`field-cell--${valueCell}`);
    cell.innerText = valueCell;

    return cell;
  }

  if (!horizontalMapArray.flat().find(item => item.innerText === '')) {
    return;
  }
  getRandomCell();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shiftCells(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].innerText !== '') {
      const newCells = arr.slice(i).filter(el => el.innerText === '');
      const newCellsLastItem = newCells[newCells.length - 1];

      if (newCells.length > 0) {
        newCellsLastItem.innerText = arr[i].innerText;
        arr[i].innerText = '';

        newCellsLastItem.classList
          .add(`field-cell--${newCellsLastItem.innerText}`);
        arr[i].classList.remove(arr[i].classList[1]);
      }
    }
  }
}

function addCells(arr) {
  for (let i = arr.length - 1; i >= 1; i--) {
    if (arr[i - 1].innerText !== ''
    && arr[i].innerText === arr[i - 1].innerText) {
      arr[i].innerText = arr[i].innerText * 2;
      arr[i].classList.remove(arr[i].classList[1]);
      arr[i].classList.add(`field-cell--${arr[i].innerText}`);
      arr[i - 1].innerText = '';
      arr[i - 1].classList.remove(arr[i - 1].classList[1]);
      score.innerText = Number(score.innerText) + Number(arr[i].innerText);
      continue;
    }
  }
}

function verifyMapArray() {
  if (horizontalMapArray.flat().find(item => item.innerText === '2048')) {
    vinMessage.classList.remove('hidden');
  }

  let ifIsMoveInTheGame = false;

  checkMoveInTheGame(horizontalMapArray);

  checkMoveInTheGame(verticalMapArray);

  if (!ifIsMoveInTheGame
    && !horizontalMapArray.flat().find(item => item.innerText === '')) {
    loseMessage.classList.remove('hidden');
  }

  function checkMoveInTheGame(arr) {
    for (const row of arr) {
      for (let i = 1; i < row.length; i++) {
        if (row[i].innerText === row[i - 1].innerText) {
          ifIsMoveInTheGame = true;
        }
      }
    }
  }
}
