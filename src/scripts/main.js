'use strict';

const theOnlyButton = document.querySelector('.button');
const board = document.querySelector('tbody');
const boardSize = 4;
const pointsCounter = document.querySelector('.game-score');
const messageForWinner = document.querySelector('.message-win');
const messageForLooser = document.querySelector('.message-lose');
const allCells = document.querySelectorAll('td');
const winnerScore = 2048;
let score = 0;

theOnlyButton.addEventListener('click', () => {
  changeButtonClass();
  hideStartMessage();

  [...allCells].forEach(cell => {
    cell.innerHTML = '';
    updateClassList(cell);

    return cell;
  });

  if (messageForLooser.classList.contains('hidden') === false) {
    messageForLooser.classList.add('hidden');
  }

  if (messageForWinner.classList.contains('hidden') === false) {
    messageForWinner.classList.add('hidden');
  }

  score = 0;
  pointsCounter.textContent = score.toString();
  generateNumber();
});

function changeButtonClass() {
  theOnlyButton.textContent = 'Restart';
  theOnlyButton.classList.remove('start');
  theOnlyButton.classList.add('restart');
}

function hideStartMessage() {
  document.querySelector('.message-start').classList.add('hidden');
}

function generateNumber() {
  const isEmptyCell = [...allCells].some(cell => cell.textContent === '');

  if (!isEmptyCell) {
    messageForLooser.classList.remove('hidden');

    return;
  }

  let found = false;

  while (!found) {
    const horizontallyCell = Math.floor(Math.random() * boardSize);
    const verticallyCell = Math.floor(Math.random() * boardSize);
    const cellForNewNumber = board.rows[horizontallyCell].cells[verticallyCell];

    if (cellForNewNumber.textContent === '') {
      const newNumber = Math.random() >= 0.9 ? 4 : 2;

      cellForNewNumber.textContent = `${newNumber}`;
      updateClassList(cellForNewNumber);
      found = true;
    }
  }
}

document.addEventListener('keyup', (e) => {
  hideStartMessage();

  if (e.code === 'Numpad8') {
    moveNumbersUp();
    generateNumber();
  }

  if (e.code === 'Numpad6') {
    moveNumbersRight();
    generateNumber();
  }

  if (e.code === 'Numpad4') {
    moveNumbersLeft();
    generateNumber();
  }

  if (e.code === 'Numpad2') {
    moveNumbersDown();
    generateNumber();
  }

  pointsCounter.textContent = `${score}`;
  changeButtonClass();
});

function makeArrayOfNumbersInColumns() {
  const array = [];
  let step = 0;

  do {
    const ar = [];

    for (let i = step; i < allCells.length; i += boardSize) {
      if (allCells[i].textContent !== '') {
        ar.push(Number(allCells[i].textContent));
      }
    }

    array.push(ar);
    step++;
  } while (step !== 4);

  return array;
}

function makePairsOfNumbers(array) {
  for (let x = 0; x < array.length; x++) {
    for (let i = 0; i < array[x].length; i++) {
      if (array[x][i] === array[x][i + 1]) {
        array[x][i] *= 2;

        if (array[x][i] === winnerScore) {
          messageForWinner.classList.remove('hidden');
        }

        array[x][i + 1] = 0;
        score += array[x][i];
      }

      array[x] = array[x].filter(a => a !== 0);
    }
  }

  return array;
}

function matchNumbersOpp(array) {
  for (let x = 0; x < array.length; x++) {
    for (let i = array[x].length - 1; i >= 0; i--) {
      if (array[x][i] === array[x][i - 1]) {
        array[x][i] *= 2;

        if (array[x][i] === winnerScore) {
          messageForWinner.classList.remove('hidden');
        }

        array[x][i - 1] = 0;
        score += array[x][i];
      }
    }

    array[x] = array[x].filter(num => num !== 0);
  }

  return array;
}

function makeArrayOfNumbersInRows() {
  const ar = [];

  [...board.rows].forEach(row => {
    const array = [];

    [...row.cells].forEach(cell => {
      if (cell.textContent !== '') {
        array.push(Number(cell.textContent));
      }
    });

    ar.push(array);
  });

  return ar;
}

function moveNumbersUp() {
  const currentNumbers = makeArrayOfNumbersInColumns();
  const addedNumbers = makePairsOfNumbers(currentNumbers);

  for (let i = 0; i < boardSize; i++) {
    for (let x = 0; x < boardSize; x++) {
      if (addedNumbers[x][i]) {
        board.rows[i].cells[x].textContent = `${addedNumbers[x][i]}`;
      } else {
        board.rows[i].cells[x].textContent = '';
      }

      updateClassList(board.rows[i].cells[x]);
    }
  }
}

function moveNumbersDown() {
  const currentNumbers = makeArrayOfNumbersInColumns();
  const addedNumbers = matchNumbersOpp(currentNumbers);

  for (const array of addedNumbers) {
    while (array.length !== boardSize) {
      array.unshift(1);
    }
  }

  for (let i = boardSize - 1; i >= 0; i--) {
    for (let x = boardSize - 1; x >= 0; x--) {
      if (addedNumbers[x][i] !== 1) {
        board.rows[i].cells[x].textContent = `${addedNumbers[x][i]}`;
      } else {
        board.rows[i].cells[x].textContent = '';
      }

      updateClassList(board.rows[i].cells[x]);
    }
  }
}

function moveNumbersLeft() {
  const currentNumbers = makeArrayOfNumbersInRows();
  const addedNumbers = makePairsOfNumbers(currentNumbers);

  for (let i = 0; i < boardSize; i++) {
    for (let x = 0; x < boardSize; x++) {
      if (addedNumbers[i][x]) {
        board.rows[i].cells[x].textContent = `${addedNumbers[i][x]}`;
      } else {
        board.rows[i].cells[x].textContent = '';
      }

      updateClassList(board.rows[i].cells[x]);
    }
  }
}

function moveNumbersRight() {
  const currentNumbers = makeArrayOfNumbersInRows();
  const addedNumbers = matchNumbersOpp(currentNumbers);

  for (const array of addedNumbers) {
    while (array.length !== boardSize) {
      array.unshift(1);
    }
  }

  for (let i = 0; i < boardSize; i++) {
    for (let x = 0; x < boardSize; x++) {
      if (addedNumbers[i][x] !== 1) {
        board.rows[i].cells[x].textContent = `${addedNumbers[i][x]}`;
      } else {
        board.rows[i].cells[x].textContent = '';
      }

      updateClassList(board.rows[i].cells[x]);
    }
  }
}

function updateClassList(cell) {
  cell.classList.value = '';
  cell.className = 'field-cell';

  if (cell.textContent) {
    cell.classList.add(`${cell.classList.value}--${cell.textContent}`);
  }
}
