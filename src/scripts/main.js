'use strict';

const Game = require('../modules/Game.class');
const { gameStatus } = require('../utils/const');

const game = new Game();
const tileContainer = document.querySelector('.tile-container');
const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const [lose, win, start] = [
  ...document.querySelector('.message-container').children,
];

const updateFields = () => {
  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    return;
  }

  const tiles = game.getTiles();
  // const board = game.getState();

  if (!tiles.length) {
    [...tileContainer.childNodes].forEach((node) => node.remove());

    return;
  }
  // prev
  // current

  [...tiles]
    .filter((tile) => tile.type === 'new')
    .forEach((anim) => {
      const { prev, current, value, type } = anim;
      let tile = document.querySelector(
        `.tile[data-row="${prev.row}"][data-col="${prev.col}"]`,
      );

      if (!tile) {
        tile = document.createElement('div');
        tile.classList.add('field-cell', 'tile');
        tile.classList.add(`field-cell--${value}`);
        tile.setAttribute('data-row', current.row);
        tile.setAttribute('data-col', current.col);
        tile.innerText = value;
        tileContainer.appendChild(tile);
      }

      const x = current.col * 85 + 10;
      const y = current.row * 85 + 10;

      // requestAnimationFrame(() => {})
      // tile.style.transform = `translate(${x}px, ${y}px)`;

      tile.style.top = `${y}px`;
      tile.style.left = `${x}px`;

      if (type === 'move') {
        tile.classList.add('move');
      } else if (type === 'merge') {
        tile.classList.add('merge');
        tile.innerText = value;
      } else if (type === 'new') {
        tile.classList.add('new');
      }

      tile.addEventListener('animationend', (e) => {
        tile.classList.remove('move');
        tile.classList.remove('merge');
        tile.classList.remove('new');
        tile.setAttribute('data-row', current.row);
        tile.setAttribute('data-col', current.col);
      });
    });
};

// Допрацювати
const checkStatus = () => {
  const currentStatus = game.getStatus();

  gameScore.innerText = game.getScore();

  if (currentStatus === gameStatus.win) {
    win.classList.remove('hidden');
  } else if (currentStatus === gameStatus.lose) {
    lose.classList.remove('hidden');
  }
};

const setControl = (e) => {
  if (e.key === 'ArrowDown') {
    game.moveDown();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    updateFields();
    checkStatus();
  }
};

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    start.classList.add('hidden');
    win.classList.add('hidden');
    lose.classList.add('hidden');

    game.start();
    updateFields();
    gameScore.innerText = game.getScore();
    document.addEventListener('keydown', setControl);
  } else if (button.classList.contains('restart')) {
    button.classList.add('start');
    button.classList.remove('restart');
    button.innerText = 'Start';
    start.classList.remove('hidden');

    game.restart();
    updateFields();
    gameScore.innerText = game.getScore();
    document.removeEventListener('keydown', setControl);
  }
});
