'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

const paint = () => {
  const state = game.getState();

  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const element = document.querySelector('tbody').children[i].children[j];

      element.className = 'field-cell';
      element.textContent = '';

      if (cell > 0) {
        element.textContent = cell;
        element.classList.add(`field-cell--${cell}`);
      }

      if (cell === 2048) {
        const winMes = document.querySelector('.message-container').children[1];

        winMes.classList.remove('hidden');
      }
    });
  });
};

const checkForWin = () => {
  const statuss = game.getStatus();

  if (statuss === 'win') {
    const winMes = document.querySelector('.message-container').children[1];

    winMes.classList.remove('hidden');
  }
};

const checkForLose = () => {
  const statuss = game.getStatus();

  if (statuss === 'lose') {
    const winMes = document.querySelector('.message-container').children[0];

    winMes.classList.remove('hidden');
  }
};

const setScore = () => {
  const score = game.getScore();
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = score;
};

document.querySelector('.button').addEventListener('click', (e) => {
  const startBut = document.querySelector('.button.start');
  const restartBut = document.querySelector('.button.restart');
  const startMes = document.querySelector('.message-container').children[2];
  const loseMes = document.querySelector('.message-container').children[0];

  if (startBut !== null) {
    game.start();
    startMes.classList.add('hidden');
    startBut.classList.remove('start');
    startBut.textContent = 'Restart';
    startBut.classList.add('restart');
  }

  if (restartBut !== null) {
    game.restart();
    setScore();
    loseMes.classList.add('hidden');
    startMes.classList.remove('hidden');
    restartBut.classList.remove('restart');
    restartBut.textContent = 'Start';
    restartBut.classList.add('start');
  }

  paint();
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') {
    game.moveRight();
    paint();
    setScore();
    checkForWin();
    checkForLose();


  } else if (e.code === 'ArrowLeft') {
    game.moveLeft();
    paint();
    setScore();
    checkForWin();
    checkForLose();

  } else if (e.code === 'ArrowUp') {
    game.moveUp();
    paint();
    setScore();
    checkForWin();
    checkForLose();

  } else if (e.code === 'ArrowDown') {
    game.moveDown();
    paint();
    setScore();
    checkForWin();
    checkForLose();

  }
});