import { DOM } from './dom.js';

let lastBoard = [];

export function renderBoard(game) {
  const board = game.getState();
  const flatBoard = board.flat();
  const flatLast = lastBoard.flat();

  DOM.cells.forEach((cell, index) => {
    const val = flatBoard[index];
    const prev = flatLast[index];

    cell.className = 'field-cell';

    if (val) {
      const digits = String(val).length;

      cell.style.setProperty('--digits', digits);
      cell.textContent = val;
      cell.classList.add(`field-cell--${val}`);

      if (prev === 0 && val !== 0) {
        cell.classList.add('field-cell--new');
      } else if (prev && val > prev) {
        cell.classList.add('field-cell--merged');
      }
    } else {
      cell.textContent = '';
      cell.style.setProperty('--digits', 1);
    }
  });

  lastBoard = board.map((row) => [...row]);

  DOM.scoreSpan.textContent = game.getScore();
  updateBest(game.getScore());
  checkGameStatus(game);
}

export function checkGameStatus(game) {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    showMessage('🎉 Winner! Congrats!');
  } else if (gameStatus === 'lose') {
    showMessage('You lose! Restart the game?');
  } else {
    hideMessage();
  }
}

export function showMessage(text) {
  DOM.message.textContent = text;
  DOM.messageBox.classList.remove('hidden');
}

export function hideMessage() {
  DOM.messageBox.classList.add('hidden');
}

export function updateBest(score = 0) {
  const bestScore = Number(localStorage.getItem('best-score')) || 0;

  if (score > bestScore) {
    localStorage.setItem('best-score', score);
    DOM.bestSpan.textContent = score;
  } else {
    DOM.bestSpan.textContent = bestScore;
  }
}
