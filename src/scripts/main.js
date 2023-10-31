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
  keyDown();// keyboard event
  document.addEventListener('touchmove', handleTouchMove, false); // touch event
  document.activeElement.blur();
  gameBoard.focus();
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

function getCol() {
  return grid.cellsByColumn;
}

function getColReverse() {
  return grid.cellsByColumn.map(column => [...column].reverse());
}

function getRow() {
  return grid.cellsByRow;
};

function getRowReverse() {
  return grid.cellsByRow.map(row => [...row].reverse());
};

// function for keyboard events
function handleKeyDown(e) {
  document.removeEventListener('keydown', handleKeyDown);

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      if (!canMove(getCol())) {
        keyDown();

        return;
      }
      slideTiles(getCol());
      break;
    case 'ArrowDown':
    case 's':
      if (!canMove(getColReverse())) {
        keyDown();

        return;
      }
      slideTiles(getColReverse());
      break;
    case 'ArrowLeft':
    case 'a':
      if (!canMove(getRow())) {
        keyDown();

        return;
      }
      slideTiles(getRow());
      break;
    case 'ArrowRight':
    case 'd':
      if (!canMove(getRowReverse())) {
        keyDown();

        return;
      }
      slideTiles(getRowReverse());
      break;
    default:
      return;
  }

  setTimeout(() => {
    mergeAndAddRandom();

    if (checkLose()) {
      openModal();
    }

    keyDown();
  }, 100);
}

// function to add key down event
function keyDown() {
  return document.addEventListener('keydown', handleKeyDown);
}

// function to merge tile and add random tiles to the gameboard
function mergeAndAddRandom() {
  grid.cells.forEach(cell => {
    const scoreCurrent = cell.mergeTiles();

    if (scoreCurrent === 2048) {
      openModal(scoreCurrent);
    }

    score += scoreCurrent;
    scoreCurrentContainer.textContent = score;
    bestScore = bestScore <= score ? score : bestScore;
    scoreBestContainer.textContent = bestScore;
  });

  grid.randomEmptyCell().tile = new Tile(gameBoard);
}

// check for lose
function checkLose() {
  return !canMove(getRow())
    && !canMove(getRowReverse())
    && !canMove(getCol())
    && !canMove(getColReverse());
}

// opening modal with win or lose text
function openModal(boolean) {
  const box = boolean ? win : lose;

  modal.style.display = 'flex';
  box.style.display = 'block';
  gameBoard.style.opacity = 0.2;
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('touchmove', handleTouchMove, false);
}

// functions to handle touch events
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
      if (!canMove(getRow())) {
        return;
      }
      slideTiles(getRow());
    } else {
      if (!canMove(getRowReverse())) {
        return;
      }
      slideTiles(getRowReverse());
    }
  } else {
    if (yDiff > 0) {
      if (!canMove(getCol())) {
        return;
      }
      slideTiles(getCol());
    } else {
      if (!canMove(getColReverse())) {
        return;
      }
      slideTiles(getColReverse());
    }
  }

  setTimeout(() => {
    mergeAndAddRandom();

    if (checkLose()) {
      openModal();
    }
  }, 100);

  xDown = null;
  yDown = null;
};
