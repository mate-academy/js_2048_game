'use strict';

const columns = [[], [], [], []];
const rows = Array.from(document.querySelectorAll('.field-row'));
const cells = document.querySelectorAll('.field-cell');
const cellsInRow = rows.map(row => [...row.querySelectorAll('.field-cell')]);

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    columns[j].push(rows[i].children[j]);
  }
}

const button = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const moveSound = document.getElementById('audio-move');
const looseSound = document.getElementById('audio-loose');
const winSound = document.getElementById('audio-win');

let clearCells = [...cells];

function getRandomCell() {
  return clearCells[Math.floor(Math.random() * clearCells.length)];
}

function getCellValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function newCell() {
  if (!clearCells.length) {
    return;
  }

  const randomCell = getRandomCell();
  const randomValue = getCellValue();

  randomCell.className = `field-cell field-cell--${randomValue}`;
  randomCell.innerText = randomValue;

  clearCells.splice(clearCells.indexOf(randomCell), 1);
}

let started = false;

function startGame() {
  startMessage.style.display = 'none';
  button.className = 'button restart';
  button.innerText = 'Restart';

  newCell();
  newCell();
  started = true;
}

function restartGame() {
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  clearCells = [...cells];
  score.innerText = 0;

  cells.forEach(cell => {
    cell.innerText = '';
    cell.className = 'field-cell';
  });

  newCell();
  newCell();
}

button.addEventListener('click', () => {
  if (!started) {
    startGame();
  } else {
    restartGame();
  }
});

function canBeMerged() {
  const wholeField = [...cellsInRow, ...columns];

  return wholeField.forEach((line) => {
    for (let i = 0; i < 3; i++) {
      if (line[i].innerText === line[i + 1].innerText) {
        return true;
      }
    }

    return false;
  });
}

let flipped = false;

function flipLine(line) {
  for (let i = 3; i > 0; i--) {
    const canBeMooved = clearCells.includes(line[i])
      && !clearCells.includes(line[i - 1]);
    const mergeAllowed = line[i].innerText === line[i - 1].innerText
      && line[i].innerText.length
      && !line[i - 1].dataset.blocked;

    if ((mergeAllowed || canBeMooved) && !flipped) {
      flipped = true;
    }

    if (mergeAllowed) {
      mergeCells(line[i], line[i - 1]);
      flipLine(line);
    }

    if (canBeMooved) {
      flipElements(line[i], line[i - 1]);
      flipLine(line);
    }
  }
}

function mergeCells(curr, prev) {
  const value = curr.innerText * 2;

  curr.innerText = value;
  curr.className = `field-cell field-cell--${value}`;
  score.innerText = +score.innerText + value;
  deleteElement(prev);

  curr.dataset.blocked = true;
  prev.dataset.blocked = true;

  if (value === 2048) {
    winMessage.classList.remove('hidden');
    winSound.currentTime = 0;
    winSound.play();
  }
}

function flipElements(curr, prev) {
  curr.innerText = prev.innerText;
  curr.className = prev.className;
  clearCells = clearCells.filter(cell => cell !== curr);
  deleteElement(prev);
}

function deleteElement(element) {
  element.innerText = '';
  element.className = 'field-cell';
  clearCells.push(element);
}

function getDirection(direction) {
  if (!clearCells.length && !canBeMerged()) {
    loseMessage.classList.remove('hidden');
    looseSound.currentTime = 0;
    looseSound.play();
  }

  const up = 'ArrowUp';
  const down = 'ArrowDown';
  const right = 'ArrowRight';
  const left = 'ArrowLeft';

  switch (direction) {
    case up:
      columns.forEach((column) => {
        flipLine([...column].reverse());
      });
      break;

    case down:
      columns.forEach((column) => {
        flipLine(column);
      });
      break;

    case right:
      cellsInRow.forEach((row) => {
        flipLine(row);
      });
      break;

    case left:
      cellsInRow.forEach((row) => {
        flipLine([...row].reverse());
      });
      break;
  }

  cells.forEach(cell => {
    cell.removeAttribute('data-blocked');
  });
}

document.body.addEventListener('keydown', (evnt) => {
  const arrowDirections = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ];

  if (arrowDirections.includes(evnt.key)) {
    evnt.preventDefault();
    getDirection(evnt.key);

    if (flipped) {
      moveSound.currentTime = 0;
      moveSound.play();
      newCell();
      flipped = false;
    }
  }
});
