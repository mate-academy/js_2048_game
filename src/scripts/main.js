'use strict';

const boardSize = 4;

const boardBody = document.querySelector('.game-field').firstElementChild;
const score = document.querySelector('.game-score');
const gameButton = document.querySelector('.start');
const cells = document.querySelectorAll('td');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

for (let r = 0; r < boardSize; r++) {
  for (let c = 0; c < boardSize; c++) {
    const cell = boardBody.children[r].children[c];
    const cellNumber = board[r][c];

    cell.id = r.toString() + '-' + c.toString();

    updateCell(cell, cellNumber);
  }
}

function updateCell(currentCell, number) {
  currentCell.innerText = '';
  currentCell.classList.value = 'field-cell';

  if (number > 0) {
    currentCell.innerText = number;
    currentCell.classList.add(`field-cell--${number}`);
  }
}

gameButton.addEventListener('click', gameClick);

function gameClick(e) {
  const messages = document.querySelectorAll('.message');

  messages.forEach(msg => msg.classList.add('hidden'));

  if (gameButton.innerText === 'Start') {
    window.addEventListener('keydown', start);
    addNewNumber();
    addNewNumber();

    gameButton.removeEventListener('click', gameClick);
  } else {
    window.removeEventListener('keydown', start);

    cells.forEach(cell => {
      cell.innerText = '';
      cell.classList.value = 'field-cell';
    });

    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score.innerText = 0;
    gameButton.classList.value = 'button start';
    gameButton.innerText = 'Start';

    const messageStart = document.querySelector('.message-start');

    messageStart.classList.remove('hidden');
  }
};

function start(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    gameButton.classList.value = 'button restart';
    gameButton.innerText = 'Restart';
    gameButton.addEventListener('click', gameClick);
  }

  switch (e.key) {
    case 'ArrowLeft':
      slide('left');
      break;
    case 'ArrowRight':
      slide('right');
      break;
    case 'ArrowUp':
      slide('up');
      break;
    case 'ArrowDown':
      slide('down');
      break;
    default:
      break;
  }
}

function merge(row) {
  let newRow = clearZeros(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score.innerText = +score.innerText + newRow[i];
    }
  }

  newRow = clearZeros(newRow);
  newRow = addZeros(newRow);

  return newRow;
}

function getRandom(size) {
  return Math.floor(Math.random() * size);
}

function findNumber(number = 0) {
  return board.some(array => {
    return array.some(element => element === number);
  });
}

function canMove() {
  for (let r = 0; r < boardSize - 1; r++) {
    for (let c = 0; c < boardSize - 1; c++) {
      if (board[r][c] === board[r][c + 1]
        || board[r][c] === board[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
}

function addNewNumber() {
  if (!findNumber()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = getRandom(boardSize);
    const c = getRandom(boardSize);
    let random = getRandom(10);

    random = random > 1 ? 2 : 4;

    if (board[r][c] === 0) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      board[r][c] = random;
      cell.innerText = random;
      cell.classList.add(`field-cell--${random}`);
      found = true;
    };
  }
}

function showMessage(type) {
  const message = document.querySelector(`.message-${type}`);

  message.classList.remove('hidden');
  window.removeEventListener('keydown', start);
}

function clearZeros(row) {
  return row.filter(element => element !== 0);
}

function addZeros(row) {
  const newRow = row;

  while (newRow.length < boardSize) {
    newRow.push(0);
  }

  return newRow;
}

function slide(direction) {
  if (direction === 'right' || direction === 'left') {
    slideHorizontally(direction);
  } else {
    slideVertically(direction);
  }

  if (findNumber(64)) {
    showMessage('win');

    return;
  }

  if (!findNumber() && !canMove()) {
    showMessage('lose');

    return;
  }

  addNewNumber();
}

function slideHorizontally(direction) {
  for (let r = 0; r < boardSize; r++) {
    let row = board[r];

    if (direction === 'right') {
      row.reverse();
    }

    row = merge(row);

    if (direction === 'right') {
      row.reverse();
    }

    board[r] = row;

    for (let c = 0; c < boardSize; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const cellNumber = board[r][c];

      updateCell(cell, cellNumber);
    }
  }
}

function slideVertically(direction) {
  for (let c = 0; c < boardSize; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    if (direction === 'down') {
      row.reverse();
    }

    row = merge(row);

    if (direction === 'down') {
      row.reverse();
    }

    for (let r = 0; r < boardSize; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const cellNumber = board[r][c];

      updateCell(cell, cellNumber);
    }
  }
}
