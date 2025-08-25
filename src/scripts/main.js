'use strict';

const Game = require('../modules/Game.class');
const game = new Game('idle');

const startButton = document.querySelector('.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

startButton.addEventListener('click', (e) => StartRestart(e));

document.addEventListener('DOMContentLoaded', () => {
  game.beforeStart();
});

function StartRestart(e) {
  if (e.target.innerHTML === 'Start') {
    startMessage.classList.add('hidden');
    e.target.innerHTML = 'Restart';
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    game.start();
  } else {
    startMessage.classList.remove('hidden');
    e.target.innerHTML = 'Start';
    e.target.classList.remove('restart');
    e.target.classList.add('start');
    game.restart();
    clearErrors();
  }
}

function checkStatus() {
  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function clearErrors() {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

const allowedKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

const control = async (e) => {
  if (
    allowedKeys.includes(e.key) &&
    !startMessage.classList.contains('hidden')
  ) {
    startMessage.classList.add('hidden');
    startButton.innerHTML = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    game.start();

    return;
  }

  if (e.key === 'ArrowRight') {
    game.didMove = false;
    game.moveRight();
    game.combineRow('right');
    game.generate();
    game.didMove = false;
    game.addColors();

    if (game.initialState === 'lose') {
      loseMessage.classList.remove('hidden');

      return;
    }

    checkStatus();
  }

  if (e.key === 'ArrowLeft') {
    game.didMove = false;
    game.moveLeft();
    game.combineRow('left');
    game.generate();
    game.didMove = false;
    game.addColors();

    checkStatus();
  }

  if (e.key === 'ArrowUp') {
    game.didMove = false;
    game.moveUp();
    game.combineColumn('up');
    game.generate();
    game.didMove = false;
    game.addColors();

    checkStatus();
  }

  if (e.key === 'ArrowDown') {
    game.didMove = false;
    game.moveDown();
    game.combineColumn('down');
    game.generate();
    game.didMove = false;
    game.addColors();

    checkStatus();
  }
};

export { control };

document.addEventListener('keydown', control);
