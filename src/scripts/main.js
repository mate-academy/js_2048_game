'use strict';

// write your code here
let fieldGame = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rowsGame = document.querySelectorAll('.field-row');
const startBtn = document.querySelector('button.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
let scoreValue = 0;

startBtn.addEventListener('click', () => {
  resetGame();
  addNumber();
  addNumber();
});

score.addEventListener('click', () => {
  checkGameOver();
});

document.addEventListener('keydown', e => {
  if (
    !messageStart.classList.contains('hidden')
    || !messageWin.classList.contains('hidden')
    || !messageLose.classList.contains('hidden')
  ) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      sortFieldGame();
      break;

    case 'ArrowRight':
      sortFieldGame(true);
      break;

    case 'ArrowUp':
      rotateFieldGame();
      sortFieldGame(true);
      rotateFieldGame2();
      break;

    case 'ArrowDown':
      rotateFieldGame();
      sortFieldGame();
      rotateFieldGame2();
      break;
  }
  addNumber();
  updateGame();
  checkGameOver();
});

const updateGame = () => {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (fieldGame[row][col] > 0) {
        rowsGame[row].children[col].innerHTML = fieldGame[row][col];

        rowsGame[row].children[col].className = `
        field-cell field-cell--${fieldGame[row][col]}`;
      } else {
        rowsGame[row].children[col].innerHTML = '';
        rowsGame[row].children[col].className = `field-cell`;
      }
    }
  }

  score.innerHTML = scoreValue;

};

const addNumber = () => {
  const fieldsKey = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (fieldGame[row][col] === 0) {
        fieldsKey.push([row, col]);
      }
    }
  }

  if (fieldsKey.length === 0) {
    return;
  }

  const randomItem = fieldsKey[Math.floor(Math.random() * fieldsKey.length)];

  const randomItemRow = randomItem[0];
  const randomItemCol = randomItem[1];

  fieldGame[randomItemRow][randomItemCol] = Math.random() <= 0.1 ? 4 : 2;
  updateGame();
};

const sortRow = (arr, flip = false) => {
  let filtered = !flip ? arr : arr.reverse();

  filtered = sortZero(filtered);

  for (let i = 0; i < 3; i++) {
    if (filtered[i] > 0 && filtered[i] === filtered[i + 1]) {
      filtered[i] = filtered[i] * 2;

      if (filtered[i] === 2048) {
        messageWin.classList.remove('hidden');
      }

      filtered[i + 1] = 0;
      scoreValue += filtered[i];
    }
  }

  filtered = sortZero(filtered);

  return !flip ? filtered : filtered.reverse();
};

const checkGameOver = () => {
  const countZero = fieldGame.some(arr => arr.some(el => el === 0));

  if (countZero) {
    return;
  }

  let count = false;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (fieldGame[i][j] === fieldGame[i][j + 1]
        || fieldGame[j][i] === fieldGame[j + 1][i]) {
        count = true;
      }
    }
  }

  if (!count) {
    messageLose.classList.remove('hidden');
  }
};

const sortFieldGame = flip => {
  fieldGame.map((row, i) => {
    fieldGame[i] = sortRow(row, flip);
  });
};

const sortZero = arr => {
  const resArr = arr.filter(el => el !== 0);

  return resArr.concat(Array(arr.length - resArr.length).fill(0));
};

const rotateFieldGame = () => {
  fieldGame = fieldGame[0].map((val, index) =>
    fieldGame.map(row => row[index]).reverse()
  );
};

const rotateFieldGame2 = () => {
  for (let i = 0; i < 3; i++) {
    rotateFieldGame();
  }
};

const resetGame = () => {
  fieldGame = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  scoreValue = 0;
  startBtn.textContent = 'Reset';
  startBtn.className = 'button restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  updateGame();
};
