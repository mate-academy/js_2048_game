import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.button.start');
const restartBtn = document.querySelector('.button.restart');
const startMessage = document.querySelector('.message-start');

startBtn.addEventListener('click', () => {
  game.start();
  startMessage.classList.add('hidden');
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  render();
});

restartBtn.addEventListener('click', () => {
  game.restart();
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        moved = game.moveUp();
        break;

      case 'ArrowDown':
        moved = game.moveDown();
        break;

      case 'ArrowLeft':
        moved = game.moveLeft();
        break;

      case 'ArrowRight':
        moved = game.moveRight();
        break;
    }

    if (moved) {
      render();
    }
    handleMove();
  }
});

const handleMove = () => {
  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }
};

function render() {
  const cells = document.querySelectorAll('.field-cell');

  game
    .getState()
    .flat()
    .forEach((value, index) => {
      cells[index].textContent = value === 0 ? '' : value;
      cells[index].className = `field-cell field-cell--${value || ''}`;
    });

  document.querySelector('.game-score').textContent = game.getScore();
}
