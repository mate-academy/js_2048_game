'use strict';

const game = document.querySelector('.game-field tbody');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const gameSize = 4;
const desiredNumber = 2048;
const gameCells = [...Array(4 ** 2)].map(v => -1);
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

function getRandomCellIndex() {
  const emptyCells = gameCells
    .map((cell, index) => (
      {
        index: index,
        value: cell,
      }
    ))
    .filter((cell) => cell.value === -1);

  if (emptyCells.length) {
    const index = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[index].index;
  }

  return -1;
}

function reset() {
  gameCells.fill(-1);
  gameScore = 0;
  start();
}

function start() {
  gameState = PossibleState.Started;

  const testing = false;

  if (testing) {
    gameCells[9] = 1024;
    gameCells[5] = 1024;
    gameCells[13] = 128;
    gameCells[1] = 8;
  } else {
    const cell1 = getRandomCellIndex();

    gameCells[cell1] = getRandom();

    const cell2 = getRandomCellIndex();

    gameCells[cell2] = getRandom();
  }
}

function updateScore(addScore) {
  gameScore += addScore;

  if (addScore === desiredNumber) {
    gameState = PossibleState.Win;
  }
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
    const cellValue = gameCells[i];
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
    .filter(elem => elem !== -1);
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

function fillNewValues(indexes, newValues, direction) {
  const oldValues = indexes.map(index => gameCells[index]);

  if (direction) {
    for (let i = 0; i < newValues.length; i++) {
      gameCells[indexes[i]] = newValues[i];
    }

    for (let i = newValues.length; i < indexes.length; i++) {
      gameCells[indexes[i]] = -1;
    }
  } else {
    for (let i = 0; i < indexes.length - newValues.length; i++) {
      gameCells[indexes[i]] = -1;
    }

    for (let i = 0; i < newValues.length; i++) {
      const ind = indexes[indexes.length - newValues.length + i];

      gameCells[ind] = newValues[i];
    }
  }

  const refreshedValues = indexes.map(index => gameCells[index]);
  let haveChanges = false;

  for (let i = 0; i < oldValues.length; i++) {
    if (oldValues[i] !== refreshedValues[i]) {
      haveChanges = true;
      break;
    }
  }

  return haveChanges;
}

function move(direction) {
  let haveChanges = false;

  if (direction % 2 === 1) {
    haveChanges = moveRow(direction === Left);
  } else {
    haveChanges = moveColumn(direction === Up);
  }

  if (gameState === PossibleState.Started) {
    gameState = PossibleState.InProgress;
  }

  const cell = getRandomCellIndex();

  if (cell >= 0) {
    if (haveChanges) {
      gameCells[cell] = getRandom();
    }
  } else {
    gameState = PossibleState.GameOver;
  }

  render();
}

function moveRow(left) {
  let haveChanges = false;

  for (let i = 0; i < gameSize; i++) {
    const indexes = [];

    for (let j = i * gameSize; j < i * gameSize + gameSize; j++) {
      indexes.push(j);
    }

    const row = gameCells.slice(i * gameSize, i * gameSize + gameSize);
    const result = combineValues(row, left);

    haveChanges |= fillNewValues(indexes, result, left);
  }

  return haveChanges;
}

function moveColumn(up) {
  let haveChanges = false;

  for (let i = 0; i < gameSize; i++) {
    const indexes = [];

    for (let j = 0; j < gameSize; j++) {
      indexes.push(i + j * gameSize);
    }

    const column = gameCells
      .filter((item, index) => (index - i) % gameSize === 0);
    const result = combineValues(column, up);

    haveChanges |= fillNewValues(indexes, result, up);
  }

  return haveChanges;
}

startButton.addEventListener('click', (_event) => {
  reset();
  render();
});

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
