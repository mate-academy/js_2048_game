'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const messageContainer = document.querySelector('.message-container');
const messages = messageContainer.querySelectorAll('.message');

const showMessage = (type) => {
  messages.forEach(msg => msg.classList.add('hidden'));

  const msgToShow = messageContainer.querySelector(`.message-${type}`);

  if (msgToShow) {
    msgToShow.classList.remove('hidden');
  }
}

const buttonStart = document.querySelector('.button.start');

const score = document.querySelector('.game-score');
const updateScore = () => (score.textContent = `${game.getScore()}`);

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyName = e.key;

  if (keyName === 'ArrowLeft') {
    game.moveLeft();
    updateScore();
  }

  if (keyName === 'ArrowRight') {
    game.moveRight();
    updateScore();
  }

  if (keyName === 'ArrowUp') {
    game.moveUp();
    updateScore();
  }

  if (keyName === 'ArrowDown') {
    game.moveDown();
    updateScore();
  }

  if (game.getStatus() === 'lose') {
    showMessage('lose');
  }

  if (game.getStatus() === 'win') {
    showMessage('win');
  }
});


buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    game.start();
    buttonStart.textContent = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');

    showMessage('hidden');
  } else if (buttonStart.classList.contains('restart')) {
    game.restart();
    buttonStart.textContent = 'Start';
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    updateScore();

    showMessage('start');
  }
});
