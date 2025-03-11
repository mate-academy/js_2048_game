'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Tile } from '../modules/Tile.class.js';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const btnStartRestart = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgLose = document.querySelector('.message-lose');
const msgWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

let tiles;
let tilesActive;
let tilesMerged;

let promisesAfterShift;
let promisesAfterMerge;

function changeStartToRestart() {
  btnStartRestart.textContent = 'Restart';
  btnStartRestart.classList.remove('start');
  btnStartRestart.classList.add('restart');
}

function changeRestartToStart() {
  btnStartRestart.textContent = 'Start';
  btnStartRestart.classList.remove('restart');
  btnStartRestart.classList.add('start');
}

function removeTiles(arrayTiles) {
  if (!arrayTiles.length) {
    return;
  }

  arrayTiles.forEach((tile) => tile.remove());

  return arrayTiles;
}

setupClickOnce();

function setupClickOnce() {
  btnStartRestart.addEventListener('click', handleClick, { once: true });
}

function handleClick() {
  if (btnStartRestart.classList.contains('start') && game.status === 'idle') {
    msgStart.classList.add('hidden');
    game.start();

    tiles = game.tiles.map((elem) => new Tile(elem, gameField).elementTile);
  } else {
    if (
      btnStartRestart.classList.contains('restart') &&
      game.status !== 'idle'
    ) {
      if (game.status === 'lose') {
        msgLose.classList.add('hidden');
      }

      if (game.status === 'win') {
        msgWin.classList.add('hidden');
      }

      msgStart.classList.toggle('hidden');
      changeRestartToStart();
      game.restart();

      removeTiles(tiles);
      gameScore.textContent = game.score;
    }
  }

  setupClickOnce();
}

async function makeMove(direct = 'row') {
  if (!game.changeAfterMove) {
    return;
  }

  const startIndex =
    direct === 'row' ? Tile.START_INDEX_OF_COLUMN : Tile.START_INDEX_OF_ROW;

  const endIndex =
    direct === 'row' ? Tile.END_INDEX_OF_COLUMN : Tile.END_INDEX_OF_ROW;

  tiles = groupTilesByColumnsOrRows(startIndex, endIndex).flat();
  await moveTiles(direct);
}

function groupTilesByColumnsOrRows(start, end) {
  const tilesGrouped = [];

  for (let line = 0; line < 4; line++) {
    tilesGrouped.push(
      tiles.filter((tile) => +Tile.getNumberOfLine(tile, start, end) === line),
    );
  }

  return tilesGrouped;
}

async function moveTiles(direct = 'row') {
  promisesAfterShift = [];
  promisesAfterMerge = [];

  shiftTiles(direct);

  await Promise.all(promisesAfterShift);
  mergeTilesAndAddNewOne(direct);
}

function shiftTiles(direct = 'row') {
  return tiles.forEach((tile, i) => {
    justShiftTiles(tile, game.tilesAfterShift, i, direct);
  });
}

function justShiftTiles(elemTile, elem, i, direct) {
  const prevCrdDirect = getPrevCoord(elemTile, direct);
  const crdDirect = getCurrentCoord(elem, i, direct);

  if (+prevCrdDirect !== crdDirect) {
    waitForTransitionEnd(elemTile);

    elemTile.id = getTileId(elem, i);
    elemTile.classList.remove(`tile--${direct}--${prevCrdDirect}`);
    elemTile.classList.add(`tile--${direct}--${crdDirect}`);
  }
}

function getPrevCoord(elem, direct = 'row') {
  return direct === 'row'
    ? Tile.getNumberOfRow(elem)
    : Tile.getNumberOfColumn(elem);
}

function getCurrentCoord(elem, i, direct = 'row') {
  return direct === 'row' ? elem[i].coordRow : elem[i].coordColumn;
}

function waitForTransitionEnd(elem) {
  return promisesAfterShift.push(
    new Promise((resolve) => {
      Tile.setTransitionEnd(elem, resolve);
    }),
  );
}

function getTileId(elem, i) {
  return elem[i].coordRow + '-' + elem[i].coordColumn;
}

async function mergeTilesAndAddNewOne(direct = 'row') {
  tilesMerged = getTilesMerged();
  tilesActive = getTilesActive();

  mergeTiles(direct);

  await Promise.all(promisesAfterMerge);
  actAfterMerge();
}

function getTilesMerged() {
  return tiles.filter((tile, i) => {
    if (!game.mergeAndActiveTiles[i]) {
      return tile;
    }
  });
}

function getTilesActive() {
  return tiles.filter((tile, i) => {
    if (game.mergeAndActiveTiles[i]) {
      return tile;
    }
  });
}

function mergeTiles(direct = 'row') {
  if (tilesMerged.length === 0) {
    return;
  }

  tilesActive.forEach((tile, i) => {
    justShiftTiles(tile, game.tilesActive, i, direct);
    justMergeTiles(tile, game.tilesActive, i);
  });
}

function justMergeTiles(elemTile, elem, i) {
  const valueTile = elem[i].value;

  if (elemTile.textContent !== valueTile) {
    const prevValue = elemTile.textContent;

    elemTile.textContent = valueTile;
    elemTile.classList.remove(`tile--${prevValue}`);
    elemTile.classList.add(`tile--${valueTile}`);
  }
}

function actAfterMerge() {
  removeTiles(tilesMerged);

  addTileAfterMove(game.randomCell);

  tiles = [...document.querySelectorAll('.tile')];

  sortTiles();
}

function addTileAfterMove(elem) {
  return new Tile(elem, gameField).elementTile;
}

function sortTiles() {
  return tiles.sort((tile1, tile2) => {
    const numCell1 = Tile.getNumberOfCell(tile1);
    const numCell2 = Tile.getNumberOfCell(tile2);

    return numCell1 - numCell2;
  });
}

setupKeyDownOnce();

function setupKeyDownOnce() {
  document.addEventListener('keydown', handleKeyDown, { once: true });
}

async function handleKeyDown(e) {
  tilesMerged = [];
  tilesActive = [];

  switch (game.status) {
    case 'idle':
      break;
    case 'playing':
      if (btnStartRestart.classList.contains('start')) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'ArrowUp':
          case 'ArrowDown':
            changeStartToRestart();

            break;

          default:
            setupKeyDownOnce();

            return;
        }
      }

      switch (e.key) {
        case 'ArrowLeft':
          game.moveLeft();

          await makeMove('column');
          break;

        case 'ArrowRight':
          game.moveRight();

          await makeMove('column');
          break;

        case 'ArrowUp':
          game.moveUp();

          await makeMove();

          break;

        case 'ArrowDown':
          game.moveDown();

          await makeMove();
          break;

        default:
          setupKeyDownOnce();

          return;
      }

      break;
  }
  gameScore.textContent = game.score;

  switch (game.getStatus()) {
    case 'lose':
      msgLose.classList.remove('hidden');

      break;

    case 'win':
      msgWin.classList.remove('hidden');

      break;

    default:
      break;
  }

  setupKeyDownOnce();
}
