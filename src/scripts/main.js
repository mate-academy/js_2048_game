'use strict';

// write your code here
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
let score = 0;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function setGameField() {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      rows[row].children[cell].textContent = gameField[row][cell] || '';

      rows[row].children[cell].className
        = `field-cell field-cell--${gameField[row][cell]}`;

      if (gameField[row][cell] === 2048) {
        messageWin.classList.remove('hidden');
      };
    }
  }
};

function hasEmptyCell() {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      if (gameField[row][cell] === 0) {
        return true;
      }
    }
  }

  return false;
}

function canMove() {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 3; cell++) {
      if (gameField[cell][row] === gameField[cell + 1][row]
        || gameField[row][cell] === gameField[row][cell + 1]) {
        return true;
      }
    }
  }

  return false;
}

function setTwoOrFour() {
  if (!canMove() && !hasEmptyCell()) {
    messageLose.classList.remove('hidden');

    return;
  }

  const row = Math.floor(Math.random() * 4);
  const cell = Math.floor(Math.random() * 4);

  if (hasEmptyCell() && gameField[row][cell] === 0) {
    gameField[row][cell] = Math.floor(Math.random() >= 0.9 ? 4 : 2);
  }

  setGameField();
}

function filteringZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let filteredRow = filteringZero(row);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
    }
  }
  filteredRow = filteringZero(filteredRow);

  while (filteredRow.length < 4) {
    filteredRow.push(0);
  };

  return filteredRow;
}

function slideLeft() {
  for (let r = 0; r < gameField.length; r++) {
    let row = gameField[r];

    row = slide(row);
    gameField[r] = row;
  }

  setGameField();
}

function slideRight() {
  for (let r = 0; r < gameField.length; r++) {
    let row = gameField[r].reverse();

    row = slide(row);
    gameField[r] = row.reverse();
  }

  setGameField();
}

function slideUp() {
  for (let c = 0; c < gameField.length; c++) {
    let column = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    column = slide(column);

    for (let r = 0; r < gameField.length; r++) {
      gameField[r][c] = column[r];
    }
  }

  setGameField();
}

function slideDown() {
  for (let c = 0; c < gameField.length; c++) {
    let column = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    column.reverse();
    column = slide(column);
    column.reverse();

    for (let r = 0; r < gameField.length; r++) {
      gameField[r][c] = column[r];
    }
  }

  setGameField();
}

function srartGame() {
  button.textContent = 'Restart';
  button.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  setTwoOrFour();
  setTwoOrFour();
};

function restartGame() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  gameScore.textContent = score;
  messageLose.classList.add('hidden');

  setTwoOrFour();
  setTwoOrFour();
};

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    srartGame();
  } else if (button.textContent === 'Restart') {
    restartGame();
  };
  score = 0;
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      slideUp();
      setTwoOrFour();

      break;
    case 'ArrowDown':
      slideDown();
      setTwoOrFour();

      break;

    case 'ArrowRight':
      slideRight();
      setTwoOrFour();

      break;

    case 'ArrowLeft':
      slideLeft();
      setTwoOrFour();

      break;
  }

  gameScore.textContent = score;
});
