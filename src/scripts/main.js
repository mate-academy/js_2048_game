'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const bestScore = document.querySelector('.best-game__score');

let score = 0;
const size = 4;

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function reset() {
  score = 0;

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  messageLose.className = 'message message-lose hidden';
  messageWin.className = 'message message-win hidden';

  render();
};

function render() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      fieldRows[row].children[col].textContent
        = gameField[row][col] ? gameField[row][col] : '';

      fieldRows[row].children[col].className
        = `field-cell field-cell--${gameField[row][col]}`;
    };
  };

  gameScore.innerText = score;
};

function startGame() {
  const randomX = Math.floor(Math.random() * 4);
  const randomY = Math.floor(Math.random() * 4);

  if (gameField[randomX][randomY] === 0) {
    gameField[randomX][randomY] = Math.random() > 0.9 ? 4 : 2;
  } else {
    startGame();
  };
};

button.addEventListener('click', (e) => {
  if (button.innerText === 'Start') {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.hidden = true;
  } else {
    reset();
  }

  startGame();
  startGame();

  render();
});

function slide(array) {
  function filterEmpty(a) {
    return a.filter(x => x !== 0);
  };
  /* eslint-disable */
  array = filterEmpty(array);

  if (array.length > 0) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        score += array[i] + array[i + 1];
        array[i] *= 2;
        array[i + 1] = 0;
      };
    };
  };

  array = filterEmpty(array);

  while (array.length < size) {
    array.push(0);
  };

  return array;
}

function slideLeft() {
  let changed = false;

  for (let i = 0; i < 4; i++) {
    const old = Array.from(gameField[i]);

    gameField[i] = slide(gameField[i]);
    changed = changed || (gameField[i].join(',') !== old.join(','));
  };

  return changed;
};

function swap(x1, y1, x2, y2) {
  const tmp = gameField[y1][x1];

  gameField[y1][x1] = gameField[y2][x2];
  gameField[y2][x2] = tmp;
};

function mirror() {
  for (let y = 0; y < size; y++) {
    for (let xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
      swap(xLeft, y, xRight, y);
    };
  };
};

function transpose() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < y; x++) {
      swap(x, y, y, x);
    };
  };
};

function moveLeft() {
  return slideLeft();
};

function moveRight() {
  mirror();

  const changed = moveLeft();

  mirror();

  return changed;
};

function moveUp() {
  transpose();

  const changed = moveLeft();

  transpose();

  return changed;
};

function moveDown() {
  transpose();

  const changed = moveRight();

  transpose();

  return changed;
};

function hasEmptyCell() {
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (gameField[x][y] === 0) {
        return true;
      };
    };
  };

  return false;
};

function isFinish(field) {
  const copyField = field.map(x => [...x]);
  const winner = copyField.find(x => x.find(y => y >= 2048));

  if(winner) {
    messageWin.className = 'message message-win';
  };

  if (score > bestScore.innerText) {
    bestScore.innerText = score;
  };


  if (hasEmptyCell()) {
    return;
  };

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size - 1; y++) {
      if (gameField[x][y] === gameField[x][y + 1]
        || gameField[y][x] === gameField[y + 1][x]) {
        return;
      };
    };
  };

  if (score > bestScore.innerText) {
    bestScore.innerText = score;
  };

  messageLose.classList.remove('hidden');
};

document.addEventListener('keydown', function(e) {
  const code = e.keyCode;
  let ok;

  switch (code) {
    case 40: ok = moveDown(); break;
    case 38: ok = moveUp(); break;
    case 37: ok = moveLeft(); break;
    case 39: ok = moveRight(); break;
    default: return;
  };

  if (ok) {
    startGame();
    render();
    isFinish(gameField);
  };
});
