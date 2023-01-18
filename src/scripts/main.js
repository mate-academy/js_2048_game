'use strict';

const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let score = 0;
const rows = 4;
const columns = 4;

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const random = () => {
  const rowsRandom = Math.floor(Math.random() * rows);
  const colRandom = Math.floor(Math.random() * columns);
  const randomNumber = Math.floor(Math.random() * 10);
  const count = randomNumber < 9 ? 4 : 2;

  if (gameField[rowsRandom][colRandom] === 0) {
    gameField[rowsRandom][colRandom] = count;

    updateField();
  } else {
    for (const row in gameField) {
      for (const col in gameField[row]) {
        if (gameField[row][col] === 0) {
          random();

          return;
        }
      }
    }
    messageLose.classList.remove('hidden');
  }
};

const updateField = () => {
  const fieldRow = document.querySelectorAll('.field-row');
  const gameScore = document.querySelector('.game-score');

  gameScore.innerHTML = score;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 0) {
        fieldRow[r].children[c].innerHTML = '';
        fieldRow[r].children[c].className = '';
        fieldRow[r].children[c].classList.add('field-cell');
      } else {
        fieldRow[r].children[c].innerHTML = gameField[r][c];
        fieldRow[r].children[c].className = '';
        fieldRow[r].children[c].classList.add('field-cell');

        fieldRow[r].children[c].classList.add(`field-cell--${gameField[r][c]}`);
      }
    }
  }
};

const reset = () => {
  const fieldRow = document.querySelectorAll('.field-row');

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  score = 0;

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      fieldRow[r].children[c].innerHTML = '';
      fieldRow[r].children[c].className = '';
      fieldRow[r].children[c].classList.add('field-cell');
    }
  }
};

const slider = (course) => {
  const fieldCol = [
    [],
    [],
    [],
    [],
  ];

  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < gameField[r].length; i++) {
      fieldCol[r].push(gameField[i][r]);
    }

    let row = gameField[r];

    switch (course) {
      case 'left':
        row = gameField[r];
        row = slide(row);
        gameField[r] = row;
        break;

      case 'right':
        row = gameField[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        gameField[r] = row;
        break;

      case 'up':
        row = fieldCol[r];
        row = slide(row);
        fieldCol[r] = row;
        break;

      case 'down':
        row = fieldCol[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        fieldCol[r] = row;
        break;
    }
  }

  if (course === 'up' || course === 'down') {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        gameField[c][r] = fieldCol[r][c];
      }
    }
  }
};

const slide = (res) => {
  let numbers = res.filter(el => el !== 0);

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

button.addEventListener('click', () => {
  button.classList.add('restart');
  button.classList.remove('Start');

  if (button.className.includes('restart')) {
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
  }
  reset();

  random();
  random();
});

document.body.addEventListener('keyup', (e) => {
  if (button.className.includes('restart')) {
    switch (e.code) {
      case 'ArrowLeft':
        slider('left');
        random();
        break;

      case 'ArrowRight':
        slider('right');
        random();
        break;

      case 'ArrowUp':
        slider('up');
        random();
        break;

      case 'ArrowDown':
        slider('down');
        random();
        break;
    }
  }
});
