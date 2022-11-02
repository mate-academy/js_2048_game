import Grid from './Grid.js';
import Tile from './Tile.js';
import { canMove, slideTiles } from './slideTiles.js';

const gameBoard = document.querySelector('#game-board');

const fieldSize = [4, 5, 6, 7];

const selectFieldSize = `
  <label for="select-size" style="text-align: center">
    In original game, you played on a 4x4 field,
    but in this version the field can be increased. ${'&#128521;'} Try it!!!
  </label>
  <select class="select-size">
      ${fieldSize.map(size =>
    `<option value="${size}">${size} x ${size}</option>`).join('')}
  </select>
`;

document.body.insertAdjacentHTML('afterbegin', selectFieldSize);

const selectElement = document.querySelector('.select-size');

let grid;
let gridSize = 4;
let cellSize = 20;
let cellGap = 1.5;
let fontSize = 7.5;

selectElement.addEventListener('change', (e) => {
  gridSize = +e.target.value;
  cellSize = gridSize === 4 ? 20 : 20 - gridSize;
  cellGap = gridSize === 4 ? 1.5 : 0.75;
  fontSize = gridSize === 4 ? 7.5 : 7.5 - gridSize + 4;
  grid = new Grid(gameBoard, gridSize, cellSize, cellGap, fontSize);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  selectElement.disabled = true;
});

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
    }, 150);
  });

  grid.randomEmptyCell().tile = new Tile(gameBoard);
}
