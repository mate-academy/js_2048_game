'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message.message-start');
const gameScore = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      gameField.rows[i].cells[j].className = 'field-cell';

      if (game.getState()[i][j] === 0) {
        gameField.rows[i].cells[j].textContent = '';
      } else {
        gameField.rows[i].cells[j].textContent = game.getState()[i][j];

        gameField.rows[i].cells[j].classList.add(
          `field-cell--${game.getState()[i][j]}`,
        );
      }
    }
  }
  gameScore.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else {
    winMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }
}

renderBoard();

let clickCounter = 0;

startButton.addEventListener('click', (clickEvent) => {
  if (clickCounter === 0) {
    game.start();
    clickCounter++;
    startMessage.classList.add('hidden');
  } else if (clickCounter > 0) {
    game.restart();
    game.start();
  }
  renderBoard();
});

document.addEventListener('keydown', (key) => {
  let moved = false;

  if (key.key === 'ArrowLeft') {
    moved = game.moveLeft();
    renderBoard();
  } else if (key.key === 'ArrowRight') {
    moved = game.moveRight();
    renderBoard();
  } else if (key.key === 'ArrowUp') {
    moved = game.moveUp();
    renderBoard();
  } else if (key.key === 'ArrowDown') {
    moved = game.moveDown();
    renderBoard();
  }

  if (moved === true) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
});
