import { board } from './board.js';
import { updateScore } from './scoreManager.js';
import { moveTile, mergeTiles, canMerge } from '../_utils.js';

/**
 * Moves tiles on the board to the left.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *    otherwise, `false`.
 * @sideEffects - Modifies the state of the 'board' variable
 *    and may update the game's score if any tiles are merged.
 */

export function moveLeft() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let row = 0; row < 4; row++) {
    let emptyCol = 0;

    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        continue;
      }

      if (emptyCol !== col) {
        moveTile(row, col, row, emptyCol);
        moved = true;
      }

      if (
        emptyCol !== 0 && canMerge(row, emptyCol, row, emptyCol - 1)
      ) {
        totalCombinedValue += mergeTiles(row, emptyCol, row, emptyCol - 1);
        moved = true;
      } else {
        emptyCol++;
      }
    }
  }

  updateScore(totalCombinedValue);

  return moved;
}

/**
 * Moves tiles on the board to the right.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *    otherwise, `false`.
 * @sideEffects - Modifies the state of the 'board' variable
 *    and may update the game's score if any tiles are merged.
 */

export function moveRight() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let row = 0; row < 4; row++) {
    let emptyCol = 3;

    for (let col = 3; col >= 0; col--) {
      if (board[row][col] === 0) {
        continue;
      }

      if (emptyCol !== col) {
        moveTile(row, col, row, emptyCol);
        moved = true;
      }

      if (
        emptyCol !== 3
        && canMerge(row, emptyCol, row, emptyCol + 1)
      ) {
        totalCombinedValue += mergeTiles(row, emptyCol, row, emptyCol + 1);
        moved = true;
      } else {
        emptyCol--;
      }
    }
  }

  updateScore(totalCombinedValue);

  return moved;
}

/**
 * Moves tiles on the board upwards.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *    otherwise, `false`.
 * @sideEffects - Modifies the state of the 'board' variable
 *    and may update the game's score if any tiles are merged.
 */

export function moveUp() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let col = 0; col < 4; col++) {
    let emptyRow = 0;

    for (let row = 0; row < 4; row++) {
      if (board[row][col] === 0) {
        continue;
      }

      if (emptyRow !== row) {
        moveTile(row, col, emptyRow, col);
        moved = true;
      }

      if (
        emptyRow !== 0
        && canMerge(emptyRow, col, emptyRow - 1, col)
      ) {
        totalCombinedValue += mergeTiles(emptyRow, col, emptyRow - 1, col);
        moved = true;
      } else {
        emptyRow++;
      }
    }
  }

  updateScore(totalCombinedValue);

  return moved;
}

/**
 * Moves tiles on the board downwards.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *    otherwise, `false`.
 * @sideEffects - Modifies the state of the 'board' variable
 *    and may update the game's score if any tiles are merged.
 */

export function moveDown() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let col = 0; col < 4; col++) {
    let emptyRow = 3; // Start from the bottom row

    for (let row = 3; row >= 0; row--) { // Traverse upwards from the bottom
      if (board[row][col] === 0) {
        continue;
      }

      if (emptyRow !== row) {
        moveTile(row, col, emptyRow, col);
        moved = true;
      }

      if (
        emptyRow !== 3 // Ensure we're not on the bottom-most row
        && canMerge(emptyRow, col, emptyRow + 1, col)
      ) {
        totalCombinedValue += mergeTiles(emptyRow, col, emptyRow + 1, col);
        moved = true;
      } else {
        emptyRow--; // Move the emptyRow pointer upwards for the next iteration
      }
    }
  }

  updateScore(totalCombinedValue);

  return moved;
}

// still having issue with score, maybe consider some async
