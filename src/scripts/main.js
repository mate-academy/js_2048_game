'use strict';

// write your code here
const button = document.querySelector('.button');
const messeageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
const rowCells = 4;
const cells = 4;
let score = 0;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function setGameField() {
  for (let row = 0; row < rowCells; row++) {
    for (let cell = 0; cell < cells; cell++) {
      rows[row].children[cell].textContent = gameField[row][cell] || '';

      rows[row].children[cell].className
        = `field-cell field-cell--${gameField[row][cell]}`;

      if (gameField[row][cell] === 2048) {
        messageWin.classList.remove('hidden');
      };
    }
  }

  // checkGameOver();
};

function hasEmptyCell() {
  for (let row = 0; row < rowCells; row++) {
    for (let cell = 0; cell < cells; cell++) {
      if (gameField[row][cell] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwoOrFour() {
  if (!hasEmptyCell()) {
    messageLose.classList.remove('hidden');

    return;
  }

  const row = Math.floor(Math.random() * rowCells);
  const cell = Math.floor(Math.random() * cells);

  (gameField[row][cell] === 0)
    ? gameField[row][cell] = (Math.floor(Math.random() * 100) > 10 ? 2 : 4)
    : setTwoOrFour();

  setGameField();
}

// function slideUp() {
// for (let row = 0, row < rowCells, row++){
// }
// };

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
    messeageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    setTwoOrFour();
    setTwoOrFour();
  } else if (button.textContent === 'Restart') {
    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    score = 0;
    messageLose.classList.add('hidden');

    setTwoOrFour();
    setTwoOrFour();
  };
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      setTwoOrFour();

      break;
    case 'ArrowDown':
      setTwoOrFour();

      break;

    case 'ArrowRight':
      setTwoOrFour();

      break;

    case 'ArrowLeft':
      setTwoOrFour();

      break;
  }

  gameScore.textContent = score;
});
