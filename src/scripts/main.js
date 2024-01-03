'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const table = document.querySelector('tbody');
const fieldCell = document.querySelectorAll('.field-cell');
const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    for (let i = 0; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        gameField[i][j] = 0;
      }
    };

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    for (let i = 0; i < fieldCell.length; i++) {
      fieldCell[i].textContent = '';
      fieldCell[i].className = 'field-cell';
    };
  };

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  };

  addValue();
  addValue();
  render();
});

document.addEventListener('keydown', e => {
  if (!messageLose.classList.contains('hidden')) {
    return;
  };

  const copyGameField = JSON.parse(JSON.stringify(gameField));

  if (e.key === 'ArrowUp') {
    moveVertical('ArrowUp');
  };

  if (e.key === 'ArrowDown') {
    moveVertical('ArrowDown');
  };

  if (e.key === 'ArrowRight') {
    moveHorizontal('ArrowRight');
  };

  if (e.key === 'ArrowLeft') {
    moveHorizontal('ArrowLeft');
  };

  if (JSON.stringify(copyGameField) === JSON.stringify(gameField)) {
    return;
  };

  addValue();
  render();
  isWin();
  isGameOver();
}
);

function isWin() {
  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      const cell = gameField[i][j];

      if (cell === 2048) {
        messageWin.classList.remove('hidden');
      };
    }
  };
};

function isGameOver() {
  let hasEmptyCell = false;

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      if (gameField[i][j] === 0) {
        hasEmptyCell = true;
      };
    };
  };

  let gameContinueHorizontal = false;
  let gameContinueVertical = false;

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length - 1; j++) {
      if (gameField[i][j] === gameField[i][j + 1]) {
        gameContinueHorizontal = true;
      };
    };
  };

  for (let i = 0; i < gameField.length - 1; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      if (gameField[i][j] === gameField[i + 1][j]) {
        gameContinueVertical = true;
      };
    };
  };

  if (!hasEmptyCell && !gameContinueHorizontal && !gameContinueVertical) {
    messageLose.classList.remove('hidden');
  };
};

function moveHorizontal(diraction) {
  for (let i = 0; i < gameField.length; i++) {
    let row;

    if (diraction === 'ArrowRight') {
      row = sum(gameField[i].reverse()).reverse();
    } else if (diraction === 'ArrowLeft') {
      row = sum(gameField[i]);
    };

    gameField[i] = row;
  };
};

function moveVertical(diraction) {
  for (let j = 0; j < gameField.length; j++) {
    const rowVertical = [];

    for (let i = 0; i < gameField[j].length; i++) {
      rowVertical.push(gameField[i][j]);
    };

    let column;

    if (diraction === 'ArrowUp') {
      column = sum(rowVertical);
    } else if (diraction === 'ArrowDown') {
      column = sum(rowVertical.reverse()).reverse();
    }

    gameField[0][j] = column[0];
    gameField[1][j] = column[1];
    gameField[2][j] = column[2];
    gameField[3][j] = column[3];
  };
}

function sum(rowArray) {
  let filteredArray = rowArray.filter(item => item !== 0);

  for (let i = 0; i < filteredArray.length; i++) {
    if (filteredArray[i] === filteredArray[i + 1]) {
      filteredArray[i] = filteredArray[i] * 2;
      filteredArray[i + 1] = 0;
      score += filteredArray[i];
      gameScore.textContent = score;
    };
  }

  filteredArray = filteredArray.filter(item => item !== 0);

  while (filteredArray.length < gameField.length) {
    filteredArray.push(0);
  };

  return filteredArray;
}

function render() {
  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      const cell = gameField[i][j];

      table.children[i].children[j].textContent = '';
      table.children[i].children[j].className = 'field-cell';

      if (cell !== 0) {
        table.children[i].children[j].textContent = `${cell}`;
        table.children[i].children[j].classList.add(`field-cell--${cell}`);
      }
    }
  }
};

function addValue() {
  let randomCell = Math.floor(Math.random() * 4);
  let randomRow = Math.floor(Math.random() * 4);

  while (gameField[randomRow][randomCell] !== 0) {
    randomCell = Math.floor(Math.random() * 4);
    randomRow = Math.floor(Math.random() * 4);
  }

  const number = randomTwoOrFour();

  gameField[randomRow][randomCell] = number;
};

function randomTwoOrFour() {
  return Math.random() < 0.1 ? 4 : 2;
};
