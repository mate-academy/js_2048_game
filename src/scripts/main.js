'use strict';

const ArrowUp = 'ArrowUp';
const ArrowRight = 'ArrowRight';
const ArrowDown = 'ArrowDown';
const ArrowLeft = 'ArrowLeft';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const MassageWin = document.querySelector('.message-win');
const MassageLost = document.querySelector('.message-lose');
const MassageStart = document.querySelector('.message-start');

function MoveBoardByArrows(e) {
  switch (e.key) {
    case ArrowUp:
      game.moveUp();
      break;
    case ArrowRight:
      game.moveRight();
      break;
    case ArrowDown:
      game.moveDown();
      break;
    case ArrowLeft:
      game.moveLeft();
      break;
    default:
      break;
  }

  if (game.getStatus() === 'win') {
    ZeroStyleMassages();
    MassageWin.classList.remove('hidden');
    document.removeEventListener('keydown', MoveBoardByArrows);
  }

  if (didPlayerLose()) {
    ZeroStyleMassages();
    MassageLost.classList.remove('hidden');
    document.removeEventListener('keydown', MoveBoardByArrows);
  }
}

const ZeroStyleMassages = () => {
  MassageWin.className = 'message message-win hidden';
  MassageStart.className = 'message message-start hidden';
  MassageLost.className = 'message message-lose hidden';
};

const didPlayerLose = () => {
  for (const tile of game.board.flat()) {
    if (tile === 0) {
      return false;
    }
  }

  for (let row = 0; row <= 3; row++) {
    for (let tile = 0; tile <= 2; tile++) {
      if (game.board[row][tile] === game.board[row][tile + 1]) {
        return false;
      }
    }
  }

  for (let column = 0; column <= 3; column++) {
    for (let tile = 0; tile <= 2; tile++) {
      if (game.board[tile][column] === game.board[tile + 1][column]) {
        return false;
      }
    }
  }

  return true;
};

const clickHandler = () => {
  switch (game.getStatus()) {
    case 'idle':
      ZeroStyleMassages();
      button.innerHTML = 'restart';
      button.classList.replace('start', 'restart');
      document.addEventListener('keydown', MoveBoardByArrows);
      game.start();
      break;
    case 'playing':
    case 'win':
    case 'lose':
      ZeroStyleMassages();
      game.restart();
      break;
    default:
      break;
  }
};

button.addEventListener('click', clickHandler);
