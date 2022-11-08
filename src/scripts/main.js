import Grid from './Grid.js';
import Tile from './Tile.js';
import { canMove, slideTiles } from './slideTiles.js';

const gameBoard = document.querySelector('#game-board');
const selectElement = document.querySelector('.select-size');
const scoreCurrentContainer = document.querySelector('.score--current');
const scoreBestContainer = document.querySelector('.score--best');

const modal = document.querySelector('.modal-container');
const lose = document.querySelector('.modal-lose');
const win = document.querySelector('.modal-win');

// restart button & modal button
const buttons = document.querySelectorAll('.button');

// starting values for game board

let score = 0;
let bestScore = 0;

let grid;
let gridSize = 4;
let cellSize = 20;
let cellGap = 1.5;
let fontSize = 7;

// innitial game board on page
function loadGame() {
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  grid = new Grid(gameBoard, gridSize, cellSize, cellGap, fontSize);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  gameBoard.style.opacity = 1;
  score = 0;
  scoreCurrentContainer.textContent = 0;
  modal.style.display = 'none';
  document.addEventListener('keydown', handleInput); // keyboard event
  document.addEventListener('touchmove', handleTouchMove, false); // touch event
};

loadGame();

// adding events on reloading buttons
buttons.forEach(button => button.addEventListener('click', loadGame));

// user can select another field for the game
selectElement.addEventListener('change', (e) => {
  gridSize = +e.target.value;
  cellSize = gridSize === 4 ? 20 : 20 - gridSize;
  cellGap = gridSize < 6 ? 1.5 : 0.75;
  fontSize = gridSize < 6 ? 7 : 5;
  loadGame();
});

// function for keyboard events
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
    default:
      return;
  }

  mergeAndAddRandom();

  if (checkLose()) {
    openModal();
  }
}

// functions for touch events
document.addEventListener('touchstart', handleTouchStart, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return evt.touches;
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

  if (checkLose()) {
    openModal();
  }

  xDown = null;
  yDown = null;
};

// function to merge tile and add random tiles to the gameboard

function mergeAndAddRandom() {
  grid.cells.forEach(cell => {
    setTimeout(() => {
      const scoreCurrent = cell.mergeTiles();

      if (scoreCurrent === 2048) {
        openModal(scoreCurrent);
      }

      score += scoreCurrent;
      scoreCurrentContainer.textContent = score;
      bestScore = bestScore <= score ? score : bestScore;
      scoreBestContainer.textContent = bestScore;
    }, 150);
  });

  grid.randomEmptyCell().tile = new Tile(gameBoard);
}

// check for lose
function checkLose() {
  return !canMove(grid.cellsByRow)
    && !canMove(grid.cellsByRow.map(row => [...row].reverse()))
    && !canMove(grid.cellsByColumn)
    && !canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

// opening modal with win or lose text
function openModal(boolean) {
  const box = boolean ? win : lose;

  modal.style.display = 'flex';
  box.style.display = 'block';
  gameBoard.style.opacity = 0.2;
  document.removeEventListener('keydown', handleInput);
  document.removeEventListener('touchmove', handleTouchMove, false);
}
