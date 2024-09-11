'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const keys = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

const cells = document.querySelectorAll('.field-cell ');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const messageStart = document.querySelector('.message-start');
const messageVictory = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const clearMessages = () => {
  for (const message of messages) {
    message.classList.add('hidden');
  }
};

function render() {
  const stateCells = game.state.flat(1);

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = stateCells[i] + '';
    cells[i].className = `field-cell field-cell--${stateCells[i]}`;
  }

  score.innerHTML = game.score;
}

button.addEventListener('click', () => {
  if (game.gameStatus === 'idle') {
    game.start();
    button.className = 'button restart';
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    render();

    return;
  }

  game.restart();

  clearMessages();

  button.className = 'button start';
  button.innerHTML = 'Start';

  messageStart.classList.remove('hidden');

  render();
});

document.addEventListener('keydown', ({ key }) => {
  if (game.gameStatus === 'idle') {
    return;
  }

  switch (key) {
    case keys.up:
      game.moveUp();
      break;

    case keys.down:
      game.moveDown();
      break;

    case keys.left:
      game.moveLeft();
      break;

    case keys.right:
      game.moveRight();
      break;

    default:
      break;
  }

  if (game.gameStatus === 'win') {
    messageVictory.classList.remove('hidden');
  }

  if (game.gameStatus === 'lose') {
    clearMessages();
    messageLose.classList.remove('hidden');
  }

  render();
});
