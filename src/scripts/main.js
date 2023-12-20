'use strict';

const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const scoreText = document.querySelector('.game-score');
const table = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let board;
let score = 0;
const rows = 4;
const columns = 4;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  };

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreText.textContent = score;

  setTwo();
  setTwo();
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

  if (gameOver(board)) {
    loseMessage.classList.remove('hidden');
  }

  if (youWin()) {
    winMessage.classList.remove('hidden');
  }

  scoreText.textContent = score;
});

function filterZero(row) {
  return row.filter(num => num);
}

function compareArr(prevBoard, boards) {
  return JSON.stringify(prevBoard) !== JSON.stringify(boards);
};

function slide(row) {
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
}

function movedLeft() {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  };

  if (compareArr(prevBoard, board)) {
    setTwo();
  }

  renderField();
}

function movedUp() {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    };
  };

  if (compareArr(prevBoard, board)) {
    setTwo();
  }

  renderField();
}

function movedRight() {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);

    row.reverse();
    board[r] = row;
  };

  if (compareArr(prevBoard, board)) {
    setTwo();
  }

  renderField();
}

function movedDown() {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    };
  };

  if (compareArr(prevBoard, board)) {
    setTwo();
  }

  renderField();
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;
      renderField();

      found = true;
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function renderField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      table.rows[r].cells[c].className = '';
      table.rows[r].cells[c].classList.add('field-cell');
      table.rows[r].cells[c].classList.add(`field-cell--${board[r][c]}`);
      table.rows[r].cells[c].textContent = board[r][c] || '';
    }
  }
};

function youWin() {
  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 2048) {
        return true;
      }
    }
  }
}

function gameOver(field) {
  const size = field.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const currentCell = field[r][c];

      const checkUp = r > 0 && field[r - 1][c] === currentCell;
      const checkDown = r < size - 1 && field[r + 1][c] === currentCell;
      const checkLeft = c > 0 && field[r][c - 1] === currentCell;
      const checkRight = c < size - 1 && field[r][c + 1] === currentCell;

      if (checkDown || checkUp || checkLeft || checkRight) {
        return false;
      }
    }
  }

  return true;
}
