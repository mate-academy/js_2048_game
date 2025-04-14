'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const gridElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');

// Evento de clique no botão "Start"
startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    game.start(); // Inicializa o jogo
    updateUI();
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    updateUI();
    startButton.textContent = 'Start';
  }
});

function updateUI() {
  // Atualiza o tabuleiro
  const rows = gridElement.querySelectorAll('tr');
  const gridState = game.getState();

  rows.forEach((rowElement, rowIndex) => {
    const cells = rowElement.querySelectorAll('td');

    cells.forEach((cell, colIndex) => {
      const value = gridState[rowIndex][colIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`value-${value}`);
      }
    });
  });
  // Atualiza a pontuação
  scoreElement.textContent = game.getScore();

  // Atualiza mensagens
  const gameStatus = game.getStatus();

  messageContainer.querySelectorAll('.message').forEach((msg) => {
    msg.classList.add('hidden'); // Esconde todas as mensagens
  });

  if (gameStatus === 'win') {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messageContainer.querySelector('.message-start').classList.remove('hidden');
  }
}

/**
 * Adiciona suporte ao teclado para mover o tabuleiro.
 */
document.addEventListener('keydown', (evt) => {
  const key = evt.key;

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (key === 'ArrowLeft') {
    game.moveLeft();
  } else if (key === 'ArrowRight') {
    game.moveRight();
  } else if (key === 'ArrowUp') {
    game.moveUp();
  } else if (key === 'ArrowDown') {
    game.moveDown();
  }

  updateUI(); // Atualiza a interface após cada movimento
});
