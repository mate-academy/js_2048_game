'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

const allElements = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message.message-lose');
const messageWin = document.querySelector('.message.message-win');
const messageStart = document.querySelector('.message.message-start');
const button = document.querySelector('.button');

render();

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (eve) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let didMove = false;

  if (eve.key === 'ArrowLeft') {
    game.moveLeft();
    didMove = true;
  }

  if (eve.key === 'ArrowRight') {
    game.moveRight();
    didMove = true;
  }

  if (eve.key === 'ArrowUp') {
    game.moveUp();
    didMove = true;
  }

  if (eve.key === 'ArrowDown') {
    game.moveDown();
    didMove = true;
  }

  if (didMove) {
    render();
    eve.preventDefault();
  }
});

// Write your code here
function render() {
  const state = game.getState();
  const scoreValue = game.getScore();
  const gameStatus = game.getStatus();

  for (let i = 0; i < allElements.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    allElements[i].className = 'field-cell';

    if (value > 0) {
      allElements[i].textContent = value;
      allElements[i].classList.add(`field-cell--${value}`);
    } else {
      allElements[i].textContent = '';
    }
  }

  score.textContent = scoreValue;

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  button.className = 'button';

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
  }
}
