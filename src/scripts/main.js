'use strict';

const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const msStart = document.querySelector('.message-start');
const msLose = document.querySelector('.message-lose');
const msWin = document.querySelector('.message-win');

let newTable;
let table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const tableLength = table.length;
let SCORE = 0;
const WIN_SCORE = 2048;
let isWin = false;

button.addEventListener('click', () => {
  document.addEventListener('keydown', move);

  if (button.classList.contains('start')) {
    button.classList.toggle('start');
    button.classList.toggle('restart');
    button.innerText = 'Restart';
    msStart.classList.add('hidden');
  } else {
    isWin = false;
    reset();
  }

  addNumber();
  addNumber();
  buildCell();
});

function addNumber() {
  const emptyCells = [];

  table.forEach((r, rIndex) =>
    r.forEach((cell, cIndex) =>
      cell === 0 && emptyCells.push([rIndex, cIndex])
    )
  );

  const [randomY, randomX]
    = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  table[randomY][randomX] = Math.random() < 0.9 ? 2 : 4;
}

function buildCell() {
  for (let r = 0; r < tableLength; r++) {
    for (let c = 0; c < tableLength; c++) {
      const element = fieldRows[r].children[c]; // html .field-cell
      const cell = table[r][c]; // Значення кожної клітинки

      element.textContent = cell || '';

      element.className
        = `field-cell ${cell ? `field-cell--${cell}` : ''}`;
    }
  }

  gameScore.textContent = SCORE;
}

function move(e) {
  newTable = table;

  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    default:
      return;
  }

  if (JSON.stringify(newTable) !== JSON.stringify(table)) {
    table = newTable;
    addNumber();
    buildCell();
  }

  if (isWin) {
    msWin.classList.remove('hidden');
  }

  if (!checkMove()) {
    msLose.classList.remove('hidden');
    msWin.classList.add('hidden');
    document.removeEventListener('keydown', move);
  }
}

function reset() {
  table = table.map((y) => y.map(() => 0));
  SCORE = 0;

  [msWin, msLose].forEach(msg => msg.classList.add('hidden'));
}

function reverseRows() {
  newTable.forEach(y => y.reverse());
}

function moveLeft() {
  if (!checkRows()) {
    return;
  }

  newTable = newTable.map(y => {
    const newY
      = y.filter(cell => cell !== 0)
        .reduce((acc, cell) => {
          const preCell = acc[acc.length - 1];

          if (preCell === cell) {
            acc[acc.length - 1] *= 2;
            SCORE += acc[acc.length - 1];

            if (acc[acc.length - 1] === WIN_SCORE) {
              isWin = true;
            }
          } else {
            acc.push(cell);
          }

          return acc;
        }, []);

    return newY.concat(Array(tableLength - newY.length).fill(0));
  });
}

function moveRight() {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  moveLeft();
  reverseRows();
}

function moveDown() {
  movingField();
  moveRight();
  movingField();
}

function moveUp() {
  movingField();
  moveLeft();
  movingField();
}

function checkColumns() {
  return newTable.some(y =>
    y.some((cell, x) => cell === y[x + 1])
  );
}

function checkRows() {
  return newTable.some(y =>
    y.some((cell, x) => cell === y[x + 1]) || y.includes(0)
  );
}

function movingField() {
  newTable
    = newTable[0].map((_, xIndex) =>
      newTable.map(y => y[xIndex])
    );
}

function checkMove() {
  return checkRows() || (movingField(), checkColumns());
}
