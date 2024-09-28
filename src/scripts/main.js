'use strict';
import Tile from '../modules/Tile.js';

const Game = require('../modules/Game.class');

const startBtn = document.querySelector('.start');
const gameBoard = document.getElementById('game-board');
const gameScore = document.querySelector('.game-score');
const messages = document.querySelector('.message-container').children;
const game = new Game(gameBoard);

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateStatus() {
  const [messageLose, messageWin, messageStart] = messages;
  const gameStatus = game.getStatus();
  const hiddenClass = 'hidden';

  Array.from(messages).forEach((message) => {
    message.classList.add(hiddenClass);
  });

  switch (gameStatus) {
    case Game.Statuses.IDLE:
      messageStart.classList.remove(hiddenClass);
      break;
    case Game.Statuses.WIN:
      messageWin.classList.remove(hiddenClass);
      break;
    case Game.Statuses.LOSE:
      messageLose.classList.remove(hiddenClass);
      break;
    default:
      break;
  }
}

function setupSwipeInput() {
  let swiping = false;

  document.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();

      if (swiping) {
        return;
      }

      swiping = true;

      const startX = e.touches[0].clientX;
      const startY = e.touches[0].clientY;
      let endSwipe = false;

      document.addEventListener(
        'touchend',
        (ev) => {
          ev.preventDefault();

          if (endSwipe) {
            return;
          }

          endSwipe = true;

          const endX = ev.changedTouches[0].clientX;
          const endY = ev.changedTouches[0].clientY;

          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const absDeltaX = Math.abs(deltaX);
          const absDeltaY = Math.abs(deltaY);

          const threshold = 100; // Поріг чутливості
          const obj = { key: '-' };

          if (absDeltaX < threshold && absDeltaY < threshold) {
            swiping = false;
            endSwipe = false;
            setupSwipeInput();

            return;
          }

          // Визначення напрямку свайпа
          if (absDeltaX > threshold) {
            if (deltaX > 0) {
              obj.key = 'ArrowRight';
            } else {
              obj.key = 'ArrowLeft';
            }
          } else if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
              obj.key = 'ArrowDown';
            } else {
              obj.key = 'ArrowUp';
            }
          }

          swipeInput(obj);
          swiping = false;
          endSwipe = false;
        },
        { once: true },
      );
    },
    { once: true },
  );
}

async function swipeInput(e) {
  if (game.getStatus() !== Game.Statuses.PLAYING) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();

        return;
      }
      await game.moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();

        return;
      }
      await game.moveDown();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();

        return;
      }
      await game.moveLeft();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();

        return;
      }
      await game.moveRight();
      break;
    default:
      setupSwipeInput();

      return;
  }

  game.cells.forEach((cell) => cell.mergeTiles());

  if (game.checkForWin()) {
    game.setStatus(Game.Statuses.WIN);
    updateStatus();

    return;
  }

  const newTile = new Tile(gameBoard);

  game.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      game.setStatus(Game.Statuses.LOSE);
      updateStatus();
    });

    return;
  }

  updateScore();
  updateStatus();
  setupSwipeInput();
}

function setupInput() {
  window.addEventListener('keyup', handleInput, { once: true });
}

async function handleInput(e) {
  if (game.getStatus() !== Game.Statuses.PLAYING) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();

        return;
      }
      await game.moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();

        return;
      }
      await game.moveDown();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();

        return;
      }
      await game.moveLeft();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();

        return;
      }
      await game.moveRight();
      break;
    default:
      setupInput();

      return;
  }

  game.cells.forEach((cell) => cell.mergeTiles());

  if (game.checkForWin()) {
    game.setStatus(Game.Statuses.WIN);
    updateStatus();

    return;
  }

  const newTile = new Tile(gameBoard);

  game.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      game.setStatus(Game.Statuses.LOSE);
      updateStatus();
    });

    return;
  }

  updateScore();
  updateStatus();
  setupInput();
}

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    game.start();
    updateStatus();
    game.randomEmptyCell().tile = new Tile(gameBoard);
    game.randomEmptyCell().tile = new Tile(gameBoard);
    setupInput();
    setupSwipeInput();
  } else if (startBtn.classList.contains('restart')) {
    game.restart();
    updateStatus();
    game.randomEmptyCell().tile = new Tile(gameBoard);
    game.randomEmptyCell().tile = new Tile(gameBoard);
    setupInput();
    setupSwipeInput();
  }
});

function canMoveUp() {
  return canMove(game.cellsByColumn);
}

function canMoveDown() {
  return canMove(game.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(game.cellsByRow);
}

function canMoveRight() {
  return canMove(game.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell.tile == null) {
        return false;
      }

      const moveToCell = group[index - 1];

      return moveToCell.canAccept(cell.tile);
    });
  });
}
