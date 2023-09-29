import { newTiles, board } from './modules/board.js';

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

/**
 * Moves a tile from a specified position to another on the board.
 *
 * @param {number} fromRow - The row index of the tile to move.
 * @param {number} fromCol - The column index of the tile to move.
 * @param {number} toRow - The row index to move the tile to.
 * @param {number} toCol - The column index to move the tile to.
 * @sideEffects - Modifies the state of the 'board' variable.
 */

export function moveTile(fromRow, fromCol, toRow, toCol) {
  board[toRow][toCol] = board[fromRow][fromCol];
  board[fromRow][fromCol] = 0;
}

/**
 * Checks if a merge is possible between two specified positions on the board.
 *
 * @param {number} row - The row index of the first tile.
 * @param {number} col - The column index of the first tile.
 * @param {number} mergeRow - The row index of the second tile.
 * @param {number} mergeCol - The column index of the second tile.
 * @returns {boolean} - Returns `true` if a merge is possible;
 *    otherwise, `false`.
 */

export function canMerge(row, col, mergeRow, mergeCol) {
  return (
    board[row][col] !== 0 && board[row][col] === board[mergeRow][mergeCol]
  );
}

/**
 * Merges two tiles at specified positions on the board.
 * The resulting tile will be placed at the position of the second tile,
 * and its value will be the sum of the two merged tiles.
 *
 * @param {number} row - The row index of the first tile.
 * @param {number} col - The column index of the first tile.
 * @param {number} mergeRow - The row index of the second tile.
 * @param {number} mergeCol - The column index of the second tile.
 * @returns {number} - Returns the value of the merged tile.
 * @sideEffects - Modifies the state of the 'board' variable.
 */

export function mergeTiles(row, col, mergeRow, mergeCol) {
  const mergedValue = board[row][col] * 2;

  board[mergeRow][mergeCol] = mergedValue;
  board[row][col] = 0;

  return mergedValue;
}
