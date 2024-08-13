'use strict';

// Uncomment the next lines to use your game instance in the browser
const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const Game = require('../modules/Game.class');
const game = new Game(initialState);

let filledCells = 0;
const score = document.querySelector('.game-score');

let state = structuredClone(initialState);

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (button.className === 'button restart') {
    game.restart();
  }

  if (button.className === 'button start') {
    game.start();
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 37:
      game.moveLeft();
      break;
    case 38:
      game.moveUp();
      break;
    case 39:
      game.moveRight();
      break;
    case 40:
      game.moveDown();
  }

  if ([...cells].some((cell) => cell.textContent === '2048')) {
    messageWin.className = 'message message-win';
  }

  if (filledCells === cells.length && !canGameContinue()) {
    messageLose.className = 'message message-lose';
  }
});

game.start = () => {
  messageStart.className = 'message message-start hidden';
  messageLose.className = 'message message-lose hidden';
  messageWin.className = 'message message-win hidden';
  button.className = 'button restart';
  button.textContent = 'Restart';
  addRandomNumInCells();
  addRandomNumInCells();
};

game.restart = () => {
  filledCells = 0;
  score.textContent = 0;
  state = structuredClone(initialState);
  game.start();
};

game.getScore = () => {
  let totalScore = 0;

  for (const raw of state) {
    totalScore += raw.reduce((sum, num) => sum + num);
  }

  return totalScore;
};

function addRandomNumInCells() {
  let randomRowIndex = Math.round(Math.random() * 3);
  let randomColumnIndex = Math.round(Math.random() * 3);
  const cellTextContent = Math.random() < 0.1 ? 4 : 2;

  while (
    state[randomRowIndex][randomColumnIndex] > 0 &&
    filledCells < cells.length
  ) {
    randomRowIndex = Math.round(Math.random() * 3);
    randomColumnIndex = Math.round(Math.random() * 3);
  }

  state[randomRowIndex][randomColumnIndex] = cellTextContent;
  filledCells++;
  score.textContent = game.getScore();
  changeRealState();
}

function changeRealState() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent =
      state[Math.floor(i / 4)][i % 4] === 0
        ? ''
        : state[Math.floor(i / 4)][i % 4];

    cells[i].className =
      state[Math.floor(i / 4)][i % 4] === 0
        ? 'field-cell'
        : `field-cell field-cell--${state[Math.floor(i / 4)][i % 4]}`;
  }
}

function canGameContinue() {
  let isSomethingChanged = false;

  for (let i = state.length - 2; i >= 0; i--) {
    for (let j = 0; j < state[i].length; j++) {
      if (state[i + 1][j] === state[i][j] && state[i][j] !== 0) {
        isSomethingChanged = true;
      }
    }
  }

  for (let i = state.length - 1; i > 0; i--) {
    for (let j = 0; j < state[i].length; j++) {
      if (state[i - 1][j] === state[i][j] && state[i][j] !== 0) {
        isSomethingChanged = true;
      }
    }
  }

  for (let i = 0; i < state.length; i++) {
    for (let j = 1; j < state[i].length; j++) {
      if (state[i][j - 1] === state[i][j] && state[i][j] !== 0) {
        isSomethingChanged = true;
      }
    }
  }

  for (let i = 0; i < state.length; i++) {
    for (let j = state[i].length - 2; j >= 0; j--) {
      if (state[i][j + 1] === state[i][j] && state[i][j] !== 0) {
        isSomethingChanged = true;
      }
    }
  }

  return isSomethingChanged;
}

game.moveDown = () => {
  let isSomethingChanged = false;
  const jWasUsed = [];

  for (let n = 0; n < state.length; n++) {
    for (let i = state.length - 2; i >= 0; i--) {
      for (let j = 0; j < state[i].length; j++) {
        if (
          state[i + 1][j] === state[i][j] &&
          state[i][j] !== 0 &&
          jWasUsed.every((ind) => ind !== j)
        ) {
          if (
            state[0][j] !== 0 &&
            state[3][j] !== 0 &&
            state[0][j] === state[1][j] &&
            state[2][j] === state[3][j]
          ) {
            state[3][j] = state[2][j] * 2;
            state[2][j] = state[1][j] * 2;
            state[1][j] = 0;
            state[0][j] = 0;
            isSomethingChanged = true;
            jWasUsed.push(j);
            filledCells -= 2;
            continue;
          }
          state[i + 1][j] *= 2;
          state[i][j] = 0;
          isSomethingChanged = true;
          jWasUsed.push(j);
          filledCells--;
        }

        if (state[i + 1][j] === 0 && state[i][j] !== 0) {
          [state[i + 1][j], state[i][j]] = [state[i][j], state[i + 1][j]];
          isSomethingChanged = true;
        }
      }
    }
  }

  if (isSomethingChanged) {
    addRandomNumInCells();
  }
};

