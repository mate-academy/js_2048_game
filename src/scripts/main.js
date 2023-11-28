'use strict';

// DOM Elements
const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message--start');
const winnerMessage = document.querySelector('.message--win');
const looseMessage = document.querySelector('.message--lose');
const score = document.querySelector('.game-score');

// Variables
const mainSectionClass = 'field-cell';
const ROWS = 4;
const COLUMNS = 4;
const WIN_NUM = 2048;
let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let gameOver = false;
let winGame = false;

// functions helpers
const filterFromZero = arr => arr.filter(item => item !== 0);

const isEmptyField = table => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (table[row][col] !== 0) {
        return false;
      }
    }
  }

  return true;
};

// Move checks
const canMoveRight = () => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 1; j++) {
      if (
        board[i][j] !== 0
        && (board[i][j + 1] === 0
        || board[i][j] === board[i][j + 1])
      ) {
        return true;
      }
    }
  }

  return false;
};

const canMoveLeft = () => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (
        board[i][j] !== 0
        && (board[i][j - 1] === 0
        || board[i][j] === board[i][j - 1])
      ) {
        return true;
      }
    }
  }

  return false;
};

const canMoveUp = () => {
  for (let i = 1; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (
        board[i][j] !== 0
        && (board[i - 1][j] === 0
        || board[i][j] === board[i - 1][j])
      ) {
        return true;
      }
    }
  }

  return false;
};

const canMoveDown = () => {
  for (let i = 0; i < board.length - 1; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (
        board[i][j] !== 0
        && (board[i + 1][j] === 0
          || board[i][j] === board[i + 1][j])
      ) {
        return true;
      }
    }
  }

  return false;
};

// looser/winner checks
const endGame = () => {
  if (isEmptyField(board)) {
    return false;
  }

  const haveMoves = [canMoveRight(), canMoveLeft(), canMoveDown(), canMoveUp()];

  return !haveMoves.includes(true);
};

const checkEndGame = () => {
  if (endGame()) {
    gameOver = true;

    looseMessage.classList.remove('message--hidden');
  }
};

const notifyWinner = () => {
  const cells = gameField.querySelectorAll(`.${mainSectionClass}`);

  cells.forEach(cell => {
    if (+cell.innerText === WIN_NUM) {
      winGame = true;
    }
  });

  if (winGame) {
    winnerMessage.classList.remove('message--hidden');
  }
};

// Move funtions
const move = row => {
  let newRow = filterFromZero(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] = newRow[i] * 2;
      newRow[i + 1] = 0;
      score.innerText = +score.innerText + newRow[i];
    }

    newRow = filterFromZero(newRow);
  }

  while (newRow.length < COLUMNS) {
    newRow.push(0);
  }

  return newRow;
};

const moveVerticaly = direction => {
  for (let c = 0; c < COLUMNS; c++) {
    let column = Array.from(board, row => row[c]);

    switch (direction) {
      case 'up':
        column = move(column);

        for (let row = 0; row < ROWS; row++) {
          board[row][c] = column[row];
        }

        break;

      case 'down':
        column.reverse();
        column = move(column);
        column.reverse();

        for (let row = 0; row < ROWS; row++) {
          board[row][c] = column[row];
        }

        break;
    }
  }

  updateSections();
};

const moveHorithontaly = direction => {
  for (let r = 0; r < ROWS; r++) {
    let row = board[r];

    switch (direction) {
      case 'left':
        row = move(row);
        board[r] = row;

        break;

      case 'right':
        row.reverse();
        row = move(row);
        board[r] = row.reverse();

        break;
    }
  }

  updateSections();
};

// Prints field and numbers
const createBoard = () => {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const section = document.createElement('div');

      section.classList.add(mainSectionClass);
      section.id = `${row}-${col}`;

      gameField.append(section);
    }
  }
};

const updateSections = () => {
  const sections
    = gameField.querySelectorAll(`[class*="${mainSectionClass}--"]`);

  sections.forEach(section => {
    section.classList.forEach(className => {
      if (className.startsWith(`${mainSectionClass}--`)) {
        section.classList.remove(className);
        section.innerText = '';
      }
    });
  });

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const cell = document.getElementById(`${row}-${col}`);

      if (board[row][col] !== 0) {
        cell.classList.add(`${mainSectionClass}--${board[row][col]}`);
        cell.innerText = board[row][col];
      }
    }
  }
};

const addNumber = table => {
  let amountNumbers = isEmptyField(table) ? 2 : 1;

  while (amountNumbers > 0) {
    const column = Math.floor(Math.random() * COLUMNS);
    const row = Math.floor(Math.random() * ROWS);

    if (table[row][column] === 0) {
      const num = Math.random() > 0.1 ? 2 : 4;

      table[row][column] = num;

      const section = document.getElementById(`${row}-${column}`);

      section.classList.add(`${mainSectionClass}--${num}`);
      section.innerText = num;

      amountNumbers--;
    }
  }
};

// Events
button.addEventListener('click', () => {
  if (button.classList.contains('button--start')) {
    createBoard();

    button.classList.remove('button--start');
    button.classList.add('button--restart');
    button.innerText = 'Restart';

    startMessage.classList.add('message--hidden');

    addNumber(board);
  } else {
    board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

    while (gameField.firstChild) {
      gameField.removeChild(gameField.firstChild);
    }

    looseMessage.classList.add('message--hidden');
    winnerMessage.classList.add('message--hidden');

    score.innerText = 0;

    winGame = false;
    gameOver = false;

    createBoard();
    addNumber(board);
  }
});

document.addEventListener('keydown', e => {
  if (gameOver || winGame) {
    return;
  }

  e.preventDefault();

  switch (e.key) {
    case 'ArrowLeft':
      if (canMoveLeft()) {
        moveHorithontaly('left');
        addNumber(board);
      }

      break;

    case 'ArrowRight':
      if (canMoveRight()) {
        moveHorithontaly('right');
        addNumber(board);
      }

      break;

    case 'ArrowUp':
      if (canMoveUp()) {
        moveVerticaly('up');
        addNumber(board);
      }

      break;

    case 'ArrowDown':
      if (canMoveDown()) {
        moveVerticaly('down');
        addNumber(board);
      }

      break;
  }

  checkEndGame();
  notifyWinner();
});
