'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const table = document.querySelector('table');
const score = document.querySelector('.game-score');
const bestScore = document.querySelector('.best-score');
const board = document.querySelector('.game-field');
const grid = Array.from(board.rows).map((row) => {
  return Array.from(row.cells);
});
const startBtn = document.querySelector('.start');
const game = new Game();

startBtn.addEventListener('click', async () => {
  startBtn.blur();

  if (startBtn.classList.contains('restart')) {
    if (!(await restartGameOverlay())) {
      // console.log('Game restart cancelled');

      return;
    }
    // console.log('Game restarted');
  }
  bestScore.textContent = game.getBestScore() + '';
  game.restart();
  game.RadomGeneration();
  game.RadomGeneration();
  drawBoard();
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
});

function drawBoard() {
  for (let i = 0; i < game.gameBoard.length; i++) {
    for (let j = 0; j < game.gameBoard[i].length; j++) {
      if (game.gameBoard[i][j] === 0) {
        grid[i][j].textContent = '';
      } else {
        grid[i][j].textContent = '' + Math.pow(2, game.gameBoard[i][j]);
      }
      grid[i][j].style.setProperty('--exponent', game.gameBoard[i][j]);
    }
  }
  score.textContent = game.score;
}

document.addEventListener('keydown', (evnt) => {
  if (evnt.code === 'ControlRight') {
    winOverlay();
  } else {
    gameStep(evnt.key);
  }
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

table.addEventListener('touchstart', (evnt) => {
  touchStartX = evnt.changedTouches[0].screenX;
  touchStartY = evnt.changedTouches[0].screenY;
});

table.addEventListener('touchend', (evnt) => {
  touchEndX = evnt.changedTouches[0].screenX;
  touchEndY = evnt.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  const treshold = 30;

  if (Math.abs(deltaX) < treshold && Math.abs(deltaY) < treshold) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      gameStep('ArrowRight');
    } else {
      gameStep('ArrowLeft');
    }
  } else {
    if (deltaY > 0) {
      gameStep('ArrowDown');
    } else {
      gameStep('ArrowUp');
    }
  }
}

function gameStep(direction) {
  switch (direction) {
    case 'ArrowUp':
      // console.log('Рух вгору');
      move(game.moveUp.bind(game));
      break;
    case 'ArrowDown':
      // console.log('Рух вниз');
      move(game.moveDown.bind(game));
      break;
    case 'ArrowLeft':
      // console.log('Рух вліво');
      move(game.moveLeft.bind(game));
      break;
    case 'ArrowRight':
      // console.log('Рух вправо');
      move(game.moveRight.bind(game));
      break;
  }
}

function restartGameOverlay() {
  const promise = new Promise((resolve) => {
    const overlay = document.querySelector('.overlay');

    overlay.classList.remove('hidden');

    const overlayTitle = document.querySelector('.overlay-title');

    overlayTitle.textContent = 'Are you sure?';

    const cancelBtn = document.querySelector('.overlay-btn.cancel');
    const restartBtn = document.querySelector('.overlay-btn.restart');

    cancelBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
      resolve(false);
    });

    restartBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
      resolve(true);
    });
  });

  return promise;
}

function gameOverOverlay() {
  const overlay = document.querySelector('.overlay');

  overlay.classList.remove('hidden');

  const overlayTitle = document.querySelector('.overlay-title');

  overlayTitle.textContent = 'Game Over!';

  const currentScore = document.createElement('div');

  currentScore.textContent = `Score: ${game.score}`;
  currentScore.classList.add('overlay-message');
  overlayTitle.after(currentScore);

  const cancelBtn = document.querySelector('.overlay-btn.cancel');
  const restartBtn = document.querySelector('.overlay-btn.restart');

  cancelBtn.style.display = 'none';
  restartBtn.textContent = 'Restart';

  restartBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    cancelBtn.style.display = 'inline-block';
    startBtn.classList.remove('restart');
    currentScore.remove();
    startBtn.click();
  });
}

function littleAnumation(oldboard, newboard) {
  for (let i = 0; i < oldboard.length; i++) {
    for (let j = 0; j < oldboard[i].length; j++) {
      if (oldboard[i][j] !== newboard[i][j] && newboard[i][j] !== 0) {
        grid[i][j].style.transform = 'scale(1.1)';

        setTimeout(() => {
          grid[i][j].style.transform = 'scale(1)';
        }, 150);
      }
    }
  }
}

function winOverlay() {
  const overlay = document.querySelector('.overlay');

  overlay.classList.remove('hidden');

  const overlayTitle = document.querySelector('.overlay-title');

  overlayTitle.textContent = 'You win! Congrats! You did it!';

  const currentScore = document.createElement('div');

  currentScore.textContent = `Score: ${game.score}`;
  currentScore.classList.add('overlay-message');
  overlayTitle.after(currentScore);

  const cancelBtn = document.querySelector('.overlay-btn.cancel');
  const restartBtn = document.querySelector('.overlay-btn.restart');

  cancelBtn.style.display = 'none';
  restartBtn.textContent = 'Oh shit, here we go again!';

  restartBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    cancelBtn.style.display = 'inline-block';
    restartBtn.textContent = 'Restart';
    startBtn.classList.remove('restart');
    currentScore.remove();
    startBtn.click();
  });
}

function move(directionFunc) {
  const oldBoard = game.gameBoard.map((row) => row.slice());

  if (!directionFunc()) {
    return;
  }
  drawBoard();
  game.RadomGeneration();

  setTimeout(() => {
    drawBoard();
    littleAnumation(oldBoard, game.gameBoard);
  }, 150);
  // console.log(game.gameBoard);
  drawBoard();

  if (game.isWin()) {
    winOverlay();
  }

  if (game.isGameOver()) {
    gameOverOverlay();
  }
}
