'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

function render() {
  const gameBoard = game.getState();
  const score = game.getScore();
  // eslint-disable-next-line
  const status = game.getStatus();

  const table = document.querySelector('table');
  const cells = table.getElementsByTagName('td');

  let index = 0;

  for (let row = 0; row < gameBoard.length; row++) {
    for (let col = 0; col < gameBoard[row].length; col++) {
      cells[index].textContent =
        gameBoard[row][col] === 0 ? '' : gameBoard[row][col];
      cells[index].className = 'field-cell';

      if (cells[index].textContent !== '') {
        cells[index].classList.add(`field-cell--${cells[index].textContent}`);
      }
      index++;
    }
  }

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = score;

  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');

  if (status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (status === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  const buttonText = button.textContent;

  if (buttonText === 'Start') {
    game.start();
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
    render();
  } else {
    game.restart();
    render();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  } else {
    switch (e.key) {
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }
  }

  render();
});
