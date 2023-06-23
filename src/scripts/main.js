'use strict';

const startGameButton = document.querySelector('.button');
const board = document.querySelector('tbody');
const boardSize = 4;
const pointsCounter = document.querySelector('.game-score');
const messageForWinner = document.querySelector('.message-win');
const messageForLoser = document.querySelector('.message-lose');
const allCells = document.querySelectorAll('td');
const winnerScore = 2048;
let score = 0;

startGameButton.addEventListener('click', () => {
  changeStartBtnToRestartBtn();
  hideStartMessage();

  [...allCells].forEach(cell => {
    cell.innerHTML = '';
    updateClassList(cell);

    return cell;
  });

  if (!messageForLoser.classList.contains('hidden')) {
    messageForLoser.classList.add('hidden');
  }

  if (!messageForWinner.classList.contains('hidden')) {
    messageForWinner.classList.add('hidden');
  }

  score = 0;
  pointsCounter.textContent = score.toString();
  generateNumber();
});

function changeStartBtnToRestartBtn() {
  if (startGameButton.classList.contains('start')) {
    startGameButton.textContent = 'Restart';
    startGameButton.classList.remove('start');
    startGameButton.classList.add('restart');
  }
}

function hideStartMessage() {
  const messageBeforeStart = document.querySelector('.message-start');

  if (!messageBeforeStart.classList.contains('hidden')) {
    messageBeforeStart.classList.add('hidden');
  }
}

function checkIfMergePossible() {
  const numbersInColumns = makeArrayOfNumbersInColumns();
  const numbersInRows = makeArrayOfNumbersInRows();
  let isPair = true;
  let isVerticalPair = false;
  let isHorizontalPair = false;

  for (const array of numbersInRows) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        isHorizontalPair = true;
        break;
      }
    }
  }

  for (const array of numbersInColumns) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        isVerticalPair = true;
        break;
      }
    }
  }

  if (!isHorizontalPair && !isVerticalPair) {
    isPair = false;
  }

  if (!isPair) {
    messageForLoser.classList.remove('hidden');
  }
}

function generateNumber() {
  const isEmptyCell = [...allCells].some(cell => !cell.textContent);

  if (!isEmptyCell) {
    checkIfMergePossible();

    return;
  }

  let found = false;

  while (!found) {
    const horizontallyCell = Math.floor(Math.random() * boardSize);
    const verticallyCell = Math.floor(Math.random() * boardSize);
    const cellForNewNumber = board.rows[horizontallyCell].cells[verticallyCell];

    if (!cellForNewNumber.textContent) {
      const newNumber = Math.random() >= 0.9 ? 4 : 2;

      cellForNewNumber.textContent = `${newNumber}`;
      updateClassList(cellForNewNumber);
      found = true;
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'Numpad8' || e.code === 'ArrowUp') {
    hideStartMessage();
    changeStartBtnToRestartBtn();
    moveNumbersUp();
    pointsCounter.textContent = `${score}`;
    generateNumber();
  }

  if (e.code === 'Numpad6' || e.code === 'ArrowRight') {
    hideStartMessage();
    changeStartBtnToRestartBtn();
    moveNumbersRight();
    pointsCounter.textContent = `${score}`;
    generateNumber();
  }

  if (e.code === 'Numpad4' || e.code === 'ArrowLeft') {
    hideStartMessage();
    changeStartBtnToRestartBtn();
    moveNumbersLeft();
    pointsCounter.textContent = `${score}`;
    generateNumber();
  }

  if (e.code === 'Numpad2' || e.code === 'ArrowDown') {
    hideStartMessage();
    changeStartBtnToRestartBtn();
    moveNumbersDown();
    pointsCounter.textContent = `${score}`;
    generateNumber();
  }
});

function makeArrayOfNumbersInColumns() {
  const array = [];
  let step = 0;

  do {
    const arr = [];

    for (let i = step; i < allCells.length; i += boardSize) {
      if (allCells[i].textContent) {
        arr.push(Number(allCells[i].textContent));
      }
    }

    array.push(arr);
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
  const arr = [];

  [...board.rows].forEach(row => {
    const array = [];

    [...row.cells].forEach(cell => {
      if (cell.textContent) {
        array.push(Number(cell.textContent));
      }
    });

    arr.push(array);
  });

  return arr;
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
