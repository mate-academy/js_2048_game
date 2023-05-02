'use strict';

const table = document.querySelector('tbody');
const startButton = document.querySelector('.start');
const scoreGame = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const rows = 4;
const cols = 4;
let field;

let score = 0;

startButton.addEventListener('click', startGame);

function setRandomNumber() {
  const twoOrFour = Math.random() < 0.2 ? 4 : 2;

  let found = false;

  while (!found) {
    const rowInd = Math.floor(Math.random() * 4);
    const colInd = Math.floor(Math.random() * 4);

    if (!hasEmptyCells(field)) {
      break;
    }

    if (field[rowInd][colInd] === 0) {
      field[rowInd][colInd] = twoOrFour;
      found = true;
    }
  }
  updateGame();
};

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  startButton.innerText = 'Restart';
  startButton.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');

  setRandomNumber();
  setRandomNumber();
};

document.addEventListener('keyup', e => {
  if (startButton.classList.contains('start')) {
    return;
  }

  switch (e.code) {
    case 'ArrowLeft': slideLeft(); break;
    case 'ArrowRight': slideRight(); break;
    case 'ArrowUp': slideUp(); break;
    case 'ArrowDown': slideDown(); break;
    default: break;
  }
  setRandomNumber();
  setRandomNumber();

  updateGame();
});

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentTile = table.rows[r].cells[c];
      const valueOfTile = field[r][c];

      currentTile.innerText = '';
      currentTile.classList.value = '';
      currentTile.className = `field-cell`;

      if (valueOfTile > 0) {
        currentTile.innerText = valueOfTile;
        currentTile.classList.add(`field-cell--${valueOfTile}`);
      }

      if (valueOfTile === 2048) {
        messageWin.classList.remove('hidden');
        startButton.classList.replace('restart', 'start');
        startButton.innerText = 'Start';
      }
    }
  }
  scoreGame.innerText = score;

  if (!canPlay(field)) {
    messageLose.classList.remove('hidden');
    startButton.innerText = 'Start';
  }
};

function filterZero(row) {
  return row.filter(el => el !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  newRow.map((el, ind, arr) => {
    if (arr[ind] === arr[ind + 1]) {
      arr[ind] *= 2;
      arr[ind + 1] = 0;
      score += arr[ind];
    }
  });

  newRow = filterZero(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
};

function slideLeft() {
  field.forEach((row, ind) => {
    field[ind] = slide(row);

    return field[ind];
  });
};

function slideRight() {
  field.forEach((row, ind) => {
    field[ind] = slide(row.reverse());

    return field[ind].reverse();
  });
}

function slideUp() {
  field.forEach((row, ind) => {
    const newRow = slide(
      [field[0][ind], field[1][ind], field[2][ind], field[3][ind]]);

    field[0][ind] = newRow[0];
    field[1][ind] = newRow[1];
    field[2][ind] = newRow[2];
    field[3][ind] = newRow[3];
  });
}

function slideDown() {
  field.forEach((row, ind) => {
    let newRow = [field[3][ind], field[2][ind], field[1][ind], field[0][ind]];

    newRow = slide(newRow).reverse();
    field[0][ind] = newRow[0];
    field[1][ind] = newRow[1];
    field[2][ind] = newRow[2];
    field[3][ind] = newRow[3];
  });
}

function hasEmptyCells(arr) {
  let equal = false;

  arr.forEach((e, i) => {
    e.forEach(el => {
      if (el === 0) {
        equal = true;
      }
    });
  });

  return equal;
}

function canPlay(array) {

  function isEqualInColumns(arr) {
    let equal = false;

    arr.forEach((e, i, a) => {
      e.forEach((el, ind) => {
        if (i < 3 && a[i][ind] === a[i + 1][ind]) {
          equal = true;
        }
      });
    });

    return equal;
  }

  function isEqualInRow(arr) {
    let equal = false;

    arr.forEach((e, i, a) => {
      e.forEach((el, ind) => {
        if (ind < 3 && a[i][ind] === a[i][ind + 1]) {
          equal = true;
        }
      });
    });

    return equal;
  }

  const res1 = hasEmptyCells(array);
  const res2 = isEqualInColumns(array);
  const res3 = isEqualInRow(array);

  return (res1 || res2 || res3);
}
