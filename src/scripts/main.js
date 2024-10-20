'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('button');

  const game = new Game();

  btn.addEventListener('click', () => {
    game.start();
  });

  function control(e) {
    if (e.key === 'ArrowLeft') {
      keyLeft();
    } else if (e.key === 'ArrowRight') {
      keyRight();
    } else if (e.key === 'ArrowUp') {
      keyUp();
    } else if (e.key === 'ArrowDown') {
      keyDown();
    }
  }

  document.addEventListener('keydown', control);

  function keyLeft() {
    game.moveLeft();
    game.getScore();
    game.updateDOM();
    game.getStatus();
  }

  function keyRight() {
    game.moveRight();
    game.getScore();
    game.updateDOM();
    game.getStatus();
  }

  function keyUp() {
    game.moveUp();
    game.getScore();
    game.updateDOM();
    game.getStatus();
  }

  function keyDown() {
    game.moveDown();
    game.getScore();
    game.updateDOM();
    game.getStatus();
  }
});
