/* eslint-disable */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const startButton = document.getElementById('start-button');

// startButton.addEventListener('click', game.start);
// Write your code here

window.addEventListener('keyup', handleKey);


const rows = document.getElementsByClassName('field-row');
// const rows2 = document.getElementsByClassName('field-cell');
const scoreElement = document.getElementsByClassName('game-score');
console.log(scoreElement, 'scoreElement');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
],rows, scoreElement);

// console.log(rows2);

game.start('kuku');

function handleKey(event) {
  // console.log(event.code);
  if(event.code === 'ArrowUp') {
    game.moveUp();
  }
}