game.moveUp = () => {
  let isSomethingChanged = false;
  const jWasUsed = [];

  for (let n = 0; n < state.length; n++) {
    for (let i = state.length - 1; i > 0; i--) {
      for (let j = 0; j < state[i].length; j++) {
        if (
          state[i - 1][j] === state[i][j] &&
          state[i][j] !== 0 &&
          jWasUsed.every((ind) => ind !== j)
        ) {
          if (
            state[0][j] !== 0 &&
            state[3][j] !== 0 &&
            state[0][j] === state[1][j] &&
            state[2][j] === state[3][j]
          ) {
            state[0][j] = state[1][j] * 2;
            state[1][j] = state[2][j] * 2;
            state[2][j] = 0;
            state[3][j] = 0;
            isSomethingChanged = true;
            jWasUsed.push(j);
            filledCells -= 2;
            continue;
          }
          state[i - 1][j] *= 2;
          state[i][j] = 0;
          isSomethingChanged = true;
          jWasUsed.push(j);
          filledCells--;
        }

        if (state[i - 1][j] === 0 && state[i][j] !== 0) {
          [state[i - 1][j], state[i][j]] = [state[i][j], state[i - 1][j]];
          isSomethingChanged = true;
        }
      }
    }
  }

  if (isSomethingChanged) {
    addRandomNumInCells();
  }
};

game.moveLeft = () => {
  let isSomethingChanged = false;
  const iWasUsed = [];

  for (let n = 0; n < state.length; n++) {
    for (let i = 0; i < state.length; i++) {
      for (let j = 1; j < state[i].length; j++) {
        if (
          state[i][j - 1] === state[i][j] &&
          state[i][j] !== 0 &&
          iWasUsed.every((ind) => ind !== i)
        ) {
          if (
            state[i][0] !== 0 &&
            state[i][3] !== 0 &&
            state[i][0] === state[i][1] &&
            state[i][2] === state[i][3]
          ) {
            state[i][0] = state[i][1] * 2;
            state[i][1] = state[i][2] * 2;
            state[i][2] = 0;
            state[i][3] = 0;
            isSomethingChanged = true;
            iWasUsed.push(i);
            filledCells -= 2;
            continue;
          }
          state[i][j - 1] *= 2;
          state[i][j] = 0;
          isSomethingChanged = true;
          iWasUsed.push(i);
          filledCells--;
        }

        if (state[i][j - 1] === 0 && state[i][j] !== 0) {
          [state[i][j - 1], state[i][j]] = [state[i][j], state[i][j - 1]];
          isSomethingChanged = true;
        }
      }
    }
  }

  if (isSomethingChanged) {
    addRandomNumInCells();
  }
};

game.moveRight = () => {
  let isSomethingChanged = false;
  const iWasUsed = [];

  for (let n = 0; n < state.length; n++) {
    for (let i = 0; i < state.length; i++) {
      for (let j = state[i].length - 2; j >= 0; j--) {
        if (
          state[i][j + 1] === state[i][j] &&
          state[i][j] !== 0 &&
          iWasUsed.every((ind) => ind !== i)
        ) {
          if (
            state[i][0] !== 0 &&
            state[i][3] !== 0 &&
            state[i][0] === state[i][1] &&
            state[i][2] === state[i][3]
          ) {
            state[i][3] = state[i][2] * 2;
            state[i][2] = state[i][1] * 2;
            state[i][1] = 0;
            state[i][0] = 0;
            isSomethingChanged = true;
            iWasUsed.push(i);
            filledCells -= 2;
            continue;
          }
          state[i][j + 1] *= 2;
          state[i][j] = 0;
          isSomethingChanged = true;
          iWasUsed.push(i);
          filledCells--;
        }

        if (state[i][j + 1] === 0 && state[i][j] !== 0) {
          [state[i][j + 1], state[i][j]] = [state[i][j], state[i][j + 1]];
          isSomethingChanged = true;
        }
      }
    }
  }

  if (isSomethingChanged) {
    addRandomNumInCells();
  }
};
