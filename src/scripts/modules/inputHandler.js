import { moveUp, moveDown, moveLeft, moveRight } from './movement.js';
import * as GameControlModule from './gameControl.js';
import { GameState } from './gameState.js';

export function listenForKeyboardEvents() {
  document.addEventListener('keydown', function(e) {
    if (
      !GameState.isGameStarted()
      || GameState.isGameOver()
    ) {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
    }

    if (moved) {
      GameControlModule.updateAfterMove();
    }
  });
}
