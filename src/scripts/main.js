'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Get all DOM Elements in variables.
const cells = document.getElementsByClassName('field-cell');
const score = document.getElementsByClassName('game-score')[0];
const startAndRestartButton = document.getElementsByClassName('button')[0];
const messages = document.getElementsByClassName('message');

// Init inner objects and variables that are use in entire file
const bgColorByNumber = {
  2: 'field-cell--2',
  4: 'field-cell--4',
  8: 'field-cell--8',
  16: 'field-cell--16',
  32: 'field-cell--32',
  64: 'field-cell--64',
  128: 'field-cell--128',
  256: 'field-cell--256',
  512: 'field-cell--512',
  1024: 'field-cell--1024',
  2048: 'field-cell--2048',
};

const actions = {
  idle: () => {
    game.setStatus('playing');
    actions.playing();
    messages[0].classList.add('hidden');
    messages[1].classList.add('hidden');
    messages[2].classList.add('hidden');
    messages[3].classList.remove('hidden');
  },
  playing: () => {
    for (let line = 0; line < 4; line++) {
      for (let column = 0; column < 4; column++) {
        cells[line * 4 + column].textContent =
          game.getState()[line][column] || '';
      }
    }
    setStyles();
    score.textContent = game.getScore();
  },
  win: () => {
    actions.playing();
    messages[0].classList.add('hidden');
    messages[1].classList.remove('hidden');
    messages[2].classList.add('hidden');
    messages[3].classList.add('hidden');
  },
  lose: () => {
    actions.playing();
    messages[0].classList.remove('hidden');
    messages[1].classList.add('hidden');
    messages[2].classList.add('hidden');
    messages[3].classList.add('hidden');
  },
};

function bindState(arg) {
  actions[arg]();
}

const setStyles = () => {
  for (const cell of cells) {
    cell.className = bgColorByNumber[cell.textContent]
      ? 'field-cell ' + bgColorByNumber[cell.textContent]
      : 'field-cell';
  }
};

// Event Listeners
document.addEventListener('keydown', (eventKey) => {
  if (game.getStatus() === 'playing') {
    if (eventKey.key === 'ArrowDown') {
      game.moveDown();
      bindState(game.getStatus());
    } else if (eventKey.key === 'ArrowUp') {
      game.moveUp();
      bindState(game.getStatus());
    } else if (eventKey.key === 'ArrowRight') {
      game.moveRight();
      bindState(game.getStatus());
    } else if (eventKey.key === 'ArrowLeft') {
      game.moveLeft();
      bindState(game.getStatus());
    }
  }
});

startAndRestartButton.addEventListener('click', (clickStartRestartEvent) => {
  game.start();
  bindState(game.getStatus());
  setStyles();
  startAndRestartButton.classList.add('restart');
});
