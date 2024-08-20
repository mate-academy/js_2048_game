('use strict');

const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

const Game = require('../modules/Game.class');
const game = new Game();

function updateField() {
  const field = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');
    cells.forEach((cell, cellIndex) => {
      const value = field[rowIndex][cellIndex];
      cell.setAttribute('class', 'field-cell');
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });

  gameScore.textContent = game.getScore();

  //TODO : need to update game Message
}

function handleStart() {
  setupInput();

  if (game.gameStatus === Game.gameStatus.idle) {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.replace('start', 'restart');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.replace('restart', 'start');
  }

  updateField();
}

startButton.addEventListener('click', handleStart);

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  let moved = false;

  if (game.getStatus() !== Game.gameStatus.playing) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      moved = await game.moveUp();
      break;
    case 'ArrowDown':
      moved = await game.moveDown();
      break;
    case 'ArrowLeft':
      moved = await game.moveLeft();
      break;
    case 'ArrowRight':
      moved = await game.moveRight();
      break;
  }

  // if (moved) {
  //   game.cells.forEach((cell) => cell.mergeTiles());
  //   game.addRandomTile();
  //   game.updateScore();
  // }
  //
  // if (game.getStatus() === 'lose') {
  //   messageLose.classList.remove('hidden');
  // } else if (game.getStatus() === 'win') {
  //   messageWin.classList.remove('hidden');
  // }

  setupInput();
}
