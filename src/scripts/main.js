'use strict';

const buttonStart = document.querySelector('.start');
const rowField = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageRestart = document.querySelector('.message-restart');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
let score = 0;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function randomize() {
  const randomRow = Math.floor(Math.random() * 4);
  const randomColumn = Math.floor(Math.random() * 4);

  if (gameField[randomRow][randomColumn] === 0) {
    gameField[randomRow][randomColumn] = Math.random() < 0.1 ? 4 : 2;
  } else {
    randomize();
  }
  updateCellStyles();
}

function gameStart() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  randomize();
  randomize();
  updateCellStyles();
}

function moveRight() {
  gameField = gameField.map(row => {
    return row.filter(num => num === 0)
      .concat(row.filter(num => num !== 0));
  });
}

function moveLeft() {
  gameField = gameField.map(row => {
    return row.filter(num => num !== 0)
      .concat(row.filter(num => num === 0));
  });
}

function moveDown() {
  slideRight();
  moveLeft();
  slideLeft();
}

function moveUp() {
  slideRight();
  moveRight();
  slideLeft();
}

function moveMix(move, combinate) {
  move();
  combinate();
  move();
}

function slideRight() {
  const newArray = [];

  for (let x = 0; x < gameField[0].length; x++) {
    newArray[x] = [];

    for (let i = gameField.length - 1; i >= 0; i--) {
      newArray[x].push(gameField[i][x]);
    }
  }

  gameField = newArray;
};

function slideLeft() {
  const newArray = [];

  for (let x = 0; x < gameField[0].length; x++) {
    newArray[x] = [];

    for (let i = gameField.length - 1; i >= 0; i--) {
      newArray[x].unshift(gameField[i][x]);
    }
  }

  gameField = newArray.reverse();
};

function combineRow() {
  for (const row of gameField) {
    for (let i = 0; i < 4; i++) {
      if (row[i] === row[i + 1]) {
        const total = row[i] + row[i + 1];

        row[i] = total;
        row[i + 1] = 0;
        score += total;
        gameScore.innerHTML = score;
      }
    }
  }
}

function combineColumn() {
  slideRight();
  combineRow();
  slideLeft();
}

function updateCellStyles() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] > 0) {
        rowField[row].children[col].innerHTML = gameField[row][col];

        rowField[row].children[col].className = `
        field-cell field-cell--${gameField[row][col]}`;
      } else {
        rowField[row].children[col].innerHTML = '';
        rowField[row].children[col].className = 'field-cell';
      }
    }
  }
}

buttonStart.addEventListener('click', () => {
  buttonStart.classList.replace('start', 'restart');
  buttonStart.innerHTML = 'Restart';
  messageStart.classList.add('hidden');
  messageRestart.classList.remove('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  gameScore.innerHTML = 0;
  score = 0;

  gameStart();
});

document.addEventListener('keyup', (key) => {
  if (buttonStart.classList.contains('restart')) {
    switch (key.code) {
      case 'ArrowRight':
        moveMix(moveRight, combineRow);
        randomize();
        break;
      case 'ArrowLeft':
        moveMix(moveLeft, combineRow);
        randomize();
        break;
      case 'ArrowUp':
        moveMix(moveUp, combineColumn);
        randomize();
        break;
      case 'ArrowDown':
        moveMix(moveDown, combineColumn);
        randomize();
    }
  }
  checkForWin();
  checkForLose();
  updateCellStyles();
});

function checkForWin() {
  gameField.some((cell) => {
    if (cell.includes(2048)) {
      messageRestart.classList.add('hidden');
      messageWin.classList.remove('hidden');
      buttonStart.classList.replace('restart', 'start');
      buttonStart.innerHTML = 'Start';
    }
  });
}

function checkForLose() {
  let gameOver = true;
  const noZeros = gameField.some(cell => cell.includes(0));

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (gameField[r][c] === gameField[r][c + 1]
        || gameField[c][r] === gameField[c + 1][r]) {
        gameOver = false;
      }
    }
  }

  if (gameOver && !noZeros) {
    messageLose.classList.remove('hidden');
    messageRestart.classList.add('hidden');
    buttonStart.classList.replace('restart', 'start');
    buttonStart.innerHTML = 'Start';
  }
};
