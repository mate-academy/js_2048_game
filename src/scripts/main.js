import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');

const scoreElement = document.querySelector('.game-score');

const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');

const winMessage = document.querySelector('.message-win');

const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';

    if (value) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreElement.textContent = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');

    button.textContent = 'Restart';

    startMessage.classList.add('hidden');

    render();

    return;
  }

  game.restart();

  button.classList.remove('restart');
  button.classList.add('start');

  button.textContent = 'Start';

  startMessage.classList.remove('hidden');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
      return;
  }

  render();
});

render();
