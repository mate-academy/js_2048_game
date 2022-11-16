'use strict';

const gameField = document.querySelector('.game-field');
const fieldRows = document.querySelectorAll('.field-row');
const button = document.querySelector('button');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const cellsCoords = {
  0: [0, 0, 0, 0],
  1: [0, 0, 0, 0],
  2: [0, 0, 0, 0],
  3: [0, 0, 0, 0],
};
let startTouchX;
let startTouchY;
let endTouchX;
let endTouchY;

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    e.target.classList = 'button restart';
    e.target.innerText = 'Restart';
    messageStart.hidden = true;
  } else {
    reset();
  }
  generate();
  generate();
});

gameField.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startTouchX = e.changedTouches[0].clientX;
  startTouchY = e.changedTouches[0].clientY;
});

gameField.addEventListener('touchend', (e) => {
  if (!button.classList.contains('restart')) {
    return;
  }

  endTouchX = e.changedTouches[0].clientX;
  endTouchY = e.changedTouches[0].clientY;

  const directionX = startTouchX - endTouchX;
  const directionY = startTouchY - endTouchY;
  const minSwipe = 50;

  if (directionX > minSwipe && directionX > directionY) {
    return actionMix('left');
  }

  if (directionX < -minSwipe && directionX < directionY) {
    return actionMix('right');
  }

  if (directionY > minSwipe) {
    return actionMix('up');
  }

  if (directionY < -minSwipe) {
    return actionMix('down');
  }
});

document.addEventListener('keyup', (e) => {
  if (!button.classList.contains('restart')) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      actionMix('left');
      break;

    case 'ArrowRight':
      actionMix('right');
      break;

    case 'ArrowUp':
      actionMix('up');
      break;

    case 'ArrowDown':
      actionMix('down');
      break;
  }
});

function actionMix(direction) {
  shift(direction);
  checkEndOfGame();
  generate();
}

function reset() {
  for (const row in cellsCoords) {
    for (let i = 0; i < cellsCoords[row].length; i++) {
      cellsCoords[row][i] = 0;
    }
  }
  messageWin.hidden = true;
  messageLose.hidden = true;
  score.innerText = 0;
  updateGameField();
}

function updateGameField() {
  for (const row in cellsCoords) {
    cellsCoords[row].forEach((num, col) => {
      const cell = fieldRows[row].children[col];

      if (num > 0) {
        cell.innerText = num;
        cell.classList = 'field-cell';
        cell.classList.add(`field-cell--${num}`);
      } else {
        cell.innerText = '';
        cell.classList = 'field-cell';
      }
    });
  }
}

function filterEmpty(cells) {
  return cells.filter(cell => cell !== 0);
}

function addScore(value) {
  score.innerText = +score.innerText + value;
}

function shift(direction) {
  for (const row in cellsCoords) {
    const cellsX = cellsCoords[row];
    const cellsY = [];
    let cells;

    for (let i = 0; i < cellsCoords[row].length; i++) {
      cellsY.push(cellsCoords[i][row]);
    }

    switch (direction) {
      case 'left':
        cells = filterEmpty(cellsX);
        break;

      case 'right':
        cells = filterEmpty(cellsX).reverse();
        break;

      case 'up':
        cells = filterEmpty(cellsY);
        break;

      case 'down':
        cells = filterEmpty(cellsY).reverse();
        break;
    }

    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i] === cells[i + 1]) {
        addScore(cells[i]);
        cells[i] *= 2;
        cells[i + 1] = 0;
      }
    }
    cells = filterEmpty(cells);

    while (cells.length < 4) {
      cells.push(0);
    }

    switch (direction) {
      case 'left':
        cellsCoords[row] = cells;
        break;

      case 'right':
        cellsCoords[row] = cells.reverse();
        break;

      case 'up':
        for (let i = 0; i < cellsCoords[row].length; i++) {
          cellsCoords[i][row] = cells[i];
        }
        break;

      case 'down':
        cells = cells.reverse();

        for (let i = 0; i < cellsCoords[row].length; i++) {
          cellsCoords[i][row] = cells[i];
        }
        break;
    }
  }
}

function generate() {
  let emptyCells = 0;

  for (const row in cellsCoords) {
    cellsCoords[row].forEach(col => {
      if (col === 0) {
        emptyCells++;
      }
    });
  }

  const genNumber = Math.ceil(Math.random() * 10);
  const randomIndex = Math.floor(Math.random() * emptyCells);
  let counter = 0;

  for (const row in cellsCoords) {
    for (let i = 0; i < cellsCoords[row].length; i++) {
      if (cellsCoords[row][i] === 0) {
        if (counter === randomIndex) {
          cellsCoords[row][i] = (genNumber === 1) ? 4 : 2;
        }
        counter++;
      }
    }
  }
  updateGameField();
}

function checkEndOfGame() {
  let win = false;

  for (const row in cellsCoords) {
    win = cellsCoords[row].includes(2048);

    if (win) {
      messageWin.hidden = false;
    }
  }

  let lose = true;

  for (const row in cellsCoords) {
    if (cellsCoords[row].includes(0)) {
      lose = false;
    }

    for (let i = 0; i < cellsCoords[row].length - 1; i++) {
      const cellX = cellsCoords[row][i];
      const nextCellX = cellsCoords[row][i + 1];
      const cellY = cellsCoords[i][row];
      const nextCellY = cellsCoords[i + 1][row];

      if (cellX === nextCellX || cellY === nextCellY) {
        lose = false;
      }
    }
  }

  if (lose) {
    messageLose.hidden = false;
  }
}
