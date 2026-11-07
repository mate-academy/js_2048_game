'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const arrowMoves = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function render() {
  const board = game.getState();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = board[row][column];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  scoreElement.textContent = game.getScore();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function switchToRestart() {
  if (!button.classList.contains('start')) {
    return;
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
}

function handleMove(move) {
  const scoreBefore = game.getScore();
  const stateBefore = JSON.stringify(game.getState());

  move();

  const didMove =
    scoreBefore !== game.getScore() ||
    stateBefore !== JSON.stringify(game.getState());

  if (didMove) {
    switchToRestart();
  }

  render();
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    messageStart.classList.add('hidden');
    render();

    return;
  }

  game.restart();
  game.start();
  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const move = arrowMoves[keyEvent.key];

  if (!move) {
    return;
  }

  keyEvent.preventDefault();
  handleMove(move);
});
