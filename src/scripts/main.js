'use strict';

import Game from '../modules/Game.class.js';

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// const initialState = [
//   [2, 16, 32, 2],
//   [4, 8, 2, 4],
//   [2, 16, 4, 2],
//   [4, 8, 32, 2],
// ];
const initialScore = 0;

const game = new Game(initialState);

game.renderBoard();

const buttonStartGame = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');

function showMessage(currentStatus) {
  if (currentStatus === Game.Status.PLAYING) {
    document.querySelector('.message-start').classList.add('hidden');
  } else if (currentStatus === Game.Status.LOSE) {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else if (currentStatus === Game.Status.WIN) {
    document.querySelector('.message-win').classList.remove('hidden');
  }
}

buttonStartGame.addEventListener('click', () => {
  if (game.getStatus() === Game.Status.IDLE) {
    buttonStartGame.classList.value = '';
    buttonStartGame.classList.add('button', 'restart');
    buttonStartGame.innerText = 'Restart';
    game.start();
    showMessage(game.status);
    game.renderBoard(game.state);
  } else if (
    game.status === Game.Status.PLAYING ||
    game.status === Game.Status.LOSE
  ) {
    game.restart();
    scoreElement.innerText = initialScore;
    game.renderBoard(game.state);
  }
});

document.addEventListener('keydown', (e) => {
  if (game.status === Game.Status.PLAYING) {
    const prevBoard = JSON.parse(JSON.stringify(game.state));

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

    if (game.isMoveMade(prevBoard)) {
      game.checkGameOver();
      game.addRandomTile();
      game.checkGameOver();
      showMessage(game.status);
      game.renderBoard(game.state);
      scoreElement.innerText = game.score;
    }
  }
});
