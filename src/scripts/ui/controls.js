import { game, restartGame } from '../core/gameManager.js';
import { renderBoard } from './render.js';

export function handleKeydown(e) {
  const actions = {
    ArrowLeft: 'moveLeft',
    a: 'moveLeft',
    ArrowRight: 'moveRight',
    d: 'moveRight',
    ArrowUp: 'moveUp',
    w: 'moveUp',
    ArrowDown: 'moveDown',
    s: 'moveDown',
    n: 'restart',
    r: 'restart',
  };

  const action = actions[e.key];

  if (!action) {
    return;
  }

  if (action === 'restart') {
    restartGame();

    return;
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  game[action]();
  renderBoard(game);
}

let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

export function handleTouchStart(e) {
  const touch = e.touches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

export function handleTouchEnd(e) {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (
    Math.max(absX, absY) < SWIPE_THRESHOLD ||
    game.getStatus() !== 'playing'
  ) {
    return;
  }

  if (absX > absY) {
    if (deltaX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (deltaY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  renderBoard(game);
}
