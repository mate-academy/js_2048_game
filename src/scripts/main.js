import { Game } from '../modules/Game.class.js';

const game = new Game();

const buttonStart = document.querySelector('.button.start');
const buttonRestart = document.createElement('button');

buttonRestart.classList.add('hidden');
buttonStart.parentNode.append(buttonRestart);

buttonRestart.classList.add('button', 'restart');
buttonRestart.textContent = 'Restart';

buttonStart.addEventListener('click', () => {
  game.start(buttonStart, buttonRestart);
});

buttonRestart.addEventListener('click', () => {
  game.restart(buttonRestart, buttonStart);
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
    default:
      break;
  }
});
