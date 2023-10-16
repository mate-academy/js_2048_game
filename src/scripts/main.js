'use strict';

import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard);

console.log(grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

function setupInput() {
  window.addEventListener('keydown', handleInput, {once: true})
}

function handleInput(e) {
  switch(e.key) {
    case 'ArrowUp':
      moveUp()
      break

    case 'ArrowDown':
      moveDown()
      break

    case 'ArrowLeft':
      moveLeft()
      break

    case 'ArrowRight':
      moveRight()
      break

    default:
      break
  }
}
