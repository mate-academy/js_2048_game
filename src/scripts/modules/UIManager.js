import * as ScoreManager from './scoreManager.js';
import * as GameControlModule from './gameControl.js';
import * as GameStateModule from './gameState.js';
import * as BoardModule from './board.js';

export function hideMessages() {
  document
    .querySelector('.message-lose')
    .classList.add('hidden');

  document
    .querySelector('.message-win')
    .classList.add('hidden');

  document
    .querySelector('.message-start')
    .classList.add('hidden');
}

export function updateStartButton(startButton) {
  startButton.textContent
    = GameStateModule.isGameStarted() ? 'Restart' : 'Start';

  startButton.addEventListener('click', function() {
    BoardModule.resetBoard();
    ScoreManager.resetScore();

    GameControlModule.populateRandomCell();
    GameControlModule.populateRandomCell();

    BoardModule.updateBoardDOM();
    ScoreManager.updateScoreDisplay();

    hideMessages();
    GameStateModule.setGameStarted(true);

    startButton.textContent = 'Restart';
  });
}
