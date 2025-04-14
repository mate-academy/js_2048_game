'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const gameUIFields = [[], [], [], []];
  const gameScoreInfo = document.querySelector('.game-score');
  const startGameButton = document.querySelector('.button.start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');
  const gameFieldRows = [...document.querySelectorAll('.field-row')];
  const gameFieldCell
    = [...document.querySelectorAll('.field-row .field-cell')];

  const renderUIFields = () => {
    let cells = [...gameFieldCell];

    gameFieldRows.forEach((_, i) => {
      gameUIFields[i] = gameFieldRows[i];

      gameFieldRows.forEach((__, j) => {
        gameUIFields[i][j] = cells[j];
      });
      cells = cells.slice(4);
    });
  };

  const renderGameDesc = () => {
    game.state.forEach((row, i) => {
      row.forEach((coll, j) => {
        gameUIFields[i][j].textContent = '';

        if (gameUIFields[i][j].textContent === '') {
          gameUIFields[i][j].className = `field-cell`;
        }

        if (coll > 0) {
          gameUIFields[i][j].append(coll);
          gameUIFields[i][j].className = `field-cell field-cell--${coll}`;
        }
      });
    });
  };

  document.addEventListener('click', el => {
    switch (el.srcElement.className) {
      case 'button start':
        game.start();
        renderUIFields();
        renderGameDesc();
        startGameButton.classList.remove('start');
        startGameButton.classList.add('restart');
        startGameButton.textContent = 'Restart';
        messageStart.classList.add('hidden');
        gameScoreInfo.textContent = 0;
        break;
      case 'button restart':
        hideMessageGame(messageLose, 'lose');
        hideMessageGame(messageWin, 'win');
        gameScoreInfo.textContent = 0;
        game.restart();
        game.start();
        renderUIFields();
        renderGameDesc();
        break;
      default:
        break;
    }
  });

  document.addEventListener('keydown', ev => {
    if (game.gameStatus === 'idle') {
      return;
    }

    if (game.gameStatus === 'win'
      || game.gameStatus === 'lose') {
      return;
    }

    switch (ev.key) {
      case 'ArrowLeft':
        game.moveLeft();
        renderGameDesc();
        gameScoreInfo.textContent = game.getScore();
        showMessageGame(messageWin, 'win');
        showMessageGame(messageLose, 'lose');
        break;
      case 'ArrowRight':
        game.moveRight();
        renderGameDesc();
        gameScoreInfo.textContent = game.getScore();
        showMessageGame(messageWin, 'win');
        showMessageGame(messageLose, 'lose');
        break;
      case 'ArrowUp':
        game.moveUp();
        renderGameDesc();
        gameScoreInfo.textContent = game.getScore();
        showMessageGame(messageWin, 'win');
        showMessageGame(messageLose, 'lose');
        break;
      case 'ArrowDown':
        game.moveDown();
        renderGameDesc();
        gameScoreInfo.textContent = game.getScore();
        showMessageGame(messageWin, 'win');
        showMessageGame(messageLose, 'lose');
        break;
      default:
        break;
    }
  });

  const showMessageGame = (messageSelector, gameStatus) => {
    if (game.gameStatus === gameStatus) {
      messageSelector.classList.remove('hidden');
    }
  };

  const hideMessageGame = (messageSelector, gameStatus) => {
    if (game.gameStatus === gameStatus) {
      messageSelector.classList.add('hidden');
    }
  };
});

// Write your code here
