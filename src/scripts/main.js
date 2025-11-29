'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const container = document.querySelector('.container');
const gameHeader = container.querySelector('.game-header');
const controls = gameHeader.querySelector('.controls');
const button = controls.querySelector('button.button');
const gameScore = controls.querySelector('.game-score');

const tBody = container.querySelector('tbody');
const arrayOfTr = [...tBody.querySelectorAll('tr')];

const messages = container.querySelector('.message-container');
const startMessage = messages.querySelector('.message-start');
const loseMessage = messages.querySelector('.message-lose');
const winMessage = messages.querySelector('.message-win');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    const values = game.start();

    startMessage.classList.add('hidden');

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    values.forEach((value) => {
      const [row, column] = game.getRandomCoords();

      const cell = arrayOfTr[row].children[column];

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);

      game.matrix[row][column] = value;
    });
  } else {
    [...game.getState()].forEach((array, index) => {
      array.forEach((number, i) => {
        const cell = arrayOfTr[index].children[i];

        cell.textContent = '';
        cell.className = 'field-cell';

        if (number > 0) {
          cell.classList.remove(`field-cell--${number}`);
        }
      });
    });

    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    game.restart();

    gameScore.textContent = `${game.getScore()}`;
  }
});

document.addEventListener('keydown', (EVENT) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = EVENT.key;

  const prevState = JSON.stringify(game.getState());

  if (key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (key === 'ArrowRight') {
    game.moveRight();
  }

  if (key === 'ArrowUp') {
    game.moveUp();
  }

  if (key === 'ArrowDown') {
    game.moveDown();
  }

  const nextState = JSON.stringify(game.getState());

  if (prevState !== nextState) {
    const randomElem = game.addRandomElement();

    if (game.matrix.flat().includes(0)) {
      const [row, column] = game.getRandomCoords();

      game.matrix[row][column] = randomElem;

      const cell = arrayOfTr[row].children[column];

      cell.textContent = randomElem;
      cell.classList.add(`field-cell--${randomElem}`);
    }

    game.isPlaying();

    if (game.matrix.flat().includes(0)) {
      const [row, column] = game.getRandomCoords();

      game.matrix[row][column] = randomElem;

      const cell = arrayOfTr[row].children[column];

      cell.textContent = randomElem;
      cell.classList.add(`field-cell--${randomElem}`);
    }

    game.isPlaying();

    const matrix = game.getState();

    matrix.forEach((array, rowIndex) => {
      array.forEach((number, colIndex) => {
        const cell = arrayOfTr[rowIndex].children[colIndex];

        cell.textContent = '';
        cell.className = 'field-cell';

        if (number > 0) {
          cell.textContent = number;
          cell.classList.add(`field-cell--${number}`);
        }
      });
    });

    if (game.getStatus() === 'lose') {
      loseMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }
  }

  gameScore.textContent = `${game.getScore()}`;
});
