'use strict';

const start = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreBoard = document.querySelector('.game-score');
let score = 0;

let arrayCells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const cellToRemove = [
  'field-cell--2',
  'field-cell--4',
  'field-cell--8',
  'field-cell--16',
  'field-cell--32',
  'field-cell--64',
  'field-cell--128',
  'field-cell--256',
  'field-cell--512',
  'field-cell--1024',
  'field-cell--2048',
];

start.addEventListener('click', function() {
  if (this.classList.contains('start')) {
    this.textContent = 'Restart';

    this.classList.remove('start');
    this.classList.add('restart');
    messageStart.classList.add('hidden');

    addRandomValues();
    addRandomValues();
  } else {
    this.textContent = 'Start';

    this.classList.remove('restart');
    this.classList.add('start');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');

    cleaner();
  }
});

function randomizer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addRandomValues() {
  const value1 = randomizer(0, cells.length - 1);
  const value2 = randomizer(0, cells.length - 1);

  const row = value1 % 4;
  const col = value2 % 4;

  const position = col * 4 + row;

  if (arrayCells[col][row] === 0) {
    if (randomizer(1, 10) === 10) {
      cells[position].textContent = '4';
      cells[position].classList.add('field-cell--4');
      arrayCells[col][row] = 4;
    } else {
      cells[position].textContent = '2';
      cells[position].classList.add('field-cell--2');
      arrayCells[col][row] = 2;
    }
  } else {
    addRandomValues();
  }
}

function cleaner() {
  cells.forEach(cell => {
    cell.textContent = '';

    cellToRemove.forEach(Name => {
      cell.classList.remove(Name);
    });
  });

  arrayCells = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreBoard.textContent = `${score}`;
}

function refresh() {
  for (let i = 0; i < arrayClassCells.length; i++) {
    for (let j = 0; j < arrayClassCells[i].length; j++) {
      arrayClassCells[i][j] = `field-cell--${arrayCells[i][j]}`;

      const value = i * 4 + j;

      cellToRemove.forEach(Name => {
        cells[value].classList.remove(Name);
      });
      cells[value].textContent = ``;

      if (arrayCells[i][j] !== 0) {
        cells[value].classList.add(arrayClassCells[i][j]);
        cells[value].textContent = `${arrayCells[i][j]}`;
      }

      if (arrayCells[i][j] === 0) {
        cellToRemove.forEach(Name => {
          cells[value].classList.remove(Name);
        });
        cells[value].textContent = ``;
      }
    }
  }
}

const arrayClassCells = [
  [
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
  ],
  [
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
  ],
  [
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
  ],
  [
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
    `field-cell--${0}`,
  ],
];

