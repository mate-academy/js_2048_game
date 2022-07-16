'use strict';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const columns = 4;
let score = 0;
const start = document.querySelector('.button');
const massageStart = document.querySelector('.message-start');
const massageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const randomaizer = () => {
  const randomRow = Math.floor(Math.random() * rows);
  const randomColumn = Math.floor(Math.random() * columns);
  const randomNumber = Math.floor(Math.random() * 10);
  const count = randomNumber < 9 ? 2 : 4;

  if (board[randomRow][randomColumn] === 0) {
    board[randomRow][randomColumn] = count;
    updateBoard();
  } else {
    for (const r in board) {
      for (const col in board[r]) {
        if (board[r][col] === 0) {
          randomaizer();

          return;
        }
      }
    }
    massageLose.classList.remove('hidden');
  }
};

const updateBoard = () => {
  const htmlBoard = document.querySelectorAll('.field-row');
  const htmlScore = document.querySelector('.game-score');

  htmlScore.innerHTML = score;

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < columns; col++) {
      if (board[r][col] === 0) {
        htmlBoard[r].children[col].innerHTML = '';
        htmlBoard[r].children[col].className = '';
        htmlBoard[r].children[col].classList.add('field-cell');
      } else {
        htmlBoard[r].children[col].innerHTML = board[r][col];

        htmlBoard[r].children[col].className = '';
        htmlBoard[r].children[col].classList.add('field-cell');

        htmlBoard[r].children[col].classList
          .add(`field-cell--${board[r][col]}`);
      }
    }
  }
};

const reset = () => {
  const htmlBoard = document.querySelectorAll('.field-row');

  massageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  score = 0;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < columns; col++) {
      htmlBoard[r].children[col].innerHTML = '';
      htmlBoard[r].children[col].className = '';
      htmlBoard[r].children[col].classList.add('field-cell');
    }
  }
};

const starter = () => {
  start.addEventListener('click', () => {
    start.classList.add('restart');
    start.classList.remove('start');

    if (start.className.includes('restart')) {
      start.innerHTML = 'Restart';
      massageStart.classList.add('hidden');
    }

    reset();

    randomaizer();
    randomaizer();
  });

  window.addEventListener('keyup', (events) => {
    if (start.className.includes('restart')) {
      switch (events.code) {
        case 'ArrowLeft':
          slider('left');
          randomaizer();
          break;
        case 'ArrowRight':
          slider('right');
          randomaizer();
          break;
        case 'ArrowUp':
          slider('up');
          randomaizer();
          break;
        case 'ArrowDown':
          slider('down');
          randomaizer();
          break;
      }
    }
  });
};

const slider = (course) => {
  const boardVert = [
    [],
    [],
    [],
    [],
  ];

  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < board[r].length; i++) {
      boardVert[r].push(board[i][r]);
    }

    let row = board[r];

    switch (course) {
      case 'left':
        row = board[r];

        row = slide(row);
        board[r] = row;
        break;

      case 'right':
        row = board[r];
        row.reverse();

        row = slide(row);
        row.reverse();
        board[r] = row;
        break;

      case 'up':
        row = boardVert[r];
        row = slide(row);
        boardVert[r] = row;

        break;

      case 'down':
        row = boardVert[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        boardVert[r] = row;

        break;
    }
  }

  if (course === 'up' || course === 'down') {
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < columns; i++) {
        board[i][r] = boardVert[r][i];
      }
    }
  }
};

const slide = (r) => {
  let numbers = r.filter(el => el !== 0);

  for (let col = 0; col < numbers.length; col++) {
    if (numbers[col] === numbers[col + 1]) {
      numbers[col] *= 2;
      score += numbers[col];
      numbers[col + 1] = 0;

      if (numbers[col] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }

  numbers = numbers.filter(x => x !== 0);

  while (numbers.length < columns) {
    numbers.push(0);
  }

  return numbers;
};

starter();
