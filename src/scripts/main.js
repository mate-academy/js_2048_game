/* eslint-disable */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const startButton = document.getElementById('start-button');

// startButton.addEventListener('click', game.start);
// Write your code here

window.addEventListener('keyup', handleKey);


const rows = document.getElementsByClassName('field-row');
const rows2 = document.getElementsByClassName('field-cell');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
],rows);

// console.log(rows2);

game.start('kuku');

function handleKey(event) {
  // console.log(event.code);
  if(event.code === 'ArrowUp') {
    game.moveUp();
  }
}
// let count  = 0;
// for (let rowIndex = 0; rowIndex <= rows.length; rowIndex++) {
//   console.log(rows[rowIndex])
//   for (let colIndex = 0; colIndex <= 3; colIndex++) {
//     count++;
//     console.log(cells[colIndex]);
//     console.log(rows[rowIndex].cells[colIndex].innerText = count);
//   }
// }
// console.log(rows[3].cells[2].innerText='2', 'rows');
