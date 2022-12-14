'use strict';

let fieldGame = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const fieldSize = 4;
let score = 0;
const button = document.querySelector('button');
const fieldRows = document.querySelectorAll('.field-row');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';

    document.querySelector('.message-start')
      .classList.add('hidden');

    addNum();
    addNum();
    updateFieldGame();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';

    document.querySelector('.message-start')
      .classList.remove('hidden');

    fieldGame = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    score = 0;
    updateFieldGame();
  }
});

function addNum() {
  const emptyTD = [];

  fieldGame.forEach((row, indexR) => {
    row.forEach((cell, indexC) => {
      if (cell === 0) {
        emptyTD.push([indexR, indexC]);
      }
    });
  });

  if (emptyTD.length === 0) {
    return;
  }

  const [r, c] = emptyTD[Math.floor(Math.random() * emptyTD.length)];

  fieldGame[r][c] = randomNum();
}

function updateFieldGame() {
  for (let r = 0; r < fieldSize; r++) {
    for (let c = 0; c < fieldSize; c++) {
      if (fieldGame[r][c] === 0) {
        fieldRows[r].children[c].innerHTML = '';
        fieldRows[r].children[c].className = 'field-cell';
      } else {
        fieldRows[r].children[c].innerHTML = fieldGame[r][c];

        fieldRows[r].children[c].className = `
          field-cell field-cell--${fieldGame[r][c]}`;
      }
    }
  }

  endGame();
  document.querySelector('.game-score').innerHTML = score;
}

function randomNum() {
  return Math.random() >= 0.5 ? 4 : 2;
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  addNum();
  updateFieldGame();
});

function withoutZeros(row) {
  return row.filter(el => el !== 0);
}

function slide(row) {
  let newRow = row;

  newRow = withoutZeros(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }

  newRow = withoutZeros(newRow);

  while (newRow.length < fieldSize) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < fieldSize; r++) {
    let row = fieldGame[r];

    row = slide(row);
    fieldGame[r] = row;
  }
}

function moveRight() {
  for (let r = 0; r < fieldSize; r++) {
    let row = fieldGame[r];

    row.reverse();
    row = slide(row);
    fieldGame[r] = row.reverse();
  }
}

function moveUp() {
  for (let c = 0; c < fieldSize; c++) {
    let row = [
      fieldGame[0][c], fieldGame[1][c], fieldGame[2][c], fieldGame[3][c],
    ];

    row = slide(row);

    for (let r = 0; r < fieldSize; r++) {
      fieldGame[r][c] = row[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < fieldSize; c++) {
    let row = [
      fieldGame[0][c], fieldGame[1][c], fieldGame[2][c], fieldGame[3][c],
    ];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < fieldSize; r++) {
      fieldGame[r][c] = row[r];
    }
  }
}

function endGame() {
  const emptyCell = fieldGame.some(arr => arr.some(el => el === 0));

  if (emptyCell) {
    return;
  }

  for (let r = 0; r < fieldSize; r++) {
    for (let c = 0; c < fieldSize - 1; c++) {
      if (fieldGame[r][c] === fieldGame[r][c + 1]
        || fieldGame[c][r] === fieldGame[c + 1][r]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}
