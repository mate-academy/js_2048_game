'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let previousValues = game.getState().flat();

function render() {
  const values = game.getState().flat();

  values.forEach((value, index) => {
    const cell = cells[index];
    const previousValue = previousValues[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value === 0) {
      return;
    }

    cell.classList.add(`field-cell--${value}`);

    if (value === previousValue) {
      return;
    }

    cell.getAnimations().forEach((animation) => {
      animation.cancel();
    });

    const isMerge = previousValue !== 0 && value === previousValue * 2;

    let animationFrames;

    if (isMerge) {
      animationFrames = [
        { transform: 'scale(1)' },
        { transform: 'scale(1.12)' },
        { transform: 'scale(1)' },
      ];
    } else {
      animationFrames = [
        { transform: 'scale(0.85)', opacity: 0.5 },
        { transform: 'scale(1)', opacity: 1 },
      ];
    }

    cell.animate(animationFrames, {
      duration: isMerge ? 180 : 140,
      easing: 'ease-out',
    });
  });

  previousValues = [...values];

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();
  const isIdle = gameStatus === 'idle';

  startMessage.classList.toggle('hidden', !isIdle);
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  button.textContent = isIdle ? 'Start' : 'Restart';

  button.classList.toggle('start', isIdle);
  button.classList.toggle('restart', !isIdle);
}

button.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  }

  game.start();
  render();
});

const moves = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowUp: 'moveUp',
  ArrowDown: 'moveDown',
  a: 'moveLeft',
  d: 'moveRight',
  w: 'moveUp',
  s: 'moveDown',
};

document.addEventListener('keydown', (keyEvent) => {
  if (keyEvent.ctrlKey || keyEvent.altKey || keyEvent.metaKey) {
    return;
  }

  const move = moves[keyEvent.key] || moves[keyEvent.key.toLowerCase()];

  if (!move) {
    return;
  }

  keyEvent.preventDefault();

  game[move]();
  render();
});

render();
