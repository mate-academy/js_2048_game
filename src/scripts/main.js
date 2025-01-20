'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
let game = new Game();

function updateBoard(arr) {
  const tbody = document.querySelector('tbody');

  tbody.innerHTML = arr
    .map(
      (row) =>
        `<tr class="field-row">${row.map((cell) => `<td class="field-cell field-cell--${cell}">${cell === 0 ? '' : cell}</td>`).join('')}</tr>`,
    )
    .join('');
}

function updateScore(score) {
  const scoreEl = document.getElementById('score');

  scoreEl.textContent = score;
}

const button = document.getElementById('start');

button.addEventListener('click', () => {
  game = new Game();
  game.start();
  updateBoard(game.getState());
  button.textContent = 'Restart';
  document.getElementById('container-win').classList.remove('hidden');
  document.getElementById('container-lose').classList.remove('hidden');

  if (!document.getElementById('container-win').classList.contains('hidden')) {
    document.getElementById('container-win').classList.add('hidden');
  }

  if (!document.getElementById('container-lose').classList.contains('hidden')) {
    document.getElementById('container-lose').classList.add('hidden');
  }
});

document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();

      break;
    case 'ArrowDown':
      game.moveDown();

      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();

      break;
    default:
  }
  updateBoard(game.getState());
  updateScore(game.score);

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    document.getElementById('container-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    document.getElementById('container-lose').classList.remove('hidden');
  }
});
