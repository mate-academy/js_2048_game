'use strict';

import Game from '../modules/Game.class';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const gridrows = document.querySelectorAll('tr');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.textContent = 'Restart';
    game.status = 'playing';

    const first = randomizer();

    spawnCube(first.randomElement.i, first.randomElement.j, first.number);

    const second = randomizer();

    spawnCube(second.randomElement.i, second.randomElement.j, second.number);

    updateTable();
  }

  if (startButton.classList.contains('restart')) {
    startButton.textContent = 'Start';
    game.status = 'idle';

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const row = gridrows[i];
        const rowcolumns = row.querySelectorAll('td');
        const cell = rowcolumns[j];

        cell.classList.remove(`field-cell--${game.initialState[i][j]}`);
        cell.textContent = null;

        game.initialState[i][j] = 0;
      }
    }

    const lost = document.querySelector('.message-lose');
    const win = document.querySelector('.message-win');

    lost.classList.add('hidden');
    win.classList.add('hidden');

    updateTable();
  }

  messageStart.classList.toggle('hidden');
  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': {
      if (game.getStatus() === 'playing') {
        const arr = game.initialState.map((row) => [...row]);

        game.moveUp();

        let temp = false;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (arr[i][j] !== game.initialState[i][j]) {
              temp = true;
            }
          }
        }

        if (temp) {
          const number = randomizer();

          spawnCube(
            number.randomElement.i,
            number.randomElement.j,
            number.number,
          );
        }

        updateTable();
        hasLost();
        hasWon();
      }
      break;
    }

    case 'ArrowDown': {
      if (game.getStatus() === 'playing') {
        const arr = game.initialState.map((row) => [...row]);

        game.moveDown();

        let temp = false;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (arr[i][j] !== game.initialState[i][j]) {
              temp = true;
            }
          }
        }

        if (temp) {
          const number = randomizer();

          spawnCube(
            number.randomElement.i,
            number.randomElement.j,
            number.number,
          );
        }

        updateTable();
        hasLost();
        hasWon();
      }
      break;
    }

    case 'ArrowLeft': {
      if (game.getStatus() === 'playing') {
        const arr = game.initialState.map((row) => [...row]);

        game.moveLeft();

        let temp = false;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (arr[i][j] !== game.initialState[i][j]) {
              temp = true;
            }
          }
        }

        if (temp) {
          const number = randomizer();

          spawnCube(
            number.randomElement.i,
            number.randomElement.j,
            number.number,
          );
        }

        updateTable();
        hasLost();
        hasWon();
      }
      break;
    }

    case 'ArrowRight': {
      if (game.getStatus() === 'playing') {
        const arr = game.initialState.map((row) => [...row]);

        game.moveRight();

        let temp = false;

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (arr[i][j] !== game.initialState[i][j]) {
              temp = true;
            }
          }
        }

        if (temp) {
          const number = randomizer();

          spawnCube(
            number.randomElement.i,
            number.randomElement.j,
            number.number,
          );
        }

        updateTable();
        hasLost();
        hasWon();
      }
      break;
    }
  }
});

const randomizer = function () {
  const result = [];
  const number = Math.random() < 0.1 ? 4 : 2;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.initialState[i][j] === 0) {
        result.push({ i, j });
      }
    }
  }

  const randomElement = result[Math.floor(Math.random() * result.length)];

  return { randomElement, number };
};

const spawnCube = function (i, j, number) {
  game.initialState[i][j] = number;
};

const updateTable = function () {
  for (let i = 0; i < 4; i++) {
    const row = gridrows[i];
    const rowcolumns = row.querySelectorAll('td');

    for (let j = 0; j < 4; j++) {
      rowcolumns[j].classList.remove(
        `field-cell--${rowcolumns[j].textContent}`,
      );

      rowcolumns[j].textContent = null;

      if (game.initialState[i][j] !== 0) {
        rowcolumns[j].textContent = game.initialState[i][j];

        rowcolumns[j].classList.add(`field-cell--${game.initialState[i][j]}`);
      }
    }
  }

  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();
};

const hasLost = function () {
  const arr = game.initialState.map((row) => [...row]);
  const tempGame = new Game(arr);
  let lostBoolean = true;

  tempGame.status = 'playing';
  tempGame.moveDown();

  lostBoolean = isEqual(tempGame);

  if (lostBoolean) {
    tempGame.moveUp();

    lostBoolean = isEqual(tempGame);

    if (lostBoolean) {
      tempGame.moveRight();

      lostBoolean = isEqual(tempGame);

      if (lostBoolean) {
        tempGame.moveLeft();

        lostBoolean = isEqual(tempGame);
      }
    }
  }

  if (lostBoolean === true) {
    game.status = 'lose';

    const lost = document.querySelector('.message-lose');

    lost.classList.toggle('hidden');
  }
};

const hasWon = function () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.initialState[i][j] === 2048) {
        game.status = 'win';

        const win = document.querySelector('.message-win');

        win.classList.toggle('hidden');

        break;
      }
    }
  }
};

const isEqual = function (arr) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (arr.initialState[i][j] !== game.initialState[i][j]) {
        return false;
      }
    }
  }

  return true;
};
