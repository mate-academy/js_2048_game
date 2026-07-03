'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.start');
const fieldCells = [...document.querySelectorAll('.field-cell')];
const mesageStart = document.querySelector('.message-start');
const mesageWin = document.querySelector('.message-win');
const mesageLose = document.querySelector('.message-lose');
const scoreGame = document.querySelector('.game-score');

buttonStart.addEventListener('click', () => {
  if (buttonStart.innerText === 'Start') {
    game.start();
    buttonStart.innerText = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    mesageStart.classList.add('hidden');
  } else if (buttonStart.innerText === 'Restart') {
    game.restart();
    buttonStart.innerText = 'Start';
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    mesageStart.classList.remove('hidden');
  }
  render();
});

function render() {
  const gameCells = game.getState();
  const gameScore = game.getScore();
  const gameStatus = game.getStatus();

  scoreGame.innerText = gameScore;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = gameCells[row][col];

      if (value === 0) {
        fieldCells[row * 4 + col].innerText = '';
        fieldCells[row * 4 + col].className = 'field-cell';
        continue;
      }
      fieldCells[row * 4 + col].innerText = value;
      fieldCells[row * 4 + col].className = 'field-cell';
      fieldCells[row * 4 + col].classList.add(`field-cell--${value}`);
    }
  }

  mesageWin.classList.add('hidden');
  mesageLose.classList.add('hidden');

  if (gameStatus === 'win') {
    mesageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    mesageLose.classList.remove('hidden');
  }
}

window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
  render();
});
