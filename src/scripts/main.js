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
  'idle': () => {
    game.status = 'playing';
    actions.playing();
    messages[0].className = 'message message-lose hidden';
    messages[1].className = 'message message-win hidden';
    messages[2].className = 'message message-start hidden';
    messages[3].className = 'message message-restart'
  }, 
  'playing': () => {
    for (let line = 0; line < 4; line++) {
      for (let column = 0; column < 4; column++) {
        cells[line * 4 + column].textContent = (game.getState()[line][column]) || '';
      }
    }

    score.textContent = game.getScore();
  },
  'win': () => {
    actions.playing();
    messages[0].className = 'message message-lose hidden';
    messages[1].className = 'message message-win';
    messages[2].className = 'message message-start hidden';
    messages[3].className = 'message message-restart hidden'
  }, 
  'lose': () => {
    messages[0].className = 'message message-lose';
    messages[1].className = 'message message-win hidden';
    messages[2].className = 'message message-start hidden';
    messages[3].className = 'message message-restart hidden';
  }
};
const bindState = (status) => {
  (actions[status] || (() => console.log('Invalido inválida.')))();
}
const setStyles = () => {
  for (const cell of cells) {
    cell.className = (bgColorByNumber[cell.textContent]) 
      ? 'field-cell ' + bgColorByNumber[cell.textContent]
      : 'field-cell';
  }
}

// Write your code here
document.addEventListener('keydown', event =>  {
  if (game.getStatus() === 'playing') {
    if (event.key === 'ArrowDown') {
      game.moveDown();
    } else if (event.key === 'ArrowUp') {
      game.moveUp();
    } else if (event.key === 'ArrowRight') {
      game.moveRight();
    } else if (event.key === 'ArrowLeft') {
      game.moveLeft();
    }
    bindState(game.getStatus());
    setStyles();
  }
});

startAndRestartButton.addEventListener('click', event => {
  game.restart();
  bindState(game.getStatus());
  startAndRestartButton.className = 'button restart';
});