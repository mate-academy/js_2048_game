import Game from '../modules/Game.class.js';

const game = new Game();
const tileContainer = document.querySelector('#tile-container');
const scoreEl = document.querySelector('.game-score');

function render() {
  const state = game.getState();

  scoreEl.textContent = game.getScore();

  const activeIds = new Set();

  state.forEach((row, r) => {
    row.forEach((tileData, c) => {
      if (tileData) {
        activeIds.add(tileData.id.toString());

        let tileEl = document.getElementById(`tile-${tileData.id}`);

        if (!tileEl) {
          tileEl = document.createElement('div');
          tileEl.id = `tile-${tileData.id}`;
          tileEl.textContent = tileData.value;
          tileEl.className = `field-cell field-cell--${tileData.value} pos-${r}-${c} cell-appear`;
          tileContainer.appendChild(tileEl);
        } else {
          tileEl.className = `field-cell field-cell--${tileData.value} pos-${r}-${c}`;

          if (tileEl.textContent !== tileData.value) {
            tileEl.textContent = tileData.value;
            tileEl.classList.add('cell-merge');

            tileEl.onanimationend = () => {
              tileEl.classList.remove('cell-merge');
            };
          }
        }
      }
    });
  });

  const allElements = tileContainer.querySelectorAll('.field-cell');

  allElements.forEach((el) => {
    const id = el.id.replace('tile-', '');

    if (!activeIds.has(id)) {
      el.remove();
    }
  });

  updateStatusUI();
}

function updateStatusUI() {
  const gameStatus = game.getStatus();

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gameStatus !== 'lose');

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gameStatus !== 'win');

  document
    .querySelector('.message-start')
    .classList.toggle('hidden', gameStatus !== 'idle');

  const isIdle = gameStatus === 'idle';

  document.querySelector('.start').classList.toggle('hidden', !isIdle);
  document.querySelector('.restart').classList.toggle('hidden', isIdle);
}

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  if (moves[e.key] && game.getStatus() === 'playing') {
    game[moves[e.key]]();
    render();
  }
});

document.querySelector('.start').onclick = () => {
  game.start();
  render();
};

document.querySelector('.restart').onclick = () => {
  game.restart();
  render();
};
