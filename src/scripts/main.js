'use strict';

// Constants
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const scoreText = document.querySelector('.game-score');
const field = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let board;
let score = 0;
const cellsInRow = 4;

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};

const compareFields = (prevBoard, boards) => {
  return JSON.stringify(prevBoard) !== JSON.stringify(boards);
};

const slide = (row) => {
  const newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow.splice(i + 1, 1);
      score += newRow[i];
    }
  }

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
};

const hasEmptyCell = () => {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

const renderField = () => {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      field.rows[r].cells[c].className = '';

      field.rows[r].cells[c].classList.add(
        'field-cell',
        `field-cell--${board[r][c]}`
      );
      field.rows[r].cells[c].textContent = board[r][c] || '';
    }
  }
};

const spawnRandomCell = () => {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * cellsInRow);
    const c = Math.floor(Math.random() * cellsInRow);

    if (board[r][c] === 0) {
      board[r][c] = 2;
      renderField();

      found = true;
    }
  }
};

const transponseField = (currentField) => {
  let transponsedBoard = currentField;

  transponsedBoard = transponsedBoard[0].map(
    (_, colIndex) => transponsedBoard.map(
      row => row[colIndex]
    )
  );

  return transponsedBoard;
};

const moveLeft = () => {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let r = 0; r < cellsInRow; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  };

  if (compareFields(prevBoard, board)) {
    spawnRandomCell();
  }

  renderField();
};

const moveRight = () => {
  const prevBoard = JSON.parse(JSON.stringify(board));

  for (let r = 0; r < cellsInRow; r++) {
    let row = board[r].reverse();

    row = slide(row);
    board[r] = row.reverse();
  };

  if (compareFields(prevBoard, board)) {
    spawnRandomCell();
  }

  renderField();
};

const moveUp = () => {
  const prevBoard = JSON.parse(JSON.stringify(board));
  const newField = transponseField(board);

  for (let r = 0; r < cellsInRow; r++) {
    let row = newField[r];

    row = slide(row);
    newField[r] = row;
  };

  board = transponseField(newField);

  if (compareFields(prevBoard, board)) {
    spawnRandomCell();
  }

  renderField();
};

const moveDown = () => {
  const prevBoard = JSON.parse(JSON.stringify(board));
  const newField = transponseField(board);

  for (let r = 0; r < cellsInRow; r++) {
    let row = newField[r].reverse();

    row = slide(row);
    newField[r] = row.reverse();
  };

  board = transponseField(newField);

  if (compareFields(prevBoard, board)) {
    spawnRandomCell();
  }

  renderField();
};

const winGame = () => {
  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 2048) {
        return true;
      }
    }
  }
};

const checkFields = (fieldToCheck) => {
  for (const row of fieldToCheck) {
    const duplicates = row.filter((item, index) => row.indexOf(item) !== index);

    if (duplicates.length !== 0) {
      return true;
    }
  }

  return false;
};

const gameOver = (desk) => {
  if (hasEmptyCell()) {
    return false;
  }

  const newDesk = transponseField(desk);

  if (checkFields(desk) || checkFields(newDesk)) {
    return false;
  };

  return true;
};

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

  spawnRandomCell();
  spawnRandomCell();
});

document.addEventListener('keydown', (e) => {
  if (gameOver(board)) {
    loseMessage.classList.remove('hidden');
  }

  if (winGame()) {
    winMessage.classList.remove('hidden');

    board = [
      [2, 0, 4, 8],
      [2, 0, 4, 8],
      [2, 0, 4, 8],
      [2, 0, 4, 8],
    ];

    renderField();
  } else {
    switch (e.key) {
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
  }

  scoreText.textContent = score;
});
