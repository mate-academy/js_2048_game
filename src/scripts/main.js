'use strict';

import Game from '../modules/Game.class';

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const game = new Game(initialState);

const btnStartElement = document.querySelector('.button.start');
const messageElementStart = document.querySelector('.message.message-start');

btnStartElement.addEventListener('click', () => {
  const statusButton = game.getStatus();

  if (statusButton === 'idle') {
    game.start();
    game.renderBoard(game.board);
    messageElementStart.classList.add('hidden');

    btnStartElement.classList.remove('start');
    btnStartElement.classList.add('restart');
    btnStartElement.textContent = 'Restart';
  } else {
    game.restart();
    game.renderBoard(game.board);

    btnStartElement.classList.remove('restart');
    btnStartElement.classList.add('start');
    btnStartElement.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  document.activeElement.blur();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      game.renderBoard(game.board);
      break;
    case 'ArrowDown':
      game.moveDown();
      game.renderBoard(game.board);
      break;
    case 'ArrowLeft':
      game.moveLeft();
      game.renderBoard(game.board);
      break;
    case 'ArrowRight':
      game.moveRight();
      game.renderBoard(game.board);
      break;
  }
});
