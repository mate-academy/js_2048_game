'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const startButton = document.querySelector('.button.start');
  const messageStart = document.querySelector('.message-start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const gameScore = document.querySelector('.game-score');

  function updateGameState() {
    renderBoard(game.getState());
    gameScore.textContent = game.getScore();

    const gameStatus = game.getStatus();

    // Hide all messages first
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    // Show appropriate message based on status
    if (gameStatus === 'idle') {
      messageStart.classList.remove('hidden');
      startButton.textContent = 'Start';
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
      startButton.textContent = 'Play Again';
    } else if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
      startButton.textContent = 'Play Again';
    } else {
      startButton.textContent = 'Restart';
    }
  }

  function renderBoard(board) {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const newValue = board[rowIndex][cellIndex];
        const oldValue = parseInt(cell.textContent) || 0;

        // Remove all existing field-cell-- classes
        cell.classList.forEach((className) => {
          if (className.startsWith('field-cell--')) {
            cell.classList.remove(className);
          }
        });

        // Handle empty cells (value 0)
        if (newValue === 0) {
          cell.textContent = '';
          cell.className = 'field-cell'; // Reset to base class only
        } else {
          // Handle cells with numbers
          cell.textContent = newValue;
          cell.className = `field-cell field-cell--${newValue}`;

          // Add animation if value changed
          if (oldValue !== newValue) {
            if (oldValue === 0) {
              cell.classList.add('field-cell--new');

              setTimeout(() => {
                cell.classList.remove('field-cell--new');
              }, 150);
            } else if (newValue === oldValue * 2) {
              cell.classList.add('field-cell--merged');

              setTimeout(() => {
                cell.classList.remove('field-cell--merged');
              }, 150);
            }
          }
        }
      });
    });
  }

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
      messageStart?.classList.add('hidden');
    } else {
      game.restart();
    }

    game.start();
    game.setStatus('playing');
    updateGameState();
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        moved = true;
        break;
      case 'ArrowDown':
        game.moveDown();
        moved = true;
        break;
      case 'ArrowLeft':
        game.moveLeft();
        moved = true;
        break;
      case 'ArrowRight':
        game.moveRight();
        moved = true;
        break;
    }

    if (moved) {
      if (startButton.classList.contains('start')) {
        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startButton.textContent = 'Restart';
        messageStart?.classList.add('hidden');
      }
      updateGameState();
    }
  });
});
