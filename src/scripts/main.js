'use strict';

import { Game } from '../modules/Game.class';
import { Tile } from '../modules/tile';

const gameBoard = document.getElementById('game-board');

const game = new Game(gameBoard);

const buttonStart = document.querySelector('#ourButton');
const messageStart = document.querySelector('.message-start');
const gameOverMessage = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    messageStart.classList.add('hidden');
    game.getRandomEmptyCell().linkTile(new Tile(gameBoard));
    game.getRandomEmptyCell().linkTile(new Tile(gameBoard));
    buttonStart.textContent = 'Restart';
  } else {
    if (buttonStart.classList.contains('restart')) {
      restartGame();
      game.getRandomEmptyCell().linkTile(new Tile(gameBoard));
      game.getRandomEmptyCell().linkTile(new Tile(gameBoard));
    }
  }

  if (!gameOverMessage.classList.contains('hidden')) {
    gameOverMessage.classList.add('hidden');
    setupInputOnce();
  }

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
    setupInputOnce();
  }
});

setupInputOnce();

function setupInputOnce() {
  if (messageWin.classList.contains('hidden')) {
    window.addEventListener('keydown', handleInput, { once: true });
  }
  game.getScore();
}

async function handleInput(pressedKey) {
  switch (pressedKey.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInputOnce();

        return;
      }
      await moveUp();
      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInputOnce();

        return;
      }

      await moveDown();
      break;

    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInputOnce();

        return;
      }

      await moveLeft();
      break;

    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInputOnce();

        return;
      }

      await moveRight();
      break;

    default:
      setupInputOnce();

      return;
  }

  const newTile = new Tile(gameBoard);

  game.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    gameOver();

    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await moveTiles(game.cellsGroupedByColumn);
}

async function moveDown() {
  await moveTiles(game.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await moveTiles(game.cellsGroupedByRow);
}

async function moveRight() {
  await moveTiles(game.cellsGroupedByReversedRow);
}

async function moveTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach((group) => moveTilesInGroup(group, promises));

  await Promise.all(promises);

  game.cells.forEach((cell) => {
    // eslint-disable-next-line no-unused-expressions
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function moveTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(game.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(game.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(game.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(game.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some((group) => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}

function restartGame() {
  game.cells.forEach((cell) => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromDOM();
      cell.unlinkTile();
    }
  });

  game.resetScore();
}

function gameOver() {
  gameOverMessage.classList.remove('hidden');
}
