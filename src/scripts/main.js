import Grid from './Grid.js';
import Tile from './Tile.js';
import { canMove, slideTiles } from './slideTiles.js';

const gridSize = 4;
const cellSize = 20;
const cellGap = 1.5;
const fontSize = 7.5;

const gameBoard = document.querySelector('#game-board');

const grid = new Grid(gameBoard, gridSize, cellSize, cellGap, fontSize);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

window.addEventListener('keydown', handleInput);

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      if (!canMove(grid.cellsByColumn)) {
        return;
      }
      slideTiles(grid.cellsByColumn);
      break;
    case 'ArrowDown':
    case 's':
      if (!canMove(grid.cellsByColumn.map(column => [...column].reverse()))) {
        return;
      }
      slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
      break;
    case 'ArrowLeft':
    case 'a':
      if (!canMove(grid.cellsByRow)) {
        return;
      }
      slideTiles(grid.cellsByRow);
      break;
    case 'ArrowRight':
    case 'd':
      if (!canMove(grid.cellsByRow.map(row => [...row].reverse()))) {
        return;
      }
      slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
      break;
  }

  mergeAndAddRandom();
}

// ------------- for swiping ----------- //

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches; // browser API || jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];

  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      if (!canMove(grid.cellsByRow)) {
        return;
      }
      slideTiles(grid.cellsByRow);
    } else {
      if (!canMove(grid.cellsByRow.map(row => [...row].reverse()))) {
        return;
      }
      slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
    }
  } else {
    if (yDiff > 0) {
      if (!canMove(grid.cellsByColumn)) {
        return;
      }
      slideTiles(grid.cellsByColumn);
    } else {
      if (!canMove(grid.cellsByColumn.map(column => [...column].reverse()))) {
        return;
      }
      slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
    }
  }

  mergeAndAddRandom();
  /* reset values */
  xDown = null;
  yDown = null;
};

function mergeAndAddRandom() {
  grid.cells.forEach(cell => {
    setTimeout(() => {
      cell.mergeTiles();
    }, 100);
  });

  grid.randomEmptyCell().tile = new Tile(gameBoard);
}
