'use strict';

const rows = [...document.querySelectorAll('.field-row')];
const columns = [[], [], [], []];
const cells = document.querySelectorAll('.field-cell');
const cellsInRow = rows.map((row) => [...row.querySelectorAll('.field-cell')]);
const startCellVelues = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    columns[j].push(rows[i].children[j]);
  }
}

let clearCells = [...cells];
let started = false;
let rotated = false;

const randomCellFill = () => {
  if (!clearCells.length) {
    return;
  }

  const randomIndex = (someArr) => Math.floor(Math.random() * someArr.length);
  const randomCell = clearCells[randomIndex(clearCells)];
  const randomValue = startCellVelues[randomIndex(startCellVelues)];

  randomCell.classList = (`field-cell field-cell--${randomValue}`);
  randomCell.innerText = randomValue;

  clearCells.splice(clearCells.indexOf(randomCell), 1);
};

const start = () => {
  messageStart.style = 'display: none;';
  startButton.classList = 'button restart';
  startButton.innerText = 'Restart';

  randomCellFill();
  randomCellFill();
  started = true;
};

const restart = () => {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  clearCells = [...cells];
  score.innerText = 0;

  cells.forEach(cell => {
    cell.innerText = '';
    cell.className = 'field-cell';
  });

  randomCellFill();
  randomCellFill();
};

const isMergePossible = () => {
  const wholeField = [...cellsInRow, ...columns];

  for (const line of wholeField) {
    for (let i = 0; i < 3; i++) {
      if (line[i].innerText === line[i + 1].innerText) {
        return true;
      }
    }
  }
};

const deleteCell = (element) => {
  element.innerText = '';
  element.className = 'field-cell';
  clearCells.push(element);
};

const cellMerge = (curr, prev) => {
  const value = curr.innerText * 2;

  curr.innerText = value;
  curr.className = `field-cell field-cell--${value}`;
  score.innerText = +score.innerText + value;
  deleteCell(prev);

  curr.dataset.blocked = true;
  prev.dataset.blocked = true;

  if (value === 2048) {
    messageWin.classList.remove('hidden');
  }
};

const rotateCell = (curr, prev) => {
  curr.innerText = prev.innerText;
  curr.className = prev.className;
  clearCells.splice(clearCells.indexOf(curr), 1);
  deleteCell(prev);
};

const arrowUp = () => {
  for (const column of columns) {
    rotateCells([...column].reverse());
  }
};

const arrowDown = () => {
  for (const column of columns) {
    rotateCells(column);
  }
};

const arrowRight = () => {
  for (const row of cellsInRow) {
    rotateCells(row);
  }
};

const arrowLeft = () => {
  for (const row of cellsInRow) {
    rotateCells([...row].reverse());
  }
};

const arrowMove = (direction) => {
  if (!clearCells.length && !isMergePossible()) {
    messageLose.classList.remove('hidden');
  }

  switch (direction) {
    case 'ArrowUp':
      arrowUp();
      break;
    case 'ArrowDown':
      arrowDown();
      break;
    case 'ArrowRight':
      arrowRight();
      break;
    case 'ArrowLeft':
      arrowLeft();
      break;
    default: break;
  }

  cells.forEach(cell => {
    cell.removeAttribute('data-blocked');
  });
};

const rotateCells = (line) => {
  for (let i = 3; i > 0; i--) {
    const isMoveAllowed = clearCells.includes(line[i])
      && !clearCells.includes(line[i - 1]);

    const mergeAllowed = line[i].innerText === line[i - 1].innerText
      && line[i].innerText.length
      && !line[i - 1].dataset.blocked;

    if ((mergeAllowed || isMoveAllowed) && !rotated) {
      rotated = true;
    }

    if (mergeAllowed) {
      cellMerge(line[i], line[i - 1]);
      rotateCells(line);
    }

    if (isMoveAllowed) {
      rotateCell(line[i], line[i - 1]);
      rotateCells(line);
    }
  }
};

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
