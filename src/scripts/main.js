'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameField = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const button = document.querySelector('button');
const rows = gameField.querySelectorAll('tr');
const cells = document.querySelectorAll('td');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

document.addEventListener('keydown', (ev) => {
    ev.preventDefault();
  
    switch (ev.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
})