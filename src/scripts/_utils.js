import { newTiles } from './modules/board.js';

/**
 * Creates and appends a tile to the game board.
 *
 * Given a row, column, and value, this function creates a new DOM element
 * to represent a tile. It then attaches the appropriate classes and
 * sets its text content. If the tile is flagged as 'new', an animation
 * will be triggered, and the 'new' flag will be reset after 300ms.
 *
 * @param {number} row - The row number where the tile should be placed.
 * @param {number} col - The column number where the tile should be placed.
 * @param {number} value - The numerical value of the tile.
 * @sideEffects Modifies the DOM by appending a tile and
 * sets a timeout for tile animations.
 */

export function createTile(row, col, value) {
  newTiles[row][col] = true;

  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.classList.add(`tile--${value}`);

  if (newTiles[row][col]) {
    tile.classList.add('tile--new');
  }

  tile.textContent = value;

  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);

  cell.appendChild(tile);

  setTimeout(() => {
    tile.classList.remove('tile--new');
    newTiles[row][col] = false; // Reset the new tile flag
  }, 300);
}
