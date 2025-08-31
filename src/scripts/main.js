'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const gameButton = document.querySelector('.button');
const fieldCell = document.querySelectorAll('.field-cell');
const message = document.querySelectorAll('.message');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

let keydown = false;

gameButton.addEventListener('click', (ev) => {
  gameButton.classList.add('restart');
  gameButton.textContent = 'Restart';
  message.forEach((el) => el.classList.add('hidden'));

  if (ev.target.classList.contains('start')) {
    gameButton.classList.remove('start');
    gameButton.classList.add('restart');
    gameButton.textContent = 'Restart';

    keydown = true;
    game.start();
    gameBoardUpdate();
    keyPlay();

    return;
  }

  if (ev.target.classList.contains('restart')) {
    gameButton.classList.add('start');
    gameButton.classList.remove('restart');
    gameButton.textContent = 'Start';
    game.restart();
    gameBoardUpdate();
  }
});

function gameBoardUpdate(arr) {
  const gameBord = arr || game.gameStatus.flat();

  for (let i = 0; i < gameBord.length; i++) {
    const element = gameBord[i] === 0 ? '' : gameBord[i];

    fieldCell[i].textContent = element;

    fieldCell[i].classList = `field-cell field-cell--${element}`;

    if (gameBord[i] !== 0 && !fieldCell[i].classList.contains('cell-new')) {
      fieldCell[i].classList.add('cell-new');

      setTimeout(() => fieldCell[i].classList.remove('cell-new'), 200);
    }
  }

  score.textContent = game.gameScore;

  if (game.statusGame === 'lose') {
    loseMessage.classList = 'message message-lose';
    game.getStatus();
  }

  if (game.statusGame === 'win') {
    winMessage.classList = 'message message-win';
    game.getStatus();
  }
}

function keyPlay() {
  if (keydown) {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          game.moveLeft();
          gameBoardUpdate();
          break;
        case 'ArrowRight':
          game.moveRight();
          gameBoardUpdate();
          break;
        case 'ArrowUp':
          game.moveUp();
          gameBoardUpdate();
          break;
        case 'ArrowDown':
          game.moveDown();
          gameBoardUpdate();
          break;
      }
    });
  }
}

let startX, startY, endX, endY;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) {
      game.moveRight();
    } else if (dx < -30) {
      game.moveLeft();
    }
  } else {
    if (dy > 30) {
      game.moveDown();
    } else if (dy < -30) {
      game.moveUp();
    }
  }

  gameBoardUpdate();
});
