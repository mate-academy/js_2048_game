'use strict';

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let emptyCells = [...cells];

const rows = [...document.querySelectorAll('.field-row')];
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

  const randomCellIndex = randomizeIndex(emptyCells);

  const randomCell = emptyCells[randomCellIndex];
  const randomValue = values[randomizeIndex(values)];

  randomCell.classList = (`field-cell field-cell--${randomValue}`);
  randomCell.innerText = randomValue;

  emptyCells.splice(randomCellIndex, 1);
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

document.addEventListener('keydown', (e) => {
  const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (arrowKeys.includes(e.key)) {
    e.preventDefault();

    const changed = move(e.key);

    if (changed) {
      fillRandomCell();
    }
  }
});

function checkMergePossibility() {
  for (const row of rows) {
    for (let i = 0; i < 3; i++) {
      if (row.children[i].innerText === row.children[i + 1].innerText) {
        return 1;
      }
    }
  }

  for (const column of columns) {
    for (let i = 0; i < 3; i++) {
      if (column[i].innerText === column[i + 1].innerText) {
        return 1;
      }
    }
  }
}

function move(direction) {
  let movesCount = 0;

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

  function rotateCells(group) {
    let rotationsCount = 0;

    for (let i = 3; i > 0; i--) {
      const isThisCellEmpty = emptyCells.includes(group[i]);
      const isPrevCellEmpty = emptyCells.includes(group[i - 1]);
      const canMove = isThisCellEmpty && !isPrevCellEmpty;

      const canMerge = group[i].innerText === group[i - 1].innerText
        && group[i].innerText.length
        && !group[i - 1].dataset.blocked;

      if (canMerge) {
        merge(group[i], group[i - 1]);
        rotationsCount++;
        movesCount++;
      }

      if (canMove) {
        rotate(group[i], group[i - 1]);
        rotationsCount++;
        movesCount++;
      }
    }

    if (rotationsCount > 0) {
      return rotateCells(group);
    }
  }

  function moveRight() {
    rows.forEach(row => {
      const rowChildren = [...row.querySelectorAll('.field-cell')];

      rotateCells(rowChildren);
    });
  }

  function moveLeft() {
    rows.forEach(row => {
      const rowChildren = [...row.querySelectorAll('.field-cell')];

      rotateCells(rowChildren.reverse());
    });
  }

  function moveUp() {
    columns.forEach(column => {
      rotateCells([...column].reverse());
    });
  }

  function moveDown() {
    columns.forEach(column => {
      rotateCells(column);
    });
  }

  const blockedCells = document.querySelectorAll('[data-blocked]');

  blockedCells.forEach(cell => {
    cell.removeAttribute('data-blocked');
  });

  return movesCount;
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
