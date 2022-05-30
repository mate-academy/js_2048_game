'use strict';

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let emptyCells = [...cells];

const rows = [...document.querySelectorAll('.field-row')];
const rowCells = [];

rows.forEach(row => {
  const rCells = [...row.querySelectorAll('.field-cell')];

  rowCells.push(rCells);
});

const columns = [[], [], [], []];

for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    columns[c].push(rows[r].children[c]);
  }
}

let started = false;
const values = new Array(10).fill(2, 0, 9).fill(4, 9);

function fillRandomCell() {
  if (!emptyCells.length) {
    return;
  }

  const randomizeIndex = (arr) => Math.floor(Math.random() * arr.length);
  const randomCell = emptyCells[randomizeIndex(emptyCells)];
  const randomValue = values[randomizeIndex(values)];

  randomCell.classList = (`field-cell field-cell--${randomValue}`);
  randomCell.innerText = randomValue;

  emptyCells.splice(emptyCells.indexOf(randomCell), 1);
}

startButton.addEventListener('click', () => {
  const startMessage = document.querySelector('.message-start');

  const start = () => {
    startMessage.style = 'display: none;';
    startButton.classList = 'button restart';
    startButton.innerText = 'Restart';

    fillRandomCell();
    fillRandomCell();
    started = true;
  };

  const restart = () => {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    emptyCells = [...cells];
    score.innerText = 0;

    cells.forEach(cell => {
      cell.innerText = '';
      cell.className = 'field-cell';
    });

    fillRandomCell();
    fillRandomCell();
  };

  if (!started) {
    start();
  } else {
    restart();
  }
});

let rotated = false;

document.addEventListener('keydown', (e) => {
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (arrowKeys.includes(e.key)) {
    e.preventDefault();
    move(e.key);

    if (rotated) {
      fillRandomCell();
      rotated = false;
    }
  }
});

function checkMergePossibility() {
  const columnsAndRows = [...rowCells, ...columns];

  for (const group of columnsAndRows) {
    for (let i = 0; i < 3; i++) {
      if (group[i].innerText === group[i + 1].innerText) {
        return 1;
      }
    }
  }
}

function move(direction) {
  if (!emptyCells.length && !checkMergePossibility()) {
    loseMessage.classList.remove('hidden');
  }

  switch (direction) {
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  }

  cells.forEach(cell => {
    cell.removeAttribute('data-blocked');
  });
}

function moveRight() {
  for (const row of rowCells) {
    rotateCells(row);
  }
}

function moveLeft() {
  for (const row of rowCells) {
    rotateCells([...row].reverse());
  }
}

function moveUp() {
  for (const column of columns) {
    rotateCells([...column].reverse());
  }
}

function moveDown() {
  for (const column of columns) {
    rotateCells(column);
  }
}

function rotateCells(group) {
  for (let i = 3; i > 0; i--) {
    const canMove = emptyCells.includes(group[i])
      && !emptyCells.includes(group[i - 1]);

    const canMerge = group[i].innerText === group[i - 1].innerText
      && group[i].innerText.length
      && !group[i - 1].dataset.blocked;

    if ((canMerge || canMove) && !rotated) {
      rotated = true;
    }

    if (canMerge) {
      merge(group[i], group[i - 1]);
      rotateCells(group);
    }

    if (canMove) {
      rotate(group[i], group[i - 1]);
      rotateCells(group);
    }
  }
}

function removeItem(item) {
  item.innerText = '';
  item.className = 'field-cell';
  emptyCells.push(item);
}

function rotate(current, prev) {
  current.innerText = prev.innerText;
  current.className = prev.className;
  emptyCells.splice(emptyCells.indexOf(current), 1);
  removeItem(prev);
}

function merge(current, prev) {
  const value = current.innerText * 2;

  current.innerText = value;
  current.className = `field-cell field-cell--${value}`;
  score.innerText = +score.innerText + value;
  removeItem(prev);

  current.dataset.blocked = true;
  prev.dataset.blocked = true;

  if (value === 2048) {
    winMessage.classList.remove('hidden');
  }
}
