import { onTouchStart, onTouchEnd } from './swipeHandler';
import { gameField, updateField, isChanged } from './updateField';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');

const winMessage = document.querySelector('.message.message-win');
const loseMessage = document.querySelector('.message.message-lose');
const startMessage = document.querySelector('.message.message-start');

function touchMovesListener(e) {
  const result = onTouchEnd(e);

  if (result) {
    movesListener(result);
  }
}

function movesListener(e) {
  const prevState = game.getState();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    default:
      return;
  }

  if (
    startButton.classList.contains('start') &&
    isChanged(prevState, game.getState())
  ) {
    startButton.disabled = false;
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }

  gameScore.textContent = game.getScore();
  updateField(game.getState(), e.key.replace('Arrow', '').toLowerCase());

  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    return;
  }

  document.removeEventListener('keydown', movesListener);

  gameField.removeEventListener('touchstart', onTouchStart);
  gameField.removeEventListener('touchend', touchMovesListener);

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');

    return;
  }

  loseMessage.classList.remove('hidden');
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    updateField(game.getState());

    startMessage.classList.add('hidden');

    startButton.disabled = true;
    document.addEventListener('keydown', movesListener);

    gameField.addEventListener('touchstart', onTouchStart, false);
    gameField.addEventListener('touchend', touchMovesListener, false);

    return;
  }

  game.restart();

  game.start();
  updateField(game.getState());

  gameScore.textContent = '0';

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  if (!loseMessage.classList.contains('hidden')) {
    loseMessage.classList.add('hidden');
  }

  gameField.removeEventListener('touchstart', onTouchStart);
  gameField.removeEventListener('touchend', touchMovesListener);

  gameField.addEventListener('touchstart', onTouchStart, false);
  gameField.addEventListener('touchend', touchMovesListener, false);

  document.removeEventListener('keydown', movesListener);
  document.addEventListener('keydown', movesListener);
});
