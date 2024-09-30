'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button');
const animationButton = document.querySelector('h1');


startButton.onclick = () => {
  if (startButton.textContent === 'Start') {
    game.start();
  } else {
    game.restart();
  }
};

animationButton.onclick = () => {
  game.animation();
};

document/addEventListener('keydown', (event) => {
  switch(event.key){
    case "ArrowUp":
      console.log('Up');
      game.moveUp();
    break;
    case "ArrowDown":
      console.log('Down');
      game.moveDown();
    break;
    case "ArrowRight":
      console.log('Right');
      game.moveRight();
    break;
    case "ArrowLeft":
      console.log('Left');
      game.moveLeft();
    break;
  }
});
