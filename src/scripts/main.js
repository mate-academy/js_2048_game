'use strict';

const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const Game = require('../modules/Game.class');

const game = new Game();

function handleStart() {
  setupInput();

  const buttonText = startButton.textContent;

  if (buttonText === 'Restart') {
    game.restart();
    messageLose.classList.add('hidden');
  } else {
    game.start();
    messageStart.style.display = 'none';
    startButton.textContent = 'Restart';
  }
}

startButton.addEventListener('click', handleStart);

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  let moved = false;

  if (game.getStatus() !== 'playing') {
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

  if (moved) {
    game.cells.forEach((cell) => cell.mergeTiles());
    game.addRandomTile();
    game.updateScore();
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  setupInput();
}
