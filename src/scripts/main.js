'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('button');

  const game = new Game();

  btn.addEventListener('click', () => {
    game.start();
  });

  function control(e) {

    switch (e.key) {
      case 'ArrowLeft':
        keyLeft();
      break;
      case 'ArrowRight':
        keyRight();
      break;
      case 'ArrowUp':
        keyUp();
      break;
      case 'ArrowDown':
        keyDown();
      break;
    }
  }

  document.addEventListener('keydown', control);

  function keyLeft() {
    game.moveLeft();
  }

  function keyRight() {
    game.moveRight();
  }

  function keyUp() {
    game.moveUp();
  }

  function keyDown() {
    game.moveDown();
  }
});
