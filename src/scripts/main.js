'use strict';

const scoreInfo = document.querySelector('.game-score');
const table = document.querySelector('.game-field');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let score = 0;
const rows = 4;
const columns = 4;
let field;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart__active')) {
    button.classList.remove('restart__active');
    messageLose.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
  };

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreInfo.textContent = score;

  setRandomTwo();
  setRandomTwo();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      movedLeft();
      break;

    case 'ArrowRight':
      movedRight();
      break;

    case 'ArrowUp':
      movedUp();
      break;

    case 'ArrowDown':
      movedDown();
      break;
  }

  if (isGameOver(field)) {
    messageLose.classList.remove('hidden');
    button.classList.add('restart__active');
  }

  if (checkWin()) {
    messageWin.classList.remove('hidden');
  }

  scoreInfo.textContent = score;
});

function hasEmptyTitle() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

function setRandomTwo() {
  if (!hasEmptyTitle()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (field[r][c] === 0) {
      field[r][c] = 2;
      renderField();

      found = true;
    }
  }
};

function filterZero(row) {
  return row.filter(num => num);
};

function compareArr(prevField, fields) {
  return JSON.stringify(prevField) !== JSON.stringify(fields);
};

function moved(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
};

function movedLeft() {
  const prevField = JSON.parse(JSON.stringify(field));

  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = moved(row);
    field[r] = row;
  };

  if (compareArr(prevField, field)) {
    setRandomTwo();
  }

  renderField();
};

function movedRight() {
  const prevField = JSON.parse(JSON.stringify(field));

  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row.reverse();

    row = moved(row);

    row.reverse();
    field[r] = row;
  };

  if (compareArr(prevField, field)) {
    setRandomTwo();
  }

  renderField();
};

function movedUp() {
  const prevField = JSON.parse(JSON.stringify(field));

  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row = moved(row);

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];
    }
  };

  if (compareArr(prevField, field)) {
    setRandomTwo();
  }

  renderField();
};

function movedDown() {
  const prevField = JSON.parse(JSON.stringify(field));

  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row.reverse();
    row = moved(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];
    }
  };

  if (compareArr(prevField, field)) {
    setRandomTwo();
  }

  renderField();
};

function renderField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      table.rows[r].cells[c].className = '';
      table.rows[r].cells[c].classList.add('field-cell');
      table.rows[r].cells[c].classList.add(`field-cell--${field[r][c]}`);
      table.rows[r].cells[c].textContent = field[r][c] || '';
    }
  }
};

function checkWin() {
  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver(board) {
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const currentCell = board[row][col];
      const checkUp = row > 0 && board[row - 1][col] === currentCell;
      const checkDown = row < size - 1 && board[row + 1][col] === currentCell;
      const checkLeft = col > 0 && board[row][col - 1] === currentCell;
      const checkRight = col < size - 1 && board[row][col + 1] === currentCell;

      if (checkUp || checkDown || checkLeft || checkRight) {
        return false;
      }
    }
  }

  return true;
}
