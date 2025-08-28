'use strict';

/* Browser wiring (Game.class.js also assigns window.Game) */
(function () {
  if (typeof window === 'undefined' || !window.Game) {
    return;
  }

  const game = new window.Game();

  const scoreEl = document.querySelector('.game-score');
  const btn = document.querySelector('.button');
  const cells = Array.from(document.querySelectorAll('.field-cell'));

  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');

  // Track previous state to detect changes
  let previousState = null;
  let previousScore = 0;

  // Helper function to handle animation cleanup
  function cleanupAnimations() {
    cells.forEach((cell) => {
      cell.classList.remove('new-tile', 'merge-tile', 'move-tile');
    });
  }

  function render() {
    const state = game.getState();
    const isFirstRender = previousState === null;

    // Clean up previous animations
    setTimeout(cleanupAnimations, 300);

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const i = r * 4 + c;
        const cell = cells[i];
        const val = state[r][c];
        const prevVal = isFirstRender
          ? 0
          : previousState && previousState[r] && previousState[r][c];

        // Remove old classes
        cell.className = 'field-cell';
        cell.textContent = val ? String(val) : '';
        // Add data attribute for CSS styling
        cell.setAttribute('data-value', val ? String(val) : '');

        if (val) {
          // Add value class
          cell.classList.add(`field-cell--${val}`);

          // Add animation classes
          if (!isFirstRender) {
            if (prevVal === 0 && val !== 0) {
              // Remove any existing animation class
              cell.classList.remove('merge-tile');
              cell.classList.remove('move-tile');

              // Add new tile animation class
              // Force reflow to ensure animation plays
              void cell.offsetWidth;
              cell.classList.add('new-tile');
            } else if (prevVal !== 0 && val === prevVal * 2) {
              // Remove any existing animation class
              cell.classList.remove('new-tile');
              cell.classList.remove('move-tile');

              // Add merge animation class
              void cell.offsetWidth;
              cell.classList.add('merge-tile');
            } else if (prevVal !== val && prevVal !== 0 && val !== 0) {
              // Remove any existing animation class
              cell.classList.remove('new-tile');
              cell.classList.remove('merge-tile');

              // Add move animation class
              void cell.offsetWidth;
              cell.classList.add('move-tile');
            }
          }
        }
      }
    }

    // Store current state for next render comparison
    previousState = JSON.parse(JSON.stringify(state));

    // Handle score
    const score = game.getScore();

    // Animate score changes
    if (score > previousScore && !isFirstRender) {
      // Remove any existing score animations
      Array.from(scoreEl.querySelectorAll('.score-addition')).forEach((el) => {
        el.parentNode.removeChild(el);
      });

      const addition = document.createElement('div');

      addition.className = 'score-addition';
      addition.textContent = '+' + (score - previousScore);

      scoreEl.appendChild(addition);

      // Remove the element after animation completes
      setTimeout(() => {
        if (addition.parentNode) {
          addition.parentNode.removeChild(addition);
        }
      }, 600);
    }

    previousScore = score;

    scoreEl.textContent = score ? String(score) : '0';
    scoreEl.value = ''; // For test compatibility

    // Handle messages
    const gameStatus = game.getStatus();

    // Reset all messages
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');

    // Show appropriate message
    switch (gameStatus) {
      case 'idle':
        msgStart.classList.remove('hidden');
        break;
      case 'win':
        msgWin.classList.remove('hidden');
        break;
      case 'lose':
        msgLose.classList.remove('hidden');
        msgLose.style.removeProperty('display');
        break;
    }

    if (gameStatus === 'idle') {
      btn.textContent = 'Start';
      btn.classList.add('start');
      btn.classList.remove('restart');
    } else {
      btn.textContent = 'Restart';
      btn.classList.add('restart');
      btn.classList.remove('start');
    }
  }

  const keyToMove = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  document.addEventListener('keydown', (e) => {
    const fn = keyToMove[e.key];

    if (!fn) {
      return;
    }

    const gameState = game.getStatus();

    // Auto-start on arrow key
    if (gameState === 'idle') {
      game.start();
      render();

      return;
    }

    // Handle move
    if (gameState === 'playing') {
      const moved = fn();

      if (moved || game.getStatus() === 'lose') {
        render();
      }
    }
  });

  btn.addEventListener('click', () => {
    const gameState = game.getStatus();

    if (gameState === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    render();
  });

  render(); // initial paint
})();
