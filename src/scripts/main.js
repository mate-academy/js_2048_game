'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

function keyListener(e) {
  switch (e.key) {
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
  }

  update(game);
}

function update() {
  const gameField = document.querySelector('.game-field');
  const gameCells = Array.from(gameField.querySelectorAll('.field-row')).map(
    (row) => Array.from(row.children),
  );

  game.getState().forEach((row, i) => {
    row.forEach((el, j) => {
      gameCells[i][j].innerText = el || '';
    });
  });
}

game.start();

update();

document.addEventListener('keydown', keyListener);
