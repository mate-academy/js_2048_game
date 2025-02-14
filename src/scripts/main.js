import Game from '../modules/Game.class.js';

const game2048 = new Game();
const button = document.querySelector('.button.start');

function updateButtonText() {
  button.textContent = game2048.getStatus() === 'idle' ? 'Start' : 'Restart';
}

button.addEventListener('click', () => {
  if (game2048.getStatus() === 'idle') {
    game2048.start();
  } else {
    game2048.restart();
  }
  updateButtonText();
});

updateButtonText();

document.addEventListener('keydown', (e) => {
  if (game2048.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game2048.moveLeft();
      break;
    case 'ArrowRight':
      game2048.moveRight();
      break;
    case 'ArrowUp':
      game2048.moveUp();
      break;
    case 'ArrowDown':
      game2048.moveDown();
      break;
  }
});
