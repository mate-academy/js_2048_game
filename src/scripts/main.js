'use strict';

const Game = require('../modules/Game.class');
const Score = require('../modules/Score.class');
const AnimationManager = require('../modules/AnimationManager.class');
const Movement = require('../modules/Movement.class');

const scoreColEls = [...document.querySelectorAll('.score-col')];
const rows = [...document.querySelectorAll('.field-row')];
const cells = rows.map((row) => [...row.querySelectorAll('.field-cell')]);

const startBtn = document.querySelector('.button.start');

const startMsg = document.querySelector('.message.message-start');
const loseMsgEl = document.querySelector('.message.message-lose');
const winMsgEl = document.querySelector('.message.message-win');

const swipeSound = document.getElementById('swipe-sound');
const mergeSound = document.getElementById('merge-sound');
const clickSound = document.getElementById('click-sound');
const backgroundMusic = document.getElementById('background-music');
const gameOverSound = document.getElementById('game-over-sound');
const gameVictorySound = document.getElementById('game-victory-sound');

if (!cells.length) {
  throw new Error('Cells are not found!');
}

export const ANIMATION_DURATION = 200;
export const BOARD_SIZE = 4;
export const FOUR_SPAWN_CHANCE = 0.1;

function initializeGame() {
  const score = new Score(scoreColEls);
  const game = new Game(
    startMsg,
    loseMsgEl,
    winMsgEl,
    backgroundMusic,
    gameOverSound,
    gameVictorySound,
  );
  const animation = new AnimationManager(cells);
  const movement = new Movement(game.dash, cells, mergeSound, swipeSound);

  score.initializeScoreCounter();
  score.resetScore();

  game.resetMsgs();
  game.start();

  movement.spawnNumber();
  movement.spawnNumber();
  movement.updateHtmlTable();

  let gameStatus = game.getStatus();

  document.addEventListener('keydown', (e) => {
    if (gameStatus !== 'playing') {
      return;
    }

    if (animation.isMoving) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        movement.move('up');
        animation.calculateAction(movement.prevDashCopy, movement.dash, 'up');
        break;
      case 'ArrowDown':
        movement.move('down');

        animation.calculateAction(movement.prevDashCopy, movement.dash, 'down');
        break;
      case 'ArrowLeft':
        movement.move('left');

        animation.calculateAction(movement.prevDashCopy, movement.dash, 'left');
        break;
      case 'ArrowRight':
        movement.move('right');

        animation.calculateAction(
          movement.prevDashCopy,
          movement.dash,
          'right',
        );
        break;
    }

    game.setDash(movement.dash);

    animation.updateHtmlAnimation();
    movement.updateHtmlTable();
    score.setScore(movement.score);
    score.updateHtmlScore();

    gameStatus = game.getStatus();
  });
}

window.addEventListener('load', () => {
  startBtn.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    initializeGame();

    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
    startBtn.textContent = 'restart';
  });
});
