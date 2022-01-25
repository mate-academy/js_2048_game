'use strict';

const btn = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const rowsField = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const bestScore = document.querySelector('.best-game__score');

let score = 0;

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function reset() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  messageLose.className += 'message message-lose hidden';
  messageWin.className = 'message message-win hidden';

  render();
}

function render() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      rowsField[row].children[col].textContent
        = gameField[row][col] ? gameField[row][col] : '';

      rowsField[row].children[col].className
        = `field-cell field-cell--${gameField[row][col]}`;
    }
  }

  gameScore.innerText = score;
}

function itIsFinish(field) {
  if (score >= 2048) {
    messageWin.className = 'message message-win';
    bestScore.innerText = score;
  }

  const copyField = field.map(x => [...x]);
  const findeEmpty
    = copyField.reduce((a, b) => a.concat(b)).every(x => x !== 0);

  if (findeEmpty) {
    for (let i = 0; i < 4; i++) {
      for (let x = 0; x < 3; ++x) {
        if (copyField[i][x] === copyField[i][x + 1]) {
          return false;
        }
      }
    }

    rotateRight(copyField);

    for (let i = 0; i < 4; i++) {
      for (let x = 0; x < 3; ++x) {
        if (copyField[i][x] === copyField[i][x + 1]) {
          return false;
        }
      }
    }

    if (score > bestScore.innerText) {
      bestScore.innerText = score;
    }
    messageLose.className = 'message message-lose';
  }
}

function startGame() {
  const randomX = Math.floor(Math.random() * 4);
  const randomY = Math.floor(Math.random() * 4);

  if (gameField[randomX][randomY] === 0) {
    gameField[randomX][randomY] = Math.random() > 0.9 ? 4 : 2;
  } else {
    startGame();
  }
}

function sortRow(key) {
  for (let i = 0; i < 4; i++) {
    let rowData = gameField[i].filter(x => x !== 0);
    let rowEmpty = gameField[i].filter(x => x === 0);

    if (key !== 'ArrowLeft') {
      gameField[i] = rowEmpty.concat(rowData);
    } else {
      gameField[i] = rowData.concat(rowEmpty);
    }

    if (key !== 'ArrowLeft') {
      if (gameField[i][3] === gameField[i][2]) {
        gameField[i][3] = gameField[i][2] * 2;
        score += gameField[i][3];
        gameField[i][2] = 0;
      }

      if (gameField[i][2] === gameField[i][1]) {
        gameField[i][2] = gameField[i][1] * 2;
        score += gameField[i][2];
        gameField[i][1] = 0;
      }

      if (gameField[i][1] === gameField[i][0]) {
        gameField[i][1] = gameField[i][0] * 2;
        score += gameField[i][1];
        gameField[i][0] = 0;
      }
    } else {
      if (gameField[i][0] === gameField[i][1]) {
        gameField[i][0] = gameField[i][1] * 2;
        score += gameField[i][0];
        gameField[i][1] = 0;
      }

      if (gameField[i][1] === gameField[i][2]) {
        gameField[i][1] = gameField[i][2] * 2;
        score += gameField[i][1];
        gameField[i][2] = 0;
      }

      if (gameField[i][2] === gameField[i][3]) {
        gameField[i][2] = gameField[i][3] * 2;
        score += gameField[i][2];
        gameField[i][3] = 0;
      }
    }

    rowData = gameField[i].filter(x => x !== 0);
    rowEmpty = gameField[i].filter(x => x === 0);

    if (key !== 'ArrowLeft') {
      gameField[i] = rowEmpty.concat(rowData);
    } else {
      gameField[i] = rowData.concat(rowEmpty);
    }
  }
};

function rotateRight(field) {
  const newField = [ ...field ].map(x => [...x]).reduce((a, b) => a.concat(b));

  for (let i = gameField.length - 1; i >= 0; i--) {
    for (let x = 0; x < gameField.length; x++) {
      field[x][i] = newField.shift();
    }
  }
}

function rotateLeft(field) {
  const newField = [ ...field ].reduce((a, b) => a.concat(b));

  for (let i = gameField.length - 1; i >= 0; i--) {
    for (let x = 0; x < gameField.length; x++) {
      gameField[x][i] = newField.pop();
    }
  }
};

function checkField(arrStart, arrEnd) {
  const checkArrStart = [ ...arrStart ].reduce((a, b) => a.concat(b));
  const checkArrEnd = [ ...arrEnd ].reduce((a, b) => a.concat(b));

  for (let i = 0; i < checkArrStart.length; i++) {
    if (checkArrStart[i] !== checkArrEnd[i]) {
      return false;
    }
  }

  return true;
}

btn.addEventListener('click', (e) => {
  if (btn.innerText === 'Start') {
    btn.classList.replace('start', 'restart');
    btn.innerText = 'Restart';
    messageStart.hidden = true;
  } else {
    reset();
  }

  startGame();
  startGame();

  render();
});

document.addEventListener('keydown', (e) => {
  if (btn.innerText === 'Start' || !messageWin.classList.contains('hidden')) {
    return;
  }

  const oldField = gameField.map(x => [ ...x ]);

  switch (e.key) {
    case 'ArrowUp':
      rotateRight(gameField);

      sortRow(e.key);
      rotateLeft(gameField);

      if (!checkField(oldField, gameField)) {
        startGame();
      }

      render();
      itIsFinish(gameField);
      break;

    case 'ArrowDown':
      rotateLeft(gameField);

      sortRow(e.key);
      rotateRight(gameField);

      if (!checkField(oldField, gameField)) {
        startGame();
      }

      render();
      itIsFinish(gameField);
      break;

    case 'ArrowRight':
      sortRow(e.key);

      if (!checkField(oldField, gameField)) {
        startGame();
      }

      render();
      itIsFinish(gameField);
      break;

    case 'ArrowLeft':
      sortRow(e.key);

      if (!checkField(oldField, gameField)) {
        startGame();
      }

      render();
      itIsFinish(gameField);
      break;
  }
});
