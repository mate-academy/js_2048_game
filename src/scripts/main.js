'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const fieldCell = [...document.querySelectorAll('.field-cell')];
const scoreElement = document.querySelector('.game-score');
let prevState = game.getState().map((row) => [...row]);
const bestScoreElement = document.querySelector('.game-best');
let bestScore = 0;

bestScoreElement.textContent = bestScore;

function render() {
  const state = game.getState();
  const winMessage = document.querySelector('.message.message-win');
  const loseMessage = document.querySelector('.message.message-lose');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  const currentScore = game.getScore();

  scoreElement.textContent = currentScore;

  if (currentScore > bestScore) {
    bestScore = currentScore;
    bestScoreElement.textContent = bestScore;
  }

  fieldCell.forEach((cell) => cell.classList.remove('field-cell--pop'));

  let index = 0;

  state.forEach((row, r) => {
    row.forEach((value, c) => {
      const cell = fieldCell[index];
      const prev = prevState[r][c];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (document.body.classList.contains('body__nightmode')) {
        cell.classList.add('field-cell__nightmode');
      }

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);

        if (document.body.classList.contains('body__nightmode')) {
          cell.classList.add(`field-cell--${value}__nightmode`);
        }

        if (value !== prev) {
          cell.classList.remove('field-cell--pop');
          void cell.offsetWidth;
          cell.classList.add('field-cell--pop');

          setTimeout(() => {
            cell.classList.remove('field-cell--pop');
          }, 120);
        }
      }

      index++;
    });
  });

  prevState = state.map((row) => [...row]);
}

function gameOn() {
  const button = document.querySelector('.button');
  const buttonStart = document.querySelector('.button.start');
  const startMessage = document.querySelector('.message.message-start');

  buttonStart.addEventListener('click', () => {
    if (game.getStatus() !== 'idle') {
      return;
    }
    game.start();
    startMessage.classList.add('hidden');
    render();

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  });
}

function setupArrrowButtons() {
  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    e.preventDefault();

    let moved = false;

    if (e.key === 'ArrowUp') {
      moved = game.moveUp();

      if (!moved) {
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      moved = game.moveDown();

      if (!moved) {
        return;
      }
    }

    if (e.key === 'ArrowLeft') {
      moved = game.moveLeft();

      if (!moved) {
        return;
      }
    }

    if (e.key === 'ArrowRight') {
      moved = game.moveRight();

      if (!moved) {
        return;
      }
    }

    render();
  });
}

function restartGame() {
  const button = document.querySelector('.button');

  button.addEventListener('click', () => {
    if (!button.classList.contains('restart')) {
      return;
    }

    game.restart();
    prevState = game.getState().map((row) => [...row]);
    render();
  });
}

function modSwitcher() {
  const button = document.querySelector('.theme-switcher');
  const body = document.body;
  const field = document.querySelector('.game-field');
  const cells = document.querySelectorAll('.field-cell');
  const info = document.querySelector('.info');
  const messages = document.querySelectorAll('.message');

  button.addEventListener('click', () => {
    if (body.classList.contains('body__nightmode')) {
      body.classList.remove('body__nightmode');
      field.classList.remove('game-field__nightmode');
      info.classList.remove('info__nightmode');

      messages.forEach((message) => {
        message.classList.remove('message__nightmode');
      });

      cells.forEach((cell) => {
        cell.classList.remove('field-cell__nightmode');

        cell.classList.forEach((cls) => {
          if (/field-cell--\d+__nightmode/.test(cls)) {
            cell.classList.remove(cls);
          }
        });
      });
      button.textContent = '☀️';
      button.classList.remove('theme-switcher__nightmode');
      button.classList.add('theme-switcher__lightmode');
    } else {
      body.classList.add('body__nightmode');
      button.textContent = '🌙';
      button.classList.remove('theme-switcher__lightmode');
      button.classList.add('theme-switcher__nightmode');
      field.classList.add('game-field__nightmode');
      info.classList.add('info__nightmode');

      messages.forEach((message) => {
        message.classList.add('message__nightmode');
      });

      cells.forEach((cell) => {
        cell.classList.add('field-cell__nightmode');
      });
    }

    render();
  });
}

function setupSwipeControls() {
  const field = document.querySelector('.game-field');
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const touch = e.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
  });

  field.addEventListener('touchmove', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }
    e.preventDefault();
  });

  document.addEventListener('touchend', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 30) {
        const moved = game.moveRight();

        if (!moved) {
          return;
        }
      } else if (diffX < -30) {
        const moved = game.moveLeft();

        if (!moved) {
          return;
        }
      }
    } else {
      if (diffY > 30) {
        const moved = game.moveDown();

        if (!moved) {
          return;
        }
      } else if (diffY < -30) {
        const moved = game.moveUp();

        if (!moved) {
          return;
        }
      }
    }

    render();
  });
}

render();
gameOn();
setupArrrowButtons();
restartGame();
modSwitcher();
setupSwipeControls();
