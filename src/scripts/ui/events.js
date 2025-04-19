import { DOM } from './dom.js';
import { restartGame } from '../core/gameManager.js';
import { handleKeydown, handleTouchStart, handleTouchEnd } from './controls.js';

export function initEvents() {
  DOM.newGameButton.addEventListener('click', restartGame);
  DOM.tryAgainButton.addEventListener('click', restartGame);

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
}
