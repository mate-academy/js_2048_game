import { GameManager } from './components/GameManager';

document.addEventListener('DOMContentLoaded', () => {
  let game = new GameManager(4, 2048);

  document.addEventListener('click', (e) => {
    if (e.target.closest('.game-header__button, .game-body__try-again-btn')) {
      game.reload();
      game = new GameManager(4, 2048);
    }
  });
});
