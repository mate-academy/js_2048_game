import { draw, spawn } from './field';
import { started, resetGame, loseGame } from './game';
import { moveDown, moveLeft, moveRight, moveUp } from './movement';

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const movementByKey = {
  'ArrowDown': moveDown,
  'ArrowLeft': moveLeft,
  'ArrowRight': moveRight,
  'ArrowUp': moveUp,
};

button.addEventListener('click', () => {
  for (const message of messages) {
    message.classList.add('hidden');
  }

  resetGame();
  draw();
});

document.addEventListener('keydown', keyboardEvent => {
  if (!started || !keyboardEvent.key.startsWith('Arrow')) {
    return;
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';

  if (movementByKey[keyboardEvent.key]()) {
    spawn();
  }

  draw();
  loseGame();
});
