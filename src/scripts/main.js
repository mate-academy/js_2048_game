'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.buttom start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('message-start');

const fields = document.querySelector('.field-cell');

document.addEventListener('keydown', keypressHandler);
startButton.addEventListener('click', startGame);

function keypressHandler(e) {
  const keyActions = {
    Escape: restartGame,
    Enter: startGame,
    ArrowUp: () => updateBoard(game.moveUp()),
    ArrowDown: () => updateBoard(game.moveDown()),
    ArrowLeft: () => updateBoard(game.moveLeft()),
    ArrowRight: () => updateBoard(game.moveRight()),
  };

  // Ações globais (Escape e Enter)
  if (keyActions[e.key] && (e.key === 'Escape' || e.key === 'Enter')) {
    keyActions[e.key]();

    return;
  }

  // Ações de movimento apenas se o jogo estiver em progresso
  if (game.status() === 'playing' && keyActions[e.key]) {
    keyActions[e.key]();

    return;
  }

  // Gerenciamento de estados de vitoria e derrota
  const gameStatusHandlers = {
    win: () => {
      messageWin.classList.remove('hidden');
    },
    lose: () => {
      messageLose.classList.remove('hidden');
    },
  };

  if (gameStatusHandlers[game.getStatus()]) {
    gameStatusHandlers[game.getStatus()]();
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  }
}

function updateBoard(initialState) {
  const gameValues = initialState.flat();

  fields.forEach((field, index) => {
    field.textContent = gameValues[index] || '';
  });

  const score = game.getScore();

  gameScore.textContent = score;

  const statuss = game.getStatus();

  if (statuss === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statuss === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function restartGame() {
  messageStart.classList.remove('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.classList.add('start');
  startButton.classList.remove('restart');
  startButton.textContent = 'Start';

  const initialState = game.restart();

  updateBoard(initialState);
}

function startGame() {
  if (game.getStatus() === 'idle') {
    const initialState = game.start();

    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');

    updateBoard(initialState);

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.remove('hidden');

    return;
  }

  if (game.getStatus() === 'playing') {
    restartGame();
  }
}
