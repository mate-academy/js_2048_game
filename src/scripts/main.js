'use strict';

// write your code here

const start = document.querySelector('.start');
const gameBoard = document;
const cells = document.querySelectorAll('.field_cell');
const messageStart = document.querySelector('.message_start');
const messageWin = document.querySelector('.message_win');
const scoreBoard = document.querySelector('.game-score');
let score = 0;

let arrayCells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const cellToRemove = [
  'field_cell--2',
  'field_cell--4',
  'field_cell--8',
  'field_cell--16',
  'field_cell--32',
  'field_cell--64',
  'field_cell--128',
  'field_cell--256',
  'field_cell--512',
  'field_cell--1024',
  'field_cell--2048',
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
    messageStart.classList.remove('hidden');

    cleaner();
  }
});

function randomizer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addRandomValues() {
  const value = randomizer(0, cells.length - 1);
  let abc;

  const val = value % 4;

  if (value <= 3) {
    abc = arrayCells[0][val] > 0;
  } else if (value <= 7) {
    abc = arrayCells[1][val] > 0;
  } else if (value <= 11) {
    abc = arrayCells[2][val] > 0;
  } else if (value <= 15) {
    abc = arrayCells[3][val] > 0;
  }

  if (!abc) {
    if (randomizer(1, 10) === 10) {
      cells[value].textContent = '4';
      cells[value].classList.add('field_cell--4');
      toArrayCells(value, 4);
    } else {
      cells[value].textContent = '2';
      cells[value].classList.add('field_cell--2');
      toArrayCells(value);
    }
  } else {
    addRandomValues();
  }
}

function toArrayCells(value, num = 2) {
  const val = value % 4;

  if (num === 2) {
    if (value <= 3) {
      arrayCells[0][val] = 2;
    } else if (value <= 7) {
      arrayCells[1][val] = 2;
    } else if (value <= 11) {
      arrayCells[2][val] = 2;
    } else if (value <= 15) {
      arrayCells[3][val] = 2;
    }
  }

  if (num === 4) {
    if (value <= 3) {
      arrayCells[0][val] = 4;
    } else if (value <= 7) {
      arrayCells[1][val] = 4;
    } else if (value <= 11) {
      arrayCells[2][val] = 4;
    } else if (value <= 15) {
      arrayCells[3][val] = 4;
    }
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
      arrayClassCells[i][j] = `field_cell--${arrayCells[i][j]}`;

      const value = i * 4 + j;

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
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
  ],
  [
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
  ],
  [
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
  ],
  [
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
    `field_cell--${0}`,
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

gameBoard.addEventListener('keydown', function(move) {
  if (
    start.classList.contains('restart')
    && messageWin.classList.contains('hidden')
  ) {
    const arrayCellsOld = JSON.parse(JSON.stringify(arrayCells));
    let result = false;

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

    for (let i = 0; i < arrayCells.length; i++) {
      for (let j = 0; j < arrayCells[i].length; j++) {
        if (arrayCells[i][j] !== arrayCellsOld[i][j]) {
          result = true;
        }
      }
    }

    if (result) {
      addRandomValues();
    }

    scoreBoard.textContent = `${score}`;
  }
});

function moveUp() {
  for (let j = 3; j >= 0; j--) {
    const merger = [true, true, true, true];

    for (let i = 3; i >= 0; i--) { // переміщення по пустих значеннях
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

      if ( // Для переміщення трьох нерівних
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

      if ( // Для переміщення двох нерівних
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

      //

      if ( // Для додавання
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

    for (let i = 3; i >= 0; i--) { // переміщення по пустих значеннях
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
      // переміщення по пустих значеннях
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

      if ( // Для переміщення трьох нерівних
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

      if ( // Для переміщення двох нерівних
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

      //

      if ( // Для додавання
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
      // переміщення по пустих значеннях
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
      // переміщення по пустих значеннях
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

    for (let j = 0; j < arrayCells[i].length; j++) {
      if (// Для переміщення трьох нерівних
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

      if ( // Для переміщення двох нерівних
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

      //

      if ( // Для додавання
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
      // Переміщення по пустих значеннях
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
      if ( // Для проходження пустих значень
        arrayCells[i][j] === 0
        && arrayCells[i][j + 1] !== 0
        && arrayCells[i][j + 1] !== undefined
      ) {
        arrayCells[i][j] = arrayCells[i][j + 1];
        arrayCells[i][j + 1] = 0;
        continue;
      }
    }

    for (let j = arrayCells[i].length - 1; j >= 0; j--) {
      if ( // Для переміщення трьох нерівних
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

      if ( // Для переміщення двох нерівних
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

      //

      if ( // Для додавання
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
      if ( // Для проходження пустих значень
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
