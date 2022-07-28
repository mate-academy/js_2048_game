'use strict';

function createBoard() {
  gameBoard.innerHTML = '';

  for (let i = 0; i < square; i++) {
    for (let j = 0; j < square; j++) {
      const cell = document.createElement('div');

      cell.className = 'field-cell';
      cell.id = `${i + '-' + j}`;
      gameBoard.append(cell);
    }
  }
  root.firstElementChild.after(gameBoard);
  root.style.width = square * cellSize + (square - 1) * gapSize + 'px';
}

function generate() {
  const probability = Math.random();
  const rowIndex = Math.floor(Math.random() * square);
  const columnIndex = Math.floor(Math.random() * square);
  let newValue = 2;

  if (probability <= 0.1) {
    newValue = 4;
  }

  if (values[rowIndex][columnIndex] === 0) {
    values[rowIndex][columnIndex] = newValue;

    const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);

    updateBoard(cell, newValue);
  } else {
    generate();
  }
}

function updateBoard(cell, value) {
  cell.innerText = value === 0 ? '' : value;
  cell.className = '';
  cell.classList.add('field-cell');
  cell.classList.add(`field-cell--${value}`);
}

function moveRow(direction, check) {
  needNewValue = false;

  for (let rowIndex = 0; rowIndex < square; rowIndex++) {
    let row = values[rowIndex];

    if (direction === 'right') {
      row.reverse();
    }

    row = slide(row, check);

    if (direction === 'right') {
      row.reverse();
    }

    values[rowIndex] = row;

    if (!check) {
      for (let columnIndex = 0; columnIndex < square; columnIndex++) {
        const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);
        const value = values[rowIndex][columnIndex];

        updateBoard(cell, value);
      }
    }
  }
}

function moveColumn(direction, check) {
  needNewValue = false;

  for (let columnIndex = 0; columnIndex < square; columnIndex++) {
    let row = [];

    for (let rowIndex = 0; rowIndex < square; rowIndex++) {
      row.push(values[rowIndex][columnIndex]);
    }

    if (direction === 'down') {
      row.reverse();
    }

    row = slide(row, check);

    if (direction === 'down') {
      row.reverse();
    }

    if (!check) {
      for (let rowIndex = 0; rowIndex < square; rowIndex++) {
        values[rowIndex][columnIndex] = row[rowIndex];

        const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);
        const value = values[rowIndex][columnIndex];

        updateBoard(cell, value);
      }
    }
  }
}

function slide(row, check) {
  let newRow = row.filter(num => num !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      if (!check) {
        score += newRow[i];
        scoreElement.innerText = score;
      }

      if (newRow[i] === 2048) {
        messages.querySelector('.message-win').classList.remove('hidden');
        document.removeEventListener('keydown', moveHandler);
      }
    }
  }
  newRow = newRow.filter(num => num !== 0);

  while (newRow.length < square) {
    newRow.push(0);
  }

  for (let i = 0; i < square; i++) {
    if (newRow[i] !== row[i]) {
      needNewValue = true;
      break;
    }
  }

  return newRow;
}

function moveHandler(e) {
  switch (e.key) {
    case 'ArrowLeft':
      moveRow('left');
      break;
    case 'ArrowRight':
      moveRow('right');
      break;
    case 'ArrowUp':
      moveColumn('up');
      break;
    case 'ArrowDown':
      moveColumn('down');
      break;
  }

  if (needNewValue) {
    generate();
  } else if (values.some(row => row.some(cell => cell === 0))) {
    return 0;
  } else {
    const prevValues = values.map(row => row.slice());

    moveColumn('up', 'check');

    if (!needNewValue) {
      moveColumn('down', 'check');

      if (!needNewValue) {
        moveColumn('right', 'check');

        if (!needNewValue) {
          moveColumn('left', 'check');
        }
      }
    }

    if (needNewValue) {
      needNewValue = false;
      values = prevValues;
    } else {
      document.removeEventListener('keydown', moveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchstart', touchStartHandler);
      document.removeEventListener('touchend', touchEndHandler);
      messages.querySelector('.message-lose').classList.remove('hidden');
    }
  }
}

function touchMoveHandler(e) {
  e.preventDefault();
}

function touchStartHandler(e) {
  touchStart = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
}

function touchEndHandler(e) {
  touchEnd = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

  const direction = touchEnd.map((item, index) => item - touchStart[index]);

  if (direction[0] === 0 && direction[1] === 0) {
    return;
  }

  if (Math.abs(direction[0]) > Math.abs(direction[1])) {
    if (direction[0] > 0) {
      moveHandler({ key: 'ArrowRight' });
    } else {
      moveHandler({ key: 'ArrowLeft' });
    }
  } else {
    if (direction[1] > 0) {
      moveHandler({ key: 'ArrowDown' });
    } else {
      moveHandler({ key: 'ArrowUp' });
    }
  }
}

const button = document.querySelector('.start');
const messages = document.querySelector('.message-container');
const levels = document.querySelector('.levels');
const scoreElement = document.querySelector('.game-score');
const root = document.querySelector('.container');

const cellSize = 75;
const gapSize = 10;

let isStarted = false;
let square = 4;
let score = 0;
let needNewValue = false;
let values = Array(square).fill([]).map(row => Array(square).fill(0));
let touchStart = [];
let touchEnd = [];

const gameBoard = document.createElement('div');

gameBoard.className = 'game-field';

createBoard();

levels.addEventListener('click', click => {
  if (!click.target.matches('.level')) {
    return;
  }

  if (square !== +click.target.value) {
    square = +click.target.value;
    click.target.classList.add('selected');

    if (click.target.nextElementSibling) {
      click.target.nextElementSibling.classList.remove('selected');
    } else {
      click.target.previousElementSibling.classList.remove('selected');
    }

    values = Array(square).fill([]).map(row => Array(square).fill(0));

    createBoard();

    if (isStarted) {
      const newEvent = new MouseEvent('click');

      button.dispatchEvent(newEvent);
    }
  }
});

button.addEventListener('click', click => {
  if (!isStarted) {
    click.currentTarget.innerText = 'Restart';
    click.currentTarget.className = 'button restart';
    isStarted = true;
  } else {
    values = Array(square).fill([]).map(row => Array(square).fill(0));
    score = 0;

    [...gameBoard.children].forEach(cell => {
      updateBoard(cell, 0);
    });
  }

  click.currentTarget.blur();

  [...messages.children].forEach(message => {
    message.classList.add('hidden');
  });

  generate();
  generate();

  document.addEventListener('keydown', moveHandler);
  document.addEventListener('touchmove', touchMoveHandler, { passive: false });
  document.addEventListener('touchstart', touchStartHandler);
  document.addEventListener('touchend', touchEndHandler);
});
