'use strict';

const game = document.querySelector('.game-field tbody');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const gameSize = 4;
const desiredNumber = 2048;
const gameCells = [...Array(4 ** 2)].map((v, i) => (
  {
    index: i,
    value: -1,
  }
));
const [Left, Up, Right, Down] = [1, 2, 3, 4];
const PossibleState = {
  Reset: 0,
  Started: 1,
  InProgress: 2,
  GameOver: 3,
  Win: 4,
};
let gameState = PossibleState.Reset;
let gameScore = 0;

function getRandom() {
  const num = Math.random();

  return (num < 0.9) ? 2 : 4;
}

function getRandomCell() {
  const emptyCells = gameCells.filter((cell, index) => cell.value === -1);

  if (emptyCells.length) {
    const index = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[index];
  }

  return null;
}

function reset() {
  for (const cell of gameCells) {
    cell.value = -1;
  }

  gameScore = 0;
  start();
}

function start() {
  gameState = PossibleState.Started;

  const testing = false;

  if (testing) {
    const cell1 = gameCells[9];

    cell1.value = 1024;

    const cell2 = gameCells[5];

    cell2.value = 1024;

    const cell3 = gameCells[13];

    cell3.value = 128;

    const cell4 = gameCells[1];

    cell4.value = 8;
  } else {
    const cell1 = getRandomCell();

    cell1.value = getRandom();

    const cell2 = getRandomCell();

    cell2.value = getRandom();
  }
}

function updateScore(addScore) {
  gameScore += addScore;

  if (addScore === desiredNumber) {
    gameState = PossibleState.Win;
  }
  render();
}

function render() {
  const inProgress = (gameState === PossibleState.InProgress);

  startMessage.hidden = gameState >= PossibleState.Started;
  startButton.classList.remove(inProgress ? 'start' : 'restart');
  startButton.classList.add(inProgress ? 'restart' : 'start');
  startButton.textContent = inProgress ? 'Restart' : 'Start';

  winMessage.classList.toggle('hidden', gameState !== PossibleState.Win);
  loseMessage.classList.toggle('hidden', gameState !== PossibleState.GameOver);
  score.textContent = gameScore;

  const rows = game.children;

  for (let i = 0; i < gameCells.length; i++) {
    const cellValue = gameCells[i].value;
    const rowIndex = Math.floor(i / gameSize);
    const columnIndex = i % gameSize;
    const cell = rows[rowIndex].children[columnIndex];
    const oldValue = cell.textContent;

    cell.textContent = '';

    if (oldValue.length) {
      cell.classList.remove(`field-cell--${oldValue}`);
    }

    if (cellValue !== -1) {
      cell.textContent = cellValue;
      cell.classList.add(`field-cell--${cellValue}`);
    }
  }
};

function combineValues(cells, direction) {
  const values = cells
    .filter(elem => elem.value !== -1)
    .map(elem => elem.value);
  let comparePos = direction ? 1 : values.length - 2;
  const prevPos = direction ? 0 : values.length - 1;

  for (let startPos = prevPos;
    direction ? comparePos < values.length : comparePos >= 0;
  ) {
    if (values[startPos] === values[comparePos]) {
      updateScore(values[startPos] * 2);
      values[direction ? startPos : comparePos] *= 2;
      values[direction ? comparePos : startPos] = -1;
      direction ? comparePos += 2 : startPos -= 2;
      direction ? startPos += 2 : comparePos -= 2;
    } else {
      direction ? comparePos++ : startPos--;
      direction ? startPos++ : comparePos--;
    }
  }

  return values.filter(value => value !== -1);
}

function fillNewValues(line, newValues, direction) {
  if (direction) {
    for (let i = 0; i < newValues.length; i++) {
      line[i].value = newValues[i];
    }

    for (let i = newValues.length; i < line.length; i++) {
      line[i].value = -1;
    }
  } else {
    for (let i = 0; i < line.length - newValues.length; i++) {
      line[i].value = -1;
    }

    for (let i = 0; i < newValues.length; i++) {
      line[i + line.length - newValues.length].value = newValues[i];
    }
  }
}

function move(direction) {
  if (direction % 2 === 1) {
    moveRow(direction === Left);
  } else {
    moveColumn(direction === Up);
  }

  if (gameState === PossibleState.Started) {
    gameState = PossibleState.InProgress;
  }

  const cell = getRandomCell();

  if (cell) {
    cell.value = getRandom();
  } else {
    gameState = PossibleState.GameOver;
  }

  render();
}

function moveRow(left) {
  for (let i = 0; i < gameSize; i++) {
    const row = gameCells.slice(i * gameSize, i * gameSize + gameSize);
    const result = combineValues(row, left);

    fillNewValues(row, result, left);
  }
}

function moveColumn(up) {
  for (let i = 0; i < gameSize; i++) {
    const column = gameCells
      .filter((item, index) => (index - i) % gameSize === 0);
    const result = combineValues(column, up);

    fillNewValues(column, result, up);
  }
}

startButton.addEventListener('click', (_event) => {
  reset();
  render();
});

// eslint-disable-next-line
//why could not I add event listener to game?
document.addEventListener('keyup', (_event) => {
  if (gameState !== PossibleState.Started
    && gameState !== PossibleState.InProgress) {
    return;
  }

  switch (_event.key) {
    case 'ArrowLeft':
      move(Left);
      break;
    case 'ArrowRight':
      move(Right);
      break;
    case 'ArrowUp':
      move(Up);
      break;
    case 'ArrowDown':
      move(Down);
      break;
    default:
      break;
  }
});