function victory() {
  for (let i = 0; i < arrayCells.length; i++) {
    for (let j = 0; j < arrayCells[i].length; j++) {
      if (arrayCells[i][j] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}

function defeat() {
  let canMove = false;

  for (let i = 0; i < arrayCells.length; i++) {
    for (let j = 0; j < arrayCells[i].length; j++) {
      if (
        arrayCells[i][j] === arrayCells[i][j + 1]
        || arrayCells[i][j] === arrayCells[i][j - 1]
        || arrayCells[i][j - 1] === 0
        || arrayCells[i][j + 1] === 0
      ) {
        canMove = true;
      }
    }
  }

  for (let j = 0; j < arrayCells[0].length; j++) {
    for (let i = 0; i < arrayCells.length; i++) {
      if (
        (i < 3 && arrayCells[i][j] === arrayCells[i + 1][j])
        || (i > 0 && arrayCells[i][j] === arrayCells[i - 1][j])
        || (i > 0 && arrayCells[i - 1][j] === 0)
        || (i < 3 && arrayCells[i + 1][j] === 0)
      ) {
        canMove = true;
      }
    }
  }

  if (!canMove) {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', function(move) {
  if (
    start.classList.contains('restart')
    && messageWin.classList.contains('hidden')
    && messageLose.classList.contains('hidden')
  ) {
    const arrayCellsOld = JSON.parse(JSON.stringify(arrayCells));
    let canMove = false;

    if (move.key === 'ArrowUp') {
      moveUp();
      refresh();
    }

    if (move.key === 'ArrowDown') {
      moveDown();
      refresh();
    }

    if (move.key === 'ArrowRight') {
      moveRight();
      refresh();
    }

    if (move.key === 'ArrowLeft') {
      moveLeft();
      refresh();
    }

    victory();
    defeat();

    for (let i = 0; i < arrayCells.length; i++) {
      for (let j = 0; j < arrayCells[i].length; j++) {
        if (arrayCells[i][j] !== arrayCellsOld[i][j]) {
          canMove = true;
        }
      }
    }

    if (canMove) {
      addRandomValues();
    }

    scoreBoard.textContent = `${score}`;
  }
});

function moveUp() {
  for (let j = 3; j >= 0; j--) {
    const merger = [true, true, true, true];

    for (let i = 3; i >= 0; i--) {
      if (
        i === 3
        && arrayCells[i][j] !== 0
        && arrayCells[i - 1][j] === 0
        && arrayCells[i - 2][j] !== 0
        && arrayCells[i - 3][j] === 0
      ) {
        arrayCells[i - 3][j] = arrayCells[i - 2][j];
        arrayCells[i - 2][j] = arrayCells[i][j];
        arrayCells[i - 1][j] = 0;
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i === 3
        && arrayCells[i][j] !== 0
        && arrayCells[i - 1][j] !== 0
        && arrayCells[i - 2][j] !== 0
        && arrayCells[i - 3][j] === 0
      ) {
        arrayCells[i - 3][j] = arrayCells[i - 2][j];
        arrayCells[i - 2][j] = arrayCells[i - 1][j];
        arrayCells[i - 1][j] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i >= 2
        && arrayCells[i - 2][j] === 0
        && arrayCells[i - 1][j] !== 0
        && arrayCells[i][j] !== 0
        && arrayCells[i][j] !== arrayCells[i - 1][j]
      ) {
        arrayCells[i - 2][j] = arrayCells[i - 1][j];
        arrayCells[i - 1][j] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i < 3
        && arrayCells[i + 1][j] !== undefined
        && arrayCells[i + 1][j] !== 0
        && arrayCells[i][j] === 0
      ) {
        arrayCells[i][j] = arrayCells[i + 1][j];
        arrayCells[i + 1][j] = 0;
        continue;
      }

      if (
        i < 3
        && arrayCells[i + 1][j] !== undefined
        && arrayCells[i + 1][j] !== 0
        && arrayCells[i][j] === arrayCells[i + 1][j]
        && merger[i] === true
        && merger[i + 1] === true
      ) {
        arrayCells[i][j] += arrayCells[i][j];
        arrayCells[i + 1][j] = 0;
        merger[i] = false;
        score += arrayCells[i][j];
        continue;
      }
    }

    for (let i = 3; i >= 0; i--) {
      if (
        i < 3
        && arrayCells[i + 1][j] !== undefined
        && arrayCells[i + 1][j] !== 0
        && arrayCells[i][j] === 0
      ) {
        arrayCells[i][j] = arrayCells[i + 1][j];
        arrayCells[i + 1][j] = 0;
        continue;
      }
    }
  }
}

function moveDown() {
  for (let j = 0; j < arrayCells[0].length; j++) {
    const merger = [true, true, true, true];

    for (let i = 0; i < arrayCells.length; i++) {
      if (
        i === 0
        && arrayCells[i][j] !== 0
        && arrayCells[i + 1][j] === 0
        && arrayCells[i + 2][j] !== 0
        && arrayCells[i + 3][j] === 0
      ) {
        arrayCells[i + 3][j] = arrayCells[i + 2][j];
        arrayCells[i + 2][j] = arrayCells[i][j];
        arrayCells[i + 1][j] = 0;
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i === 0
        && arrayCells[i][j] !== 0
        && arrayCells[i + 1][j] !== 0
        && arrayCells[i + 2][j] !== 0
        && arrayCells[i + 3][j] === 0
      ) {
        arrayCells[i + 3][j] = arrayCells[i + 2][j];
        arrayCells[i + 2][j] = arrayCells[i + 1][j];
        arrayCells[i + 1][j] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i < 2
        && arrayCells[i][j] !== 0
        && arrayCells[i + 1][j] !== 0
        && arrayCells[i + 2][j] === 0
        && arrayCells[i][j] !== arrayCells[i + 1][j]
      ) {
        arrayCells[i + 2][j] = arrayCells[i + 1][j];
        arrayCells[i + 1][j] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        i > 0
        && arrayCells[i][j] === 0
        && arrayCells[i - 1][j] !== 0
        && arrayCells[i - 1][j] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i - 1][j];
        arrayCells[i - 1][j] = 0;
        continue;
      }

      if (
        i > 0
        && arrayCells[i - 1][j] !== 0
        && arrayCells[i][j] === arrayCells[i - 1][j]
        && arrayCells[i - 1][j] !== undefined
        && merger[i] === true
        && merger[i - 1] === true
      ) {
        arrayCells[i][j] += arrayCells[i][j];
        arrayCells[i - 1][j] = 0;
        merger[i] = false;
        score += arrayCells[i][j];
        continue;
      }
    }

    for (let i = 0; i < arrayCells.length; i++) {
      if (
        i > 0
        && arrayCells[i][j] === 0
        && arrayCells[i - 1][j] !== 0
        && arrayCells[i - 1][j] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i - 1][j];
        arrayCells[i - 1][j] = 0;
        continue;
      }
    }
  }
}

function moveRight() {
  for (let i = 0; i < arrayCells.length; i++) {
    const merger = [true, true, true, true];

    for (let j = 0; j < arrayCells[i].length; j++) {
      if (
        arrayCells[i][j + 1] !== 0
        && arrayCells[i][j + 2] !== 0
        && arrayCells[i][j] !== 0
        && arrayCells[i][j + 3] === 0
      ) {
        arrayCells[i][j + 3] = arrayCells[i][j + 2];
        arrayCells[i][j + 2] = arrayCells[i][j + 1];
        arrayCells[i][j + 1] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        arrayCells[i][j - 1] !== 0
        && arrayCells[i][j - 1] !== undefined
        && arrayCells[i][j] !== arrayCells[i][j - 1]
        && arrayCells[i][j] !== 0
        && arrayCells[i][j + 1] === 0
      ) {
        arrayCells[i][j + 1] = arrayCells[i][j];
        arrayCells[i][j] = arrayCells[i][j - 1];
        arrayCells[i][j - 1] = 0;
        continue;
      }

      if (
        arrayCells[i][j] === 0
        && arrayCells[i][j - 1] !== 0
        && arrayCells[i][j - 1] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i][j - 1];
        arrayCells[i][j - 1] = 0;
        continue;
      }

      if (
        arrayCells[i][j - 1] !== 0
        && arrayCells[i][j] === arrayCells[i][j - 1]
        && arrayCells[i][j - 1] !== undefined
        && merger[j] === true
        && merger[j - 1] === true
      ) {
        arrayCells[i][j] += arrayCells[i][j];
        arrayCells[i][j - 1] = 0;
        merger[j] = false;
        score += arrayCells[i][j];
        continue;
      }
    }

    for (let j = 0; j < arrayCells[i].length; j++) {
      if (
        arrayCells[i][j] === 0
        && arrayCells[i][j - 1] !== 0
        && arrayCells[i][j - 1] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i][j - 1];
        arrayCells[i][j - 1] = 0;
        continue;
      }
    }
  }
};

