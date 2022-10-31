import Grid from './Grid.js';
import Tile from './Tile.js';
import { moveDown, moveLeft, moveRight, moveUp } from './move.js';

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
      moveUp(grid.cellsByColumn);
      break;
    case 'ArrowDown':
    case 's':
      moveDown(grid.cellsByColumn.map(column => [...column].reverse()));
      break;
    case 'ArrowLeft':
    case 'a':
      moveLeft(grid.cellsByRow);
      break;
    case 'ArrowRight':
    case 'd':
      moveRight(grid.cellsByRow.map(row => [...row].reverse()));
      break;
  }

  grid.cells.forEach(cell => {
    cell.mergeTiles();
  });

  grid.randomEmptyCell().tile = new Tile(gameBoard);
}
