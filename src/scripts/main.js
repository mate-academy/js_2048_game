'use strict';

const startBtn = document.querySelector('.button');
// const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
const gameScore = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
const mes = document.querySelector('.message-container');

let arrOfNumbers = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];
let moves = 0;
let maxNum = 0;
let noEmpty = false;

score.innerText = maxNum;

startBtn.addEventListener('click', (e) => {
  e.target.classList.toggle('restart');

  if (e.target.textContent === 'Start') {
    e.target.textContent = 'Restart';
    messageStart.classList.toggle('hidden');
    maxNum = 0;
    noEmpty = false;
    score.innerText = maxNum;
    randomNum();
    paint();
  } else {
    e.target.textContent = 'Start';
    messageStart.classList.toggle('hidden');

    arrOfNumbers = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ];
    maxNum = 0;
    noEmpty = false;
    score.innerText = maxNum;
    moves = 0;
    paint();
  }
});

function hasEmpty() {
  for (const item of arrOfNumbers) {
    if (Math.max(...item) >= 2048) {
      messageWin.classList.toggle('hidden');
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (arrOfNumbers[i][j] === '') {
        return true;
      }
    }
  }
  noEmpty = true;

  return false;
}

function randomWithProbability() {
  const notRandomNumbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const idx = Math.floor(Math.random() * notRandomNumbers.length);

  return notRandomNumbers[idx];
}

function randomNum() {
  if (!hasEmpty()) {
    return;
  }

  let x;
  let y;
  const value = randomWithProbability();

  if (moves === 0) {
    x = Math.floor(Math.random() * 4);
    y = Math.floor(Math.random() * 4);

    const x1 = Math.floor(Math.random() * 4);
    const y1 = Math.floor(Math.random() * 4);

    arrOfNumbers[x][y] = value;
    arrOfNumbers[x1][y1] = value;
    moves++;
  } else {
    x = Math.floor(Math.random() * 4);
    y = Math.floor(Math.random() * 4);

    while (arrOfNumbers[x][y] !== '') {
      x = Math.floor(Math.random() * 4);
      y = Math.floor(Math.random() * 4);
    }
  }

  arrOfNumbers[x][y] = value;
  moves += 1;
};

function paint() {
  if (noEmpty) {
    mes.innerHTML = `<p class="message message-lose">
    You lose! Restart the game?</p>`;

    return;
  }

  for (let i = 0; i < arrOfNumbers.length; i++) {
    for (let k = 0; k < arrOfNumbers[i].length; k++) {
      const item = arrOfNumbers[i][k];

      if (item !== '') {
        rows[i].cells[k].innerText = item;
        rows[i].cells[k].classList = `field-cell field-cell--${item}`;
      }

      if (item === '') {
        rows[i].cells[k].innerText = '';
        rows[i].cells[k].classList = `field-cell`;
      }
    }
  }
};

function filterZero(row) {
  const clearRow = row.filter(num => num !== '');

  return clearRow;
};

function slide(row) {
  let clearRow = filterZero(row);

  for (let i = 0; i < clearRow.length - 1; i++) {
    if (clearRow[i] === clearRow[i + 1]) {
      clearRow[i] *= 2;
      maxNum += clearRow[i];
      clearRow[i + 1] = '';
      gameScore.innerText = maxNum;
    }
  }

  clearRow = filterZero(clearRow);

  while (clearRow.length < 4) {
    clearRow.push('');
  }

  return clearRow;
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
  }

  if (e.code === 'ArrowRight') {
    slideRight();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
  }
});

function slideLeft() {
  for (let i = 0; i < 4; i++) {
    const row = arrOfNumbers[i];
    const newRow = slide(row);

    arrOfNumbers[i] = newRow;
  }
  randomNum();
  paint();
};

function slideRight() {
  for (let i = 0; i < 4; i++) {
    const row = arrOfNumbers[i];

    row.reverse();

    const newRow = slide(row);

    newRow.reverse();

    arrOfNumbers[i] = newRow;
  }
  randomNum();
  paint();
};

function slideUp() {
  for (let i = 0; i < 4; i++) {
    const row = [
      arrOfNumbers[0][i],
      arrOfNumbers[1][i],
      arrOfNumbers[2][i],
      arrOfNumbers[3][i],
    ];

    const newRow = slide(row);

    arrOfNumbers[0][i] = newRow[0];
    arrOfNumbers[1][i] = newRow[1];
    arrOfNumbers[2][i] = newRow[2];
    arrOfNumbers[3][i] = newRow[3];
  }

  randomNum();
  paint();
};

function slideDown() {
  for (let i = 0; i < 4; i++) {
    const row = [
      arrOfNumbers[0][i],
      arrOfNumbers[1][i],
      arrOfNumbers[2][i],
      arrOfNumbers[3][i],
    ];

    row.reverse();

    const newRow = slide(row);

    newRow.reverse();

    arrOfNumbers[0][i] = newRow[0];
    arrOfNumbers[1][i] = newRow[1];
    arrOfNumbers[2][i] = newRow[2];
    arrOfNumbers[3][i] = newRow[3];
  }

  randomNum();
  paint();
};
