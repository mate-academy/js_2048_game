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
  const gameContainer = document.querySelector('.container');

  // Lock page scrolling
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100%';

  // Touch controls
  let touchStartX = 0;
  let touchStartY = 0;
  const minSwipeDistance = 30;

  gameContainer.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: false },
  );

  gameContainer.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );

  gameContainer.addEventListener(
    'touchend',
    (e) => {
      e.preventDefault();

      if (game.getStatus() !== 'playing') {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Check if the swipe was long enough
      if (
        Math.abs(deltaX) < minSwipeDistance &&
        Math.abs(deltaY) < minSwipeDistance
      ) {
        return;
      }

      let moved = false;

      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          moved = game.moveRight();
        } else {
          moved = game.moveLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          moved = game.moveDown();
        } else {
          moved = game.moveUp();
        }
      }

      if (moved) {
        updateGameState();
      }
    },
    { passive: false },
  );

  // Add touch-action CSS to prevent default touch behaviors
  const style = document.createElement('style');

  style.textContent = `
    .container {
      touch-action: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
  `;
  document.head.appendChild(style);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowLeft':
        moved = game.moveLeft();
        break;
      case 'ArrowRight':
        moved = game.moveRight();
        break;
      case 'ArrowUp':
        moved = game.moveUp();
        break;
      case 'ArrowDown':
        moved = game.moveDown();
        break;
      default:
        return;
    }

    if (moved) {
      updateGameState();
    }
  });

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

        // Clean up any existing special cell classes
        cell.classList.forEach((className) => {
          if (className.startsWith('field-cell--')) {
            cell.classList.remove(className);
          }
        });

        // Empty cell
        if (newValue === 0) {
          cell.textContent = '';
          cell.className = 'field-cell';
        } else {
          // Cell with a number
          cell.textContent = newValue;
          cell.className = `field-cell field-cell--${newValue}`;

          // Animate new or merged tiles
          if (oldValue !== newValue) {
            if (oldValue === 0) {
              // Animate new tile appearance
              cell.classList.add('field-cell--new');

              setTimeout(() => {
                cell.classList.remove('field-cell--new');
              }, 150);
            } else if (newValue === oldValue * 2) {
              // Animate tile merge
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
});
