'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const mainButton = document.querySelector('button');
const gameField = document.querySelector('.game-field');

mainButton.addEventListener('click', (e) => game.handleMainButtonClicks(e));

// --- Handle pressing arrow keys ---
document.addEventListener('keydown', (e) => {
  const isArrowKey = [
    'ArrowDown',
    'ArrowUp',
    'ArrowLeft',
    'ArrowRight',
  ].includes(e.key);

  if (!game.canMakeMove() || !isArrowKey) {
    return;
  }

  const methodName = e.key.replace('Arrow', 'move');

  game[methodName]();
});

// --- Handle swipes ---
let [startX, startY] = [0, 0];

gameField.addEventListener(
  'touchstart',
  (e) => {
    if (!game.canMakeMove()) {
      return;
    }

    const { clientX, clientY } = e.touches[0];

    startX = clientX;
    startY = clientY;
  },
  { passive: true },
);

gameField.addEventListener(
  'touchend',
  (e) => {
    if (!game.canMakeMove()) {
      return;
    }

    const { clientX: endX, clientY: endY } = e.changedTouches[0];
    const diffX = endX - startX;
    const diffY = endY - startY;

    let direction;

    // Determine the dominant swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      direction = diffX > 0 ? 'Right' : 'Left';
    } else {
      direction = diffY > 0 ? 'Down' : 'Up';
    }

    const methodName = `move${direction}`;

    game[methodName]();
  },
  { passive: true },
);
