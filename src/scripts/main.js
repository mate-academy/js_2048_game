'use strict';

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');

const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageGameOver = document.querySelector('.message-lose');

const fieldRow = document.querySelectorAll('.field-row');

let totalScore = 0;
const rows = 4;
const columns = 4;

const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function udateGameField() {
  const randomRow = Math.floor(Math.random() * rows);
  const randomCell = Math.floor(Math.random() * columns);
  const randomNumber = Math.floor(Math.random() * 10);
  const smallDigit = randomNumber < 9 ? 2 : 4;

  if (gameField[randomRow][randomCell] === 0) {
    gameField[randomRow][randomCell] = smallDigit;
    updeteInfo();
  } else {
    udateGameField();
    checkforfGameOver();
  }
};

function updeteInfo() {
  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      if (gameField[row][cell] === 0) {
        fieldRow[row].children[cell].textContent = '';
        fieldRow[row].children[cell].className = 'field-cell';
      } else {
        fieldRow[row].children[cell].textContent = gameField[row][cell];
        fieldRow[row].children[cell].className = 'field-cell';

        fieldRow[row].children[cell]
          .classList.add(`field-cell--${gameField[row][cell]}`);
      }
    }
  }
}

function checkforfGameOver() {
  let emptyCells = 0;

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      if (gameField[row][cell] === 0) {
        emptyCells++;
      }
    }
  }

  if (emptyCells === 0 && !possiblesMovements()) {
    messageGameOver.classList.remove('hidden');
  }
}

function possiblesMovements() {
  for (let row = 0; row < rows - 1; row++) {
    for (let cell = 0; cell < columns; cell++) {
      if (gameField[row][cell] === gameField[row + 1][cell]) {
        return true;
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      if (gameField[row][cell] === gameField[row][cell + 1]) {
        return true;
      }
    }
  }
}

button.addEventListener('click', () => {
  button.classList.remove('start');
  button.classList.add('restart');

  messageStart.classList.add('hidden');

  if (button.classList.contains('restart')) {
    button.textContent = 'Restart';
    restart();
  }

  udateGameField();
  udateGameField();
});

function restart() {
  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      gameField[row][cell] = 0;
    }
  }
}

document.addEventListener('keydown', function(ev) {
  const key = ev.key;

  if (button.classList.contains('restart')) {
    switch (key) {
      case 'ArrowLeft':
        moveCells('left');
        udateGameField();
        break;
      case 'ArrowRight':
        moveCells('right');
        udateGameField();
        break;
      case 'ArrowUp':
        moveCells('up');
        udateGameField();
        break;
      case 'ArrowDown':
        moveCells('down');
        udateGameField();
        break;
    }
  }
});

function moveCells(direction) {
  const gameFieldReversed = [
    [],
    [],
    [],
    [],
  ];

  for (let r = 0; r < rows; r++) {
    for (let cell = 0; cell < columns; cell++) {
      gameFieldReversed[r].push(gameField[cell][r]);
    }

    let row = gameField[r];

    switch (direction) {
      case 'left':
        row = gameField[r];
        row = slide(row);
        gameField[r] = row;
        break;
      case 'right':
        row.reverse();
        row = gameField[r];
        row = slide(row);
        row.reverse();
        gameField[r] = row;
        break;
      case 'up':
        row = gameFieldReversed[r];
        row = slide(row);
        gameFieldReversed[r] = row;
        break;
      case 'down':
        row = gameFieldReversed[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        gameFieldReversed[r] = row;
        break;
    }
  }

  if (direction === 'up' || direction === 'down') {
    for (let row = 0; row < rows; row++) {
      for (let coll = 0; coll < columns; coll++) {
        gameField[coll][row] = gameFieldReversed[row][coll];
      }
    }
  }
}

const slide = (gameFieldRow) => {
  let numbers = gameFieldRow.filter(el => el !== 0);

  for (let num = 0; num < numbers.length; num++) {
    if (numbers[num] === numbers[num + 1]) {
      numbers[num] *= 2;
      numbers[num + 1] = 0;

      totalScore += numbers[num];
      score.textContent = totalScore;
    }
  }

  numbers = numbers.filter(x => x !== 0);

  while (numbers.length < columns) {
    numbers.push(0);
  }

  if (totalScore === 2048) {
    messageWin.classList.remove('hidden');
  }

  return numbers;
};
