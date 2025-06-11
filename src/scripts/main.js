import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('.game-score');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const restartBtn = document.querySelector('.restart-btn');
  const startMsg = document.querySelector('.message-start');

  const game = new Game(null, render);

  function render() {
    const board = game.getState();
    const score = game.getScore();
    const gameStatus = game.getStatus();

    gridContainer.innerHTML = '';

    board.forEach((row, i) => {
      row.forEach((value, j) => {
        const tile = document.createElement('div');

        tile.classList.add('field-cell');

        if (value !== 0) {
          tile.classList.add(`field-cell--${value}`);
          tile.textContent = value;
        } else {
          tile.classList.add('field-cell--empty');
        }

        tile.dataset.row = i;
        tile.dataset.col = j;
        gridContainer.appendChild(tile);
      });
    });

    scoreDisplay.textContent = score;
    messageWin.classList.toggle('hidden', gameStatus !== 'win');
    messageLose.classList.toggle('hidden', gameStatus !== 'lose');

    startMsg.classList.add('hidden');

    if (gameStatus === 'win' || gameStatus === 'lose') {
      restartBtn.textContent = 'Restart';
      restartBtn.classList.remove('start');
      restartBtn.classList.add('restart');
    }
  }

  window.addEventListener('keydown', (e) => {
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
    }
  });

  restartBtn.addEventListener('click', () => {
    game.restart();
    startMsg.classList.add('hidden');

    // Якщо кнопка ще має текст "Start", змінити на "Restart"
    if (restartBtn.textContent === 'Start') {
      restartBtn.textContent = 'Restart';
      restartBtn.classList.remove('start');
      restartBtn.classList.add('restart');
    }

    render();
  });
});
