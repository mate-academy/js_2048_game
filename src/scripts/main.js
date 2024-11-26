'use strict';

const Game = require('../modules/Game.class');

class UIController {
  constructor(gameInstance) {
    this.game = gameInstance;

    this.scoreElement = document.querySelector('.game-score');
    this.gameField = document.querySelector('.game-field');
    this.fieldCells = document.querySelectorAll('.field-cell');
    this.startButton = document.querySelector('.button.start');
    this.restartButton = document.querySelector('.button.restart');
    this.loseMessage = document.querySelector('.message-lose');
    this.winMessage = document.querySelector('.message-win');
    this.startMessage = document.querySelector('.message-start');

    function bounceCells() {
      this.fieldCells.forEach((cell) => {
        cell.classList.add('bounce');
      });

      this.fieldCells.forEach((cell) => {
        cell.addEventListener(
          'animationend',
          () => {
            cell.classList.remove('bounce');
          },
          { once: true },
        );
      });
    }

    this.startButton.addEventListener('click', this.startGame.bind(this));
    this.startButton.addEventListener('click', bounceCells.bind(this));

    this.restartButton.addEventListener('click', this.restartGame.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.restartButton.addEventListener('click', bounceCells.bind(this));

    this.renderField();
    this.updateScore();
    this.showStartMessage();
  }

  renderField() {
    const state = this.game.getState();

    this.fieldCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = state[row][col];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  }

  updateScore() {
    this.scoreElement.textContent = this.game.getScore();
  }

  resetMessages() {
    this.loseMessage.classList.add('hidden');
    this.winMessage.classList.add('hidden');
    this.startMessage.classList.add('hidden');
  }

  showStartMessage() {
    this.startMessage.classList.remove('hidden');
  }

  startGame() {
    this.game.start();
    this.renderField();
    this.updateScore();
    this.resetMessages();
    this.restartButton.classList.remove('hidden');
    this.startButton.classList.add('hidden');
  }

  restartGame() {
    this.game.restart();
    this.startGame();
  }

  handleKeyDown(e) {
    if (
      this.game.getStatus() !== 'playing' &&
      this.game.getStatus() !== 'win'
    ) {
      return;
    }

    const moves = {
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
      ArrowUp: 'moveUp',
      ArrowDown: 'moveDown',
    };

    const move = moves[e.key];

    if (move) {
      this.game[move]();
      this.renderField();
      this.updateScore();
      this.checkGameStatus();
    }
  }

  checkGameStatus() {
    if (this.game.getStatus() === 'win') {
      this.winMessage.classList.remove('hidden');
    } else if (this.game.getStatus() === 'lose') {
      this.loseMessage.classList.remove('hidden');
      this.restartButton.classList.remove('hidden');
      this.startButton.classList.add('hidden');
    }
  }
}

const game = new Game();
const uiController = new UIController(game);
