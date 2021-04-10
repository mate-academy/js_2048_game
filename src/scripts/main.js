'use strict';

// write your code here

const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const messageWiner = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const tableRow = document.querySelectorAll('tr');

const board = createField();

buttonStart.addEventListener('click', () => {
  messageStart.classList.toggle('hidden');
  messageWiner.classList.add('hidden');
  messageLose.classList.add('hidden');

  buttonStart.innerText === 'Start'
    ? buttonStart.innerText = 'Restart'
    : buttonStart.innerText = 'Start';

  buttonStart.classList.toggle('start', !buttonStart.matches('.start'));
  buttonStart.classList.toggle('restart', !buttonStart.matches('.restart'));

  if (buttonStart.innerText === 'Restart') {
    addNumber(2);

    addNumbersOnBoard();
  } else {
    gameScore.innerText = 0;

    clearTableRow();
    clearBoard();
  }
});

function createField() {
  const gameField = new Array(tableRow.length);

  for (let i = 0; i < tableRow.length; i++) {
    gameField[i] = new Array(tableRow.length).fill(0);
  }

  return gameField;
}

function addNumber(value) {
  let num = value || 1;

  do {
    createRandomNumber();
    num--;
  } while (num > 0);
}

function createRandomNumber() {
  const number = [2, 4][+(Math.random() > 0.9)];

  let x, y;

  do {
    x = Math.floor(Math.random() * tableRow.length);
    y = Math.floor(Math.random() * tableRow.length);
  } while (board[x][y] !== 0);

  board[x][y] = number;
}

function addNumbersOnBoard() {
  for (let i = 0; i < tableRow.length; i++) {
    for (let x = 0; x < tableRow.length; x++) {
      if (board[i][x] > 0) {
        [...tableRow][i].children[x].innerText = board[i][x];

        [...tableRow][i].children[x].classList.add(
          `field-cell--${board[i][x]}`);
      }
    }
  }
}

function clearTableRow() {
  tableRow.forEach(el => [...el.children].forEach(child => {
    child.classList.remove(`field-cell--${child.innerText}`);
    child.innerText = '';
  }));
}

function clearBoard() {
  board.forEach(el => el.fill(0));
}

document.addEventListener('keydown', (tap) => {
  if (checkZerosAndCanMove()) {
    messageLose.classList.add('hidden');
  }

  if (buttonStart.innerText !== 'Restart' || winer()
    || checkZerosAndCanMove()) {
    return;
  }

  const res = createCopy(board);

  switch (tap.key) {
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      moveUp();
      break;
  }

  checkBoard(res, board);

  addNumbersOnBoard();
  checkZerosAndCanMove();
});

function slideRigth() {
  for (let i = 0; i < tableRow.length; i++) {
    const filterBoard = board[i].filter(num => num);

    const newLength = tableRow.length - filterBoard.length;
    const zeros = Array(newLength).fill(0);

    const newRow = zeros.concat(filterBoard);

    board[i] = newRow;

    clearTableRow();
  }
}

function moveRight() {
  slideRigth();
  reverseRow();
  sumSameNumbers();
  reverseRow();
  slideRigth();
};

function moveLeft() {
  slideRigth();
  sumSameNumbers();
  reverseRow();
  slideRigth();
  reverseRow();
};

function moveDown() {
  expandArray();
  slideRigth();
  reverseRow();
  sumSameNumbers();
  slideRigth();
  reverseRow();
  slideRigth();
  expandArray();
}

function moveUp() {
  expandArray();
  slideRigth();
  sumSameNumbers();
  reverseRow();
  slideRigth();
  reverseRow();
  expandArray();
}

function sumSameNumbers() {
  for (let i = 0; i < tableRow.length; i++) {
    for (let x = 0; x < tableRow.length; x++) {
      if (board[i][x] === board[i][x + 1]) {
        const sum = board[i][x] + board[i][x + 1];

        gameScore.innerText = +gameScore.innerText + sum;
        board[i][x] = sum;
        board[i][x + 1] = 0;
      }
    }
  }
  winer();
}

function reverseRow() {
  board.forEach(el => el.reverse());
}

function expandArray() {
  for (let x = 0; x < tableRow.length; x++) {
    for (let y = x; y < tableRow.length; y++) {
      [board[x][y], board[y][x]] = [board[y][x], board[x][y]];
    }
  };
}

function winer() {
  const result = board.some(el => el.includes(2048));

  if (result) {
    messageWiner.classList.remove('hidden');

    return true;
  };
}

function checkZerosAndCanMove() {
  const result = board.some(el => el.includes(0));

  if (!result && !findSameNumbers()) {
    messageLose.classList.remove('hidden');

    return true;
  }
}

function findSameNumbers() {
  for (let i = 1; i < 4; i++) {
    for (let x = 0; x < 4; x++) {
      if (board[i][x] === board[i - 1][x] || board[x][i] === board[x][i - 1]) {
        return true;
      }
    }
  }

  return false;
}

function createCopy(matrix) {
  const clone = createField();

  for (let i = 0; i < board.length; i++) {
    for (let x = 0; x < board.length; x++) {
      clone[i][x] = matrix[i][x];
    }
  }

  return clone;
}

function checkBoard(originalArr, modifyArr) {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board.length; y++) {
      if (originalArr[x][y] !== modifyArr[x][y]) {
        addNumber();

        return;
      }
    }
  }
}
