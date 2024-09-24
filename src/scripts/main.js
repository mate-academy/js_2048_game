'use strict';

const Tile = require('../modules/Tile.class');
const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const gameButton = document.querySelector('.button');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');
  const scoreElement = document.querySelector('.game-score');
  const gameField = document.querySelector('.game-field');
  const themeSwitcher = document.querySelector('.theme-switcher');
  const buttonUp = document.querySelector('.control__button--up');
  const buttonDown = document.querySelector('.control__button--down');
  const buttonLeft = document.querySelector('.control__button--left');
  const buttonRight = document.querySelector('.control__button--right');

  const fieldSize = 4;
  const cellsCount = fieldSize * fieldSize;
  const cells = [];

  initCells();

  const game = new Game();
  const cellsGroupedByColumn = groupCellsByColumn();
  const cellsGroupedByReversedColumn = groupCellsByColumn().map((column) => {
    return column.reverse();
  });
  const cellsGroupedByRow = groupCellsByRow();
  const cellsGroupedByReversedRow = groupCellsByRow().map((row) => {
    return row.reverse();
  });

  function renderBoard() {
    const gameMatrix = game.getState();

    for (let i = 0; i < gameMatrix.length; i++) {
      for (let j = 0; j < gameMatrix[i].length; j++) {
        const value = gameMatrix[i][j];

        if (value !== 0) {
          const existingCell = cells.find(
            (cell) => cell.row === i && cell.col === j,
          );

          if (existingCell.linkedTile) {
            continue;
          }

          const newTile = new Tile(value, gameField);

          linkTile(newTile, existingCell);
        }
      }
    }
  }

  function initCells() {
    for (let i = 0; i < cellsCount; i++) {
      cells.push({ row: Math.floor(i / fieldSize), col: i % fieldSize });
    }
  }

  function clearBoard() {
    for (const cell of cells) {
      if (cell.linkedTile) {
        cell.linkedTile.removeFromDom();
        cell.linkedTile = null;
        cell.linkedTileForMerge = null;
      }
    }
  }

  function linkTile(tile, cell) {
    tile.setCoords(cell.row, cell.col);
    cell.linkedTile = tile;
  }

  function unlinkTile(cell) {
    cell.linkedTile = null;
  }

  function linkTileForMerge(tile, cell) {
    tile.setCoords(cell.row, cell.col);
    cell.linkedTileForMerge = tile;
  }

  function unlinkTileForMerge(cell) {
    cell.linkedTileForMerge = null;
  }

  function canAccept(targetCell, currentTile) {
    return (
      !targetCell.linkedTile ||
      (!targetCell.linkedTileForMerge &&
        targetCell.linkedTile.value === currentTile.value)
    );
  }

  function groupCellsByColumn() {
    return cells.reduce((groupedCells, cell) => {
      groupedCells[cell.col] = groupedCells[cell.col] || [];
      groupedCells[cell.col][cell.row] = cell;

      return groupedCells;
    }, []);
  }

  function groupCellsByRow() {
    return cells.reduce((groupedCells, cell) => {
      groupedCells[cell.col] = groupedCells[cell.col] || [];
      groupedCells[cell.row][cell.col] = cell;

      return groupedCells;
    }, []);
  }

  async function slideTiles(groupedCells) {
    const promises = [];

    groupedCells.forEach((group) => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    cells.forEach((cell) => cell.linkedTileForMerge && mergeTiles(cell));
  }

  function slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) {
      if (!group[i].linkedTile) {
        continue;
      }

      const cellWithTile = group[i];
      let targetCell = {};
      let j = i - 1;

      while (j >= 0 && canAccept(group[j], cellWithTile.linkedTile)) {
        targetCell = group[j];
        j--;
      }

      if (Object.keys(targetCell).length === 0) {
        continue;
      }

      promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

      if (!targetCell.linkedTile) {
        linkTile(cellWithTile.linkedTile, targetCell);
      } else {
        linkTileForMerge(cellWithTile.linkedTile, targetCell);
      }

      unlinkTile(cellWithTile);
    }
  }

  function mergeTiles(cell) {
    cell.linkedTile.setValue(
      cell.linkedTile.value + cell.linkedTileForMerge.value,
    );
    cell.linkedTileForMerge.removeFromDom();
    unlinkTileForMerge(cell);
  }

  gameButton.addEventListener('click', function (e) {
    if (e.target.matches('.start') && game.getStatus() === 'idle') {
      game.start();
      renderBoard();

      messageStart.classList.add('hidden');
    } else if (e.target.matches('.restart')) {
      game.restart();
      clearBoard();

      scoreElement.textContent = game.getScore();
      e.target.classList.remove('restart');
      e.target.classList.add('start');
      e.target.textContent = 'Start';
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageStart.classList.remove('hidden');
    }
    setupInputOnce();
  });

  themeSwitcher.addEventListener('click', function () {
    const body = document.querySelector('.body');
    const themeLight = document.querySelector('.theme-switcher__light');
    const themeDark = document.querySelector('.theme-switcher__dark');
    const fieldCells = gameField.querySelectorAll('.field-cell');

    if (body.matches('.body--light-theme')) {
      body.classList.remove('body--light-theme');
      body.classList.add('body--dark-theme');
      themeLight.classList.remove('active');
      themeDark.classList.add('active');
      gameField.classList.add('dark-theme');
      [...fieldCells].forEach((cell) => cell.classList.add('dark-theme'));
    } else {
      body.classList.add('body--light-theme');
      body.classList.remove('body--dark-theme');
      themeLight.classList.add('active');
      themeDark.classList.remove('active');
      gameField.classList.remove('dark-theme');
      [...fieldCells].forEach((cell) => cell.classList.remove('dark-theme'));
    }
  });

  function handleTouchButton(button, key) {
    button.addEventListener('click', () => {
      const ev = new KeyboardEvent('keydown', { key });

      handleInput(ev);
      setupInputOnce();
    });
  }

  handleTouchButton(buttonUp, 'ArrowUp');
  handleTouchButton(buttonDown, 'ArrowDown');
  handleTouchButton(buttonLeft, 'ArrowLeft');
  handleTouchButton(buttonRight, 'ArrowRight');

  function setupInputOnce() {
    window.addEventListener('keydown', handleInput, { once: true });
  }

  async function handleInput(ev) {
    ev.preventDefault();

    if (game.getStatus() === 'playing') {
      switch (ev.key) {
        case 'ArrowUp':
          game.moveUp();
          await slideTiles(cellsGroupedByColumn);
          break;
        case 'ArrowDown':
          game.moveDown();
          await slideTiles(cellsGroupedByReversedColumn);
          break;
        case 'ArrowLeft':
          game.moveLeft();
          await slideTiles(cellsGroupedByRow);
          break;
        case 'ArrowRight':
          game.moveRight();
          await slideTiles(cellsGroupedByReversedRow);
          break;

        default:
          return setupInputOnce();
      }
      setupInputOnce();

      gameButton.classList.remove('start');
      gameButton.classList.add('restart');
      gameButton.textContent = 'Restart';
    }
    renderBoard();

    if (scoreElement) {
      scoreElement.textContent = game.getScore();
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    }

    setupInputOnce();
  }
});
