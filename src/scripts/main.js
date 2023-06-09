'use strict';

const columns = [[], [], [], []];
const rows = [...document.querySelectorAll('.field-row')];
const cells = document.querySelectorAll('.field-cell');
const cellsInRow = rows.map((row) => [...row.querySelectorAll('.field-cell')]);
const startCellVelues = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    columns[j].push(rows[i].children[j]);
  }
}

let clearCells = [...cells];
let started = false;
let rotated = false;

function randomCellFill() {
  if (!clearCells.length) {
    return;
  }

  const randomIndex = (someArr) => Math.floor(Math.random() * someArr.length);
  const randomCell = clearCells[randomIndex(clearCells)];
  const randomValue = startCellVelues[randomIndex(startCellVelues)];

  randomCell.classList = (`field-cell field-cell--${randomValue}`);
  randomCell.innerText = randomValue;

  clearCells.splice(clearCells.indexOf(randomCell), 1);
}

const start = () => {
  startMessage.style = 'display: none;';
  startButton.classList = 'button restart';
  startButton.innerText = 'Restart';

  randomCellFill();
  randomCellFill();
  started = true;
};

const restart = () => {
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  clearCells = [...cells];
  gameScore.innerText = 0;

  cells.forEach(cell => {
    cell.innerText = '';
    cell.className = 'field-cell';
  });

  randomCellFill();
  randomCellFill();
};

function isMergePossible() {
  const wholeField = [...cellsInRow, ...columns];

  for (const line of wholeField) {
    for (let i = 0; i < 3; i++) {
      if (line[i].innerText === line[i + 1].innerText) {
        return true;
      }
    }
  }
}

function upArrow() {
  for (const column of columns) {
    rotateCells([...column].reverse());
  }
}

function downArrow() {
  for (const column of columns) {
    rotateCells(column);
  }
}

function rightArrow() {
  for (const row of cellsInRow) {
    rotateCells(row);
  }
}

function leftArrow() {
  for (const row of cellsInRow) {
    rotateCells([...row].reverse());
  }
}

function arrowMove(direction) {
  if (!clearCells.length && !isMergePossible()) {
    loseMessage.classList.remove('hidden');
  }

  switch (direction) {
    case 'ArrowUp':
      upArrow();
      break;
    case 'ArrowDown':
      downArrow();
      break;
    case 'ArrowRight':
      rightArrow();
      break;
    case 'ArrowLeft':
      leftArrow();
      break;
  }

  cells.forEach(cell => {
    cell.removeAttribute('data-blocked');
  });
}

function deleteElement(element) {
  element.innerText = '';
  element.className = 'field-cell';
  clearCells.push(element);
}

function rotateElement(curr, prev) {
  curr.innerText = prev.innerText;
  curr.className = prev.className;
  clearCells.splice(clearCells.indexOf(curr), 1);
  deleteElement(prev);
}

function cellMerge(curr, prev) {
  const value = curr.innerText * 2;

  curr.innerText = value;
  curr.className = `field-cell field-cell--${value}`;
  gameScore.innerText = +gameScore.innerText + value;
  deleteElement(prev);

  curr.dataset.blocked = true;
  prev.dataset.blocked = true;

  if (value === 2048) {
    winMessage.classList.remove('hidden');
  }
}

function rotateCells(line) {
  for (let i = 3; i > 0; i--) {
    const moveAllowed = clearCells.includes(line[i])
      && !clearCells.includes(line[i - 1]);

    const mergeAllowed = line[i].innerText === line[i - 1].innerText
      && line[i].innerText.length
      && !line[i - 1].dataset.blocked;

    if ((mergeAllowed || moveAllowed) && !rotated) {
      rotated = true;
    }

    if (mergeAllowed) {
      cellMerge(line[i], line[i - 1]);
      rotateCells(line);
    }

    if (moveAllowed) {
      rotateElement(line[i], line[i - 1]);
      rotateCells(line);
    }
  }
}

document.addEventListener('keydown', (evt) => {
  const arrowDirections = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (arrowDirections.includes(evt.key)) {
    evt.preventDefault();
    arrowMove(evt.key);

    if (rotated) {
      randomCellFill();
      rotated = false;
    }
  }
});

startButton.addEventListener('click', () => {
  if (!started) {
    start();
  } else {
    restart();
  }
});
