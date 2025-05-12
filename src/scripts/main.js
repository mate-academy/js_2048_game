'use strict';

const Game = require('../modules/Game.class');
const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const game = new Game(initialState);

const button = document.querySelector('button');

button.addEventListener('click', buttonFunction);

function buttonFunction() {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
  }
}

document.addEventListener('keydown', keyDown);

function keyDown(e) {
  const key = e.key;

  switch (key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
  }
}
