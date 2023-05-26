'use strict';

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
const cellsLength = 4;
let gameClickBehavior = false;

const button = document.querySelector('.button');
const fieldRow = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  gameClickBehavior = true;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');

    handleAddNumber();
    handleAddNumber();
    updateFieldCell();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    gameClickBehavior = false;

    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    updateFieldCell();
  }
});

function getRandomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
};

function handleAddNumber() {
  const emptyRows = [];

  gameField.forEach((row, indexRow) => {
    row.forEach((cell, indexCell) => {
      if (cell === 0) {
        emptyRows.push([indexRow, indexCell]);
      }
    });
  });

  if (emptyRows.length === 0) {
    return;
  }

  const [r, c] = emptyRows[Math.floor(Math.random() * emptyRows.length)];

  gameField[r][c] = getRandomNumber();
};

function updateFieldCell() {
  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength; c++) {
      if (gameField[r][c] === 0) {
        fieldRow[r].children[c].innerHTML = '';
        fieldRow[r].children[c].className = 'field-cell';
      } else {
        fieldRow[r].children[c].innerHTML = gameField[r][c];

        fieldRow[r].children[c].className = `
        field-cell field-cell--${gameField[r][c]}
        `;
      }
    }
  }

  loseInTheGame();
  gameScore.innerHTML = score;
}

function blockGame() {
  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength; c++) {
      if (gameField[r][c] === 2048) {
        return false;
      }
    }
  }
}

document.addEventListener('keyup', (e) => {
  if ((blockGame() === false) || gameClickBehavior === false) {
    return;
  }

  let moved = false; // Track if any valid move was made

  switch (e.code) {
    case 'ArrowRight':
      moved = moveRight();
      break;

    case 'ArrowLeft':
      moved = moveLeft();
      break;

    case 'ArrowUp':
      moved = moveUp();
      break;

    case 'ArrowDown':
      moved = moveDown();
      break;

    default:
      return;
  }

  if (moved) {
    handleAddNumber();
    updateFieldCell();
  }
});

function filterZero(row) {
  return row.filter(r => r !== 0);
}

function slider(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < cellsLength) {
    newRow.push(0);
  }

  return newRow;
}

function moveRight() {
  let moved = false;

  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];

    const originalRow = [...row];

    row.reverse();
    row = slider(row);

    row.reverse();

    gameField[r] = row;

    // Check if any valid move was made in this row
    if (!moved && !arraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function moveLeft() {
  let moved = false;

  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];

    const originalRow = [...row];

    row = slider(row);

    gameField[r] = row;

    if (!moved && !arraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let c = 0; c < cellsLength; c++) {
    let column = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ];

    const originalColumn = [...column];

    column = slider(column);

    for (let r = 0; r < cellsLength; r++) {
      gameField[r][c] = column[r];
    }

    if (!moved && !arraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let c = 0; c < cellsLength; c++) {
    let column = [
      gameField[0][c], gameField[1][c], gameField[2][c], gameField[3][c],
    ];

    const originalColumn = [...column];

    column.reverse();
    column = slider(column);
    column.reverse();

    for (let r = 0; r < cellsLength; r++) {
      gameField[r][c] = column[r];
    }

    if (!moved && !arraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function arraysEqual(a, b) {
  if (a === b) {
    return true;
  };

  if (a == null || b == null) {
    return false;
  };

  if (a.length !== b.length) {
    return false;
  };

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    };
  }

  return true;
}

function loseInTheGame() {
  const freeCell = gameField.some(r => r.some(c => c === 0));

  if (freeCell) {
    return;
  }

  for (let r = 0; r < cellsLength; r++) {
    for (let c = 0; c < cellsLength - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]
        || gameField[c][r] === gameField[c + 1][r]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}
