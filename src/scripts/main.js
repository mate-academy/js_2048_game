'use strict';

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

const moveLeft = (transponsedField = board) => {
  for (let r = 0; r < cellsInRow; r++) {
    let row = transponsedField[r];

    row = slide(row);
    transponsedField[r] = row;
  };
};

const moveRight = (transponsedField = board) => {
  for (let r = 0; r < cellsInRow; r++) {
    let row = transponsedField[r].reverse();

    row = slide(row);
    transponsedField[r] = row.reverse();
  };
};

const moveUp = () => {
  const newField = transponseField(board);

  moveLeft(newField);

  board = transponseField(newField);
};

const moveDown = () => {
  const newField = transponseField(board);

  moveRight(newField);

  board = transponseField(newField);
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
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow - 1; j++) {
      if (fieldToCheck[i][j] === fieldToCheck[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
};

const gameOver = (boardToCheck) => {
  if (hasEmptyCell()) {
    return false;
  }

  const newDesk = transponseField(boardToCheck);

  if (checkFields(boardToCheck) || checkFields(newDesk)) {
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

    renderField();
  } else {
    const prevBoard = JSON.parse(JSON.stringify(board));

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

    if (compareFields(prevBoard, board)) {
      spawnRandomCell();
    }

    renderField();
  }

  scoreText.textContent = score;
});
