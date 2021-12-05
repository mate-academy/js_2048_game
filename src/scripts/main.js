'use strict';

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const rowField = document.querySelectorAll('.field-row');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');

let score = 0;

button.addEventListener('click', e => {
  const btn = e.target.closest('.button');

  if (btn.classList.contains('start')) {
    btn.classList.replace('start', 'restart');
    btn.innerHTML = 'Restart';
    newGame();
  } else {
    newGame();
  }

  btn.blur();
  score = 0;
  gameScore.innerHTML = score;
});

const refreshField = () => {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      if (gameField[row][column] > 0) {
        rowField[row].children[column].innerHTML = gameField[row][column];

        rowField[row].children[column].className
          = `field-cell field-cell--${gameField[row][column]}`;
      } else {
        rowField[row].children[column].innerHTML = '';
        rowField[row].children[column].className = `field-cell`;
      }
    }
  }
};

const generate = () => {
  const startNumbs = [2, 2, 2, 2, 2, 4, 2, 2, 2, 2];

  const randomRow = Math.floor(Math.random() * 4);
  const randomColumn = Math.floor(Math.random() * 4);

  if (gameField[randomRow][randomColumn] === 0) {
    gameField[randomRow][randomColumn]
      = startNumbs[Math.floor(Math.random() * 10)];
  } else {
    generate();
  }

  refreshField();
};

const newGame = () => {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  generate();
  generate();
  refreshField();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
};

document.addEventListener('keyup', e => {
  checkForGame();

  if (!winMessage.classList.contains('hidden')
    || !loseMessage.classList.contains('hidden')
    || !startMessage.classList.contains('hidden')) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    moveFunc(moveLeft, combinateRow);
  } else if (e.key === 'ArrowUp') {
    moveFunc(moveTop, combinateColumn);
  } else if (e.key === 'ArrowRight') {
    moveFunc(moveRight, combinateRow);
  } else if (e.key === 'ArrowDown') {
    moveFunc(moveDown, combinateColumn);
  }

  refreshField();
  checkForWin();
});

const moveLeft = () => {
  gameField = gameField.map(row => {
    return row.filter(Boolean).concat(row.filter(numb => numb === 0));
  });
};

const moveRight = () => {
  gameField = gameField.map(row => {
    return row.filter(numb => numb === 0).concat(row.filter(Boolean));
  });
};

const moveTop = () => {
  matrixRight();
  moveRight();
  matrixLeft();
};

const moveDown = () => {
  matrixRight();
  moveLeft();
  matrixLeft();
};

const matrixRight = () => {
  const newArr = [];

  for (let x = 0; x < gameField[0].length; x++) {
    newArr[x] = [];

    for (let i = gameField.length - 1; i >= 0; i--) {
      newArr[x].push(gameField[i][x]);
    }
  }

  gameField = newArr;
};

const matrixLeft = () => {
  const newArr = [];

  for (let x = 0; x < gameField[0].length; x++) {
    newArr[x] = [];

    for (let i = gameField.length - 1; i >= 0; i--) {
      newArr[x].unshift(gameField[i][x]);
    }
  }

  gameField = newArr.reverse();
};

const combinateRow = () => {
  for (const row of gameField) {
    for (let i = 0; i < 4; i++) {
      if (row[i] === row[i + 1]) {
        const total = row[i] + row[i + 1];

        row[i] = total;
        row[i + 1] = 0;
        score += total;
      }
    }
  }
  gameScore.innerHTML = score;
};

const combinateColumn = () => {
  matrixRight();
  combinateRow();
  matrixLeft();
};

const checkForWin = () => {
  for (const row of gameField) {
    if (row.includes(2048)) {
      winMessage.classList.remove('hidden');
    }
  }
};

const checkForGame = () => {
  if (!gameField[0].includes(0)
    && !gameField[1].includes(0)
    && !gameField[2].includes(0)
    && !gameField[3].includes(0)) {
    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 3; cell++) {
        if (gameField[row][cell] === gameField[row][cell + 1]) {
          return;
        }
      }
    }
    matrixRight();

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 3; cell++) {
        if (gameField[row][cell] === gameField[row][cell + 1]) {
          matrixLeft();

          return;
        }
      }
    }
    matrixLeft();
    loseMessage.classList.remove('hidden');
  }
};

const moveFunc = (move, combinate) => {
  const currentField = [...gameField];
  const currentScore = score;

  move();
  combinate();
  move();

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      if (gameField[row][cell] !== currentField[row][cell]
        || currentScore !== score) {
        generate();

        return;
      } else {
        continue;
      }
    }
  }
};
