'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');
const undoButton = document.querySelector('.undo-button');
const allDomCells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateMessage() {
  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'idle':
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      break;
    case 'playing':
      startMessage.classList.add('hidden');
      break;
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }
}

function updateScore(score) {
  scoreElement.textContent = score;
}

function renderField(elements, animateNewTiles = false) {
  const cellsValue = game.getState().flat();

  cellsValue.forEach((cell, index) => {
    const previousCell = elements[index].textContent;
    const isNewTile = animateNewTiles && cell !== 0 && previousCell === '';

    elements[index].textContent = cell === 0 ? '' : cell;
    // Update the CSS classes for each cell based on its value
    elements[index].className = `field-cell field-cell--${cell}`;

    if (isNewTile) {
      elements[index].classList.add('tile-appear');
    }
  });
}

undoButton.addEventListener('click', () => {
  game.undo();
  updateUI(false);
});

function updateUndoButtonState() {
  if (game.canUndo()) {
    undoButton.removeAttribute('disabled');
  } else {
    undoButton.setAttribute('disabled', true);
  }
}

startButton.addEventListener('click', () => {
  const isStartingGame = !startButton.classList.contains('restart');

  if (startButton.classList.contains('restart')) {
    game.restart();
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  } else {
    game.start();
  }

  updateUI(isStartingGame);

  if (game.getStatus() === 'playing') {
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = ev.key;

  switch (key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  updateUI(true);
});

function updateUI(animateNewTiles = false) {
  renderField(allDomCells, animateNewTiles);
  updateScore(game.getScore());
  updateUndoButtonState();
  updateMessage();
}
