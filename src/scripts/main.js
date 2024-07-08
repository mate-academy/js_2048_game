import Game from './modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const scoreElement = document.getElementById('score');
  const startRestartButton = document.getElementById('start-restart-btn');
  const statusMessage = document.getElementById('status-message');

  const render = () => {
    const board = game.getState();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = document.getElementById(`cell-${r}-${c}`);
        const value = board[r][c];

        cell.textContent = value === 0 ? '' : value;
        cell.className = `game-cell game-cell--${value}`;
      }
    }
    scoreElement.textContent = game.getScore();

    const gameStatus = game.getStatus();

    if (gameStatus === 'won') {
      statusMessage.textContent = 'You won!';
      statusMessage.classList.remove('hidden');
    } else if (gameStatus === 'lost') {
      statusMessage.textContent = 'Game Over!';
      statusMessage.classList.remove('hidden');
    } else {
      statusMessage.classList.add('hidden');
    }
  };

  startRestartButton.addEventListener('click', () => {
    game.restart();
    startRestartButton.textContent = 'Restart';
    render();
  });

  document.addEventListener('keydown', (evt) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    switch (evt.key) {
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
    }
    render();
  });

  game.start();
  render();
});
