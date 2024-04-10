'use strict';

const MAX_VALUE = 2048;

const rowsField = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');

let score = 0;
let gameField = emptyArray();

function emptyArray() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function randomNum() {
  return Math.random() > 0.9 ? 4 : 2;
}

function randomInd() {
  return Math.floor(Math.random() * 4);
}

function startGame() {
  const x = randomInd();
  const y = randomInd();

  if (gameField[x][y] === 0) {
    gameField[x][y] = randomNum();
  } else {
    startGame();
  }
}

function render() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      rowsField[row].children[col].textContent = gameField[row][col]
        ? gameField[row][col]
        : '';

      rowsField[row].children[col].className =
        `field-cell field-cell--${gameField[row][col]}`;
    }
  }

  gameScore.textContent = score;
}

function reset() {
  gameField = emptyArray();
  score = 0;

  render();
  setupInput();
}

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
    document.querySelector('.message-start').classList.add('hidden');
  } else {
    document.querySelector('.message-lose').className =
      'message message-lose hidden';

    document.querySelector('.message-win').className =
      'message message-win hidden';
    reset();
  }

  startGame();
  startGame();
  render();
});

setupInput();

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    default:
      setupInput();

      return;
  }

  const isNotEmpty = gameField.some((group) => group.includes(0));

  if (!isNotEmpty && canMove(gameField) === false) {
    document.querySelector('.message-lose').classList.toggle('hidden');
  } else {
    setupInput();
  }

  const isWin = gameField.some((group) => group.includes(MAX_VALUE));

  if (isWin) {
    document.querySelector('.message-win').classList.toggle('hidden');
  }
}

function cellsByRow(field) {
  const newArr = [];

  for (let i = 0; i < field.length; i++) {
    const arr = [];

    for (let j = 0; j < field[i].length; j++) {
      arr.push(field[j][i]);
    }
    newArr.push(arr);
  }

  return newArr;
}

function moveUp() {
  const byRow = moveCells(cellsByRow(gameField));
  const copyGameField = gameField.map((group) => [...group]);
  const newGameField = gameField.map((group) => [...group]);
  let isBreak = false;

  for (let i = 0; i < 4; i++) {
    for (let k = 0; k < 4; k++) {
      newGameField[i][k] = byRow[k][i];
    }
  }

  for (let i = 0; i < copyGameField.length; i++) {
    for (let k = 0; k < copyGameField[i].length; k++) {
      if (copyGameField[i][k] !== newGameField[i][k]) {
        gameField = newGameField;
        startGame();
        render();
        isBreak = true;
        break;
      }
    }

    if (isBreak) {
      break;
    }
  }
}

function moveDown() {
  const reverseGameField = gameField.map((group) => [...group]).reverse();
  const byRow = moveCells(cellsByRow(reverseGameField));
  const newGameField = gameField.map((group) => [...group]);

  const copyGameField = gameField.map((group) => [...group]);
  let isBreak = false;

  for (let i = 0; i < 4; i++) {
    for (let k = 0; k < 4; k++) {
      newGameField[i][k] = byRow[k][i];
    }
  }

  newGameField.reverse();

  for (let i = 0; i < copyGameField.length; i++) {
    for (let k = 0; k < copyGameField[i].length; k++) {
      if (copyGameField[i][k] !== newGameField[i][k]) {
        gameField = newGameField;
        startGame();
        render();
        isBreak = true;
        break;
      }
    }

    if (isBreak) {
      break;
    }
  }
}

function moveLeft() {
  const newGameField = moveCells(gameField);
  const copyGameField = gameField.map((group) => [...group]);

  let isBreak = false;

  for (let i = 0; i < copyGameField.length; i++) {
    for (let k = 0; k < copyGameField[i].length; k++) {
      if (copyGameField[i][k] !== newGameField[i][k]) {
        gameField = newGameField;
        startGame();
        render();
        isBreak = true;
        break;
      }
    }

    if (isBreak) {
      break;
    }
  }
}

function moveRight() {
  const reverseGameField = gameField.map((group) => [...group].reverse());
  const newGameField = moveCells(reverseGameField).map((group) => {
    return [...group].reverse();
  });

  const copyGameField = gameField.map((group) => [...group]);
  let isBreak = false;

  for (let i = 0; i < copyGameField.length; i++) {
    for (let k = 0; k < copyGameField[i].length; k++) {
      if (copyGameField[i][k] !== newGameField[i][k]) {
        gameField = newGameField;
        startGame();
        render();
        isBreak = true;
        break;
      }
    }

    if (isBreak) {
      break;
    }
  }
}

function moveCells(cells) {
  const mergeCells = [];

  cells.forEach((group) => {
    let numbers = group.filter((x) => x !== 0);
    let isMerge = false;

    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === numbers[i - 1] && !isMerge) {
        numbers[i - 1] = numbers[i] + numbers[i];
        numbers[i] = 0;
        score += numbers[i - 1];
        i--;
        isMerge = true;

        numbers = numbers.filter((x) => x !== 0);
      }
    }

    const difLen = group.length - numbers.length;

    if (group.length !== numbers.length) {
      mergeCells.push(numbers.concat(Array(difLen).fill(0)));
    } else {
      mergeCells.push(numbers);
    }
  });

  return mergeCells;
}

function canMove(field) {
  let byRow = false;

  field.forEach((row) => {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        byRow = true;
      }
    }
  });

  let byColumn = false;

  for (let i = 0; i < field.length; i++) {
    for (let k = 0; k < field[i].length - 1; k++) {
      if (field[k][i] === field[k + 1][i]) {
        byColumn = true;
      }
    }
  }

  return byRow || byColumn;
}
