'use strict';

const {
  messageWin,
  messageLose,
  fieldRow,
  gameScore,
  startGame,
  keyPressed,
} = require('./handlers');

const button = document.querySelector('.button');
let pressStart = false;

const gridOfNumber = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];

button.addEventListener('click', (event) => {
  startGame(event, gridOfNumber, fieldRow, messageLose, messageWin);
  pressStart = true;
});

document.addEventListener('keyup', (event) =>
  keyPressed(
    event,
    gridOfNumber,
    fieldRow,
    pressStart,
    gameScore,
    messageLose,
    messageWin));
