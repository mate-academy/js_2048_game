import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.controls button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
  } else if (button.classList.contains('restart')) {
    game.restart();
    game.updateScore();
  }
});

function handleMove(moveFn) {
  const oldBoard = game.getState().map((row) => [...row]);

  moveFn();

  const changed = oldBoard.some((row, r) =>
    // eslint-disable-next-line prettier/prettier
    row.some((val, c) => val !== game.getState()[r][c]));

  if (changed && !game.checkWin()) {
    game.addNewCell();
  }

  game.checkLose();
}

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }

  switch (e.key) {
    case 'ArrowLeft':
      handleMove(() => game.move('left'));
      break;
    case 'ArrowRight':
      handleMove(() => game.move('right'));
      break;
    case 'ArrowUp':
      handleMove(() => game.move('up'));
      break;
    case 'ArrowDown':
      handleMove(() => game.move('down'));
      break;
  }
});