function moveLeft() {
  for (let i = arrayCells.length - 1; i >= 0; i--) {
    const merger = [true, true, true, true];

    for (let j = arrayCells[i].length - 1; j >= 0; j--) {
      if (
        arrayCells[i][j - 1] !== 0
        && arrayCells[i][j - 2] !== 0
        && arrayCells[i][j] !== 0
        && arrayCells[i][j - 3] === 0
      ) {
        arrayCells[i][j - 3] = arrayCells[i][j - 2];
        arrayCells[i][j - 2] = arrayCells[i][j - 1];
        arrayCells[i][j - 1] = arrayCells[i][j];
        arrayCells[i][j] = 0;
        continue;
      }

      if (
        arrayCells[i][j + 1] !== 0
        && arrayCells[i][j + 1] !== undefined
        && arrayCells[i][j] !== arrayCells[i][j - 1]
        && arrayCells[i][j] !== 0
        && arrayCells[i][j - 1] === 0
      ) {
        arrayCells[i][j - 1] = arrayCells[i][j];
        arrayCells[i][j] = arrayCells[i][j + 1];
        arrayCells[i][j + 1] = 0;
        continue;
      }

      if (
        arrayCells[i][j] === 0
        && arrayCells[i][j + 1] !== 0
        && arrayCells[i][j + 1] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i][j + 1];
        arrayCells[i][j + 1] = 0;
        continue;
      }

      if (
        arrayCells[i][j + 1] !== 0
        && arrayCells[i][j] === arrayCells[i][j + 1]
        && arrayCells[i][j + 1] !== undefined
        && merger[j] === true
        && merger[j + 1] === true
      ) {
        arrayCells[i][j] += arrayCells[i][j];
        arrayCells[i][j + 1] = 0;
        merger[j] = false;
        score += arrayCells[i][j];
        continue;
      }
    }

    for (let j = arrayCells[i].length - 1; j >= 0; j--) {
      if (
        arrayCells[i][j] === 0
        && arrayCells[i][j + 1] !== 0
        && arrayCells[i][j + 1] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i][j + 1];
        arrayCells[i][j + 1] = 0;
        continue;
      }
    }
  }
}
