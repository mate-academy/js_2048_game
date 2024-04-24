'use strict';

const Game = window.Game;

const game = new Game();
const isWin = document.querySelector('.message-win')
  .classList.contains('hidden');
const isLose = document.querySelector('.message-lose')
  .classList.contains('hidden');

function handleKeyDown(e) {
  if (isWin && isLose) {
    switch (e.key) {
      case 'ArrowUp':
        game.moveCellsUp();
        game.handleMessages();

        if (game.isBoardEmpty()) {
          game.generateRandomCell();
          handleStartButtonClick();
        }
        break;
      case 'ArrowDown':
        game.moveCellsDown();
        game.handleMessages();

        if (game.isBoardEmpty()) {
          game.generateRandomCell();
          handleStartButtonClick();
        }
        break;
      case 'ArrowLeft':
        game.moveCellsLeft();
        game.handleMessages();

        if (game.isBoardEmpty()) {
          game.generateRandomCell();
          handleStartButtonClick();
        }
        break;
      case 'ArrowRight':
        game.handleMessages();
        game.moveCellsRight();

        if (game.isBoardEmpty()) {
          game.generateRandomCell();
          handleStartButtonClick();
        }
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyDown);

function handleStartButtonClick() {
  game.loseMessage.classList.add('hidden');
  game.winMessage.classList.add('hidden');
  game.generateRandomCell();
  game.handleMessages();

  game.startButton.classList.add('hidden');
  game.restartButton.classList.remove('hidden');
}

game.startButton.addEventListener('click', handleStartButtonClick);

function handleRestartButtonClick() {
  game.resetCells(game.fieldCells);

  game.startButton.classList.remove('hidden');
  game.restartButton.classList.add('hidden');

  game.startMessage.classList.remove('hidden');
  game.loseMessage.classList.add('hidden');

}

game.restartButton.addEventListener('click', handleRestartButtonClick);
