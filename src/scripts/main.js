'use strict';

import Game from '../modules/Game.class';

const game = new Game();

function createNewState() {
  const workingState = [];
  const newState = [];

  const firstNum = Math.floor(Math.random() * 16);
  let secondNum = Math.floor(Math.random() * 16);

  while (secondNum === firstNum) {
    secondNum = Math.floor(Math.random() * 16);
  }

  for (let i = 0; i < 16; i++) {
    if (i === firstNum || i === secondNum) {
      workingState.push(Math.random() > 0.9 ? 4 : 2);
    } else {
      workingState.push(0);
    }
  }

  for (let i = 0; i < 16; i += 4) {
    newState.push(workingState.slice(0 + i, 4 + i));
  }

  return newState;
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  game.start(createNewState());
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
});
