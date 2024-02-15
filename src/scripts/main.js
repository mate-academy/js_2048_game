'use strict';

const cell = document.querySelectorAll('td');
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const message = document.querySelector('.message-container');

let scoreCount = 0;
let check = 0;
let up;
let down;
let left;
let right;

let gameField = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

let restIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const fillingField = () => {
  let i = 0;

  restIndices = [];

  for (const row of gameField) {
    for (const cellField of row) {
      if (cellField !== '') {
        cell[i].textContent = cellField;
        cell[i].classList.add(`field-cell--${cellField}`);
      } else {
        restIndices.push(i);
      }
      i++;
    }
  }
};

const clearHTML = () => {
  const elements = [...cell].filter(item => item.classList[1] !== undefined);

  elements.map(item => {
    item.classList.remove(item.classList[1]);
    item.textContent = '';
  });
  fillingField();
};

const randomIndex = (max) => Math.floor(Math.random() * max);

const createNewCell = () => {
  const index = restIndices[randomIndex(restIndices.length)];
  const column = index % 4;
  const row = (index - column) / 4;
  const newNumbers = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2];

  gameField[row][column] = newNumbers[randomIndex(newNumbers.length)];
  fillingField();
};

startButton.addEventListener('click', () => {
  gameField = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];
  message.children[2].classList.add('hidden');
  clearHTML();
  startButton.textContent = 'Reset';
  startButton.className = 'button restart';
  createNewCell();
  createNewCell();
  fillingField();
  scoreCount = 0;
  score.textContent = `${scoreCount}`;
});

const move = (reverse, horizontal) => {
  check = 0;

  for (let y = 0; y <= 3; y++) {
    let range = [];
    const copyRange = [];

    for (let x = 0; x <= 3; x++) {
      (horizontal)
        ? range.push(gameField[y][x])
          && copyRange.push(gameField[y][x])
        : range.push(gameField[x][y])
          && copyRange.push(gameField[x][y]);
    };

    range = range.filter(element => element !== '');

    if (reverse) {
      range = range.reverse();
    };

    range.forEach((element, index, array) => {
      if (element === array[index + 1] && element !== '') {
        array[index] = array[index + 1] * 2;
        array[index + 1] = '';
        scoreCount += array[index];
      }
    });

    range = (reverse)
      ? range.reverse().filter(elemetn => elemetn !== '')
      : range.filter(elemetn => elemetn !== '');

    for (let i = range.length; i < 4; i++) {
      (reverse)
        ? range.unshift('')
        : range.push('');
    }

    range.forEach((element, i) => {
      if (horizontal) {
        gameField[y][i] = element;
      } else {
        gameField[i][y] = element;
      };
    });

    range.forEach((element, index) => {
      if (element !== copyRange[index]) {
        check++;
      }
    });
  };
};

const notification = (lose) => {
  if (lose) {
    message.children[0].classList.remove('hidden');
  }

  gameField.forEach(elements => {
    elements.forEach(element => {
      if (element === 2048) {
        message.children[1].classList.remove('hidden');
      };
    });
  });
};

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp': {
      move(false, false);
      up = (!check) ? 1 : 0;
      break;
    }

    case 'ArrowDown': {
      move(true, false);
      down = (!check) ? 1 : 0;
      break;
    }

    case 'ArrowLeft': {
      move(false, true);
      left = (!check) ? 1 : 0;
      break;
    }

    case 'ArrowRight': {
      move(true, true);
      right = (!check) ? 1 : 0;
      break;
    }

    default: {
      return;
    }
  }

  clearHTML();

  if (check) {
    createNewCell();
  };
  notification();

  if (up && down && left && right) {
    notification(true);
  }
  score.textContent = `${scoreCount}`;
});
