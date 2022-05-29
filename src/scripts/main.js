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

function move(direction) {
  let movesCount = 0;
  let cellsMerged = [];

  function movesLeft() {
    let count = 0;

    rows.forEach(row => {
      for (let i = 0; i < 3; i++) {
        if (row.children[i].innerText === row.children[i + 1].innerText) {
          count++;
        }
      }
    });

    if (count > 0) {
      return 1;
    }

    columns.forEach(column => {
      for (let i = 0; i < 3; i++) {
        if (column[i].innerText === column[i + 1].innerText) {
          count++;
        }
      }
    });

    if (count > 0) {
      return 1;
    }

    return 0;
  }

  if (!emptyCells.length) {
    if (!movesLeft()) {
      loseMessage.classList.remove('hidden');
    }
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

    const rotate = (current, prev) => {
      current.innerText = prev.innerText;
      prev.innerText = '';
      current.className = prev.className;
      prev.className = 'field-cell';
      emptyCells.splice(emptyCells.indexOf(current), 1);
      emptyCells.push(prev);
      rotationsCount++;
    };

    const merge = (current, prev) => {
      const value = current.innerText * 2;

      current.innerText = value;
      current.className = `field-cell field-cell--${value}`;
      prev.innerText = '';
      prev.className = 'field-cell';
      emptyCells.push(prev);
      score.innerText = +score.innerText + value;
      rotationsCount++;

      if (value === 2048) {
        winMessage.classList.remove('hidden');
      }
    };

    for (let i = 3; i > 0; i--) {
      const isThisCellEmpty = emptyCells.includes(group[i]);
      const isPrevCellEmpty = emptyCells.includes(group[i - 1]);
      const canMove = isThisCellEmpty && !isPrevCellEmpty;

      const canMerge = group[i].innerText === group[i - 1].innerText
        && group[i].innerText.length
        && !cellsMerged.includes(group[i]);

      if (canMerge) {
        merge(group[i], group[i - 1]);
        cellsMerged.push(group[i], group[i - 1]);
        movesCount++;
      }

      if (canMove) {
        rotate(group[i], group[i - 1]);
        movesCount++;
      }
    }

    if (rotationsCount > 0) {
      return rotateCells(group);
    }
  }

  function getChildren(group) {
    const children = [];

    for (let i = 0; i <= 3; i++) {
      children.push(group.children[i]);
    }

    return children;
  }

  function moveRight() {
    rows.forEach(row => {
      const rowChildren = getChildren(row);

      rotateCells(rowChildren);
    });
  }

  function moveLeft() {
    rows.forEach(row => {
      const rowChildren = getChildren(row);

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
  cellsMerged = [];

  return movesCount;
}
