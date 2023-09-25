import { board } from './board.js';
import { addScore } from './scoreManager.js';

/**
 * Moves tiles on the board to the left. The function loops through
 * each row of the board, attempting to move each tile as far left as
 * possible. If a tile has an adjacent tile to its left with the same
 * value, they are merged together, their values are summed, and the
 * resulting tile is placed to the leftmost position of the two.
 *
 * If any tile is moved or merged, the function sets the `moved` flag
 * to `true`. After iterating through all rows and columns, the function
 * returns the `moved` flag, indicating whether any tiles were moved
 * or merged.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *                      otherwise, `false`.
 *
 * @sideEffects - Modifies the state of the 'board' variable and may
 *                update the game's score if any tiles are merged.
 */

export function moveLeft() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let row = 0; row < 4; row++) {
    let emptyCol = 0;

    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        continue;
      };

      if (emptyCol !== col) {
        board[row][emptyCol] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyCol !== 0
        && board[row][emptyCol] === board[row][emptyCol - 1]
      ) {
        const mergedValue = board[row][emptyCol - 1] * 2;

        board[row][emptyCol - 1] = mergedValue;
        board[row][emptyCol] = 0;
        totalCombinedValue += mergedValue;

        moved = true;
      } else {
        emptyCol++;
      }
    }
  }

  if (totalCombinedValue > 0) {
    setTimeout(() => {
      addScore(totalCombinedValue);
    }, 100);
  }

  return moved;
}

/**
 * Moves tiles on the board to the right, following the same mechanics
 * as `moveLeft()`. The primary difference is in the direction of movement.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *                      otherwise, `false`.
 *
 * @sideEffects - Modifies the state of the 'board' variable and may
 *                update the game's score if any tiles are merged.
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
        board[row][emptyCol] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      // Merge tiles if they are the same and next to each other
      if (
        emptyCol !== 3
        && board[row][emptyCol] === board[row][emptyCol + 1]
      ) {
        const mergedValue = board[row][emptyCol + 1] * 2;

        board[row][emptyCol + 1] = mergedValue;
        board[row][emptyCol] = 0;
        totalCombinedValue += mergedValue;

        moved = true;
      } else {
        emptyCol--;
      }
    }
  }

  if (totalCombinedValue > 0) {
    setTimeout(() => {
      addScore(totalCombinedValue);
    }, 100);
  }

  return moved;
}

/**
 * Moves tiles on the board upwards.
 * This function works by traversing each column and moving the tiles upward,
 * combining them if they are of the same value.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *                      otherwise, `false`.
 *
 * @sideEffects - Modifies the state of the 'board' variable and may
 *                update the game's score if any tiles are merged.
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
        board[emptyRow][col] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyRow !== 0
        && board[emptyRow][col] === board[emptyRow - 1][col]
      ) {
        const mergedValue = board[emptyRow - 1][col] * 2;

        board[emptyRow - 1][col] = mergedValue;
        board[emptyRow][col] = 0;
        totalCombinedValue += mergedValue;
        moved = true;
      } else {
        emptyRow++;
      }
    }
  }

  if (totalCombinedValue > 0) {
    setTimeout(() => {
      addScore(totalCombinedValue);
    }, 100);
  }

  return moved;
}

/**
 * Moves tiles on the board downwards.
 * This function works by traversing each column and moving the tiles downward,
 * combining them if they are of the same value.
 * The logic is similar to `moveUp()`, but the traversal order is reversed.
 *
 * @returns {boolean} - Returns `true` if any tile was moved or merged;
 *                      otherwise, `false`.
 *
 * @sideEffects - Modifies the state of the 'board' variable and may
 *                update the game's score if any tiles are merged.
 */

export function moveDown() {
  let moved = false;
  let totalCombinedValue = 0;

  for (let col = 0; col < 4; col++) {
    let emptyRow = 3;

    for (let row = 3; row >= 0; row--) {
      if (board[row][col] === 0) {
        continue;
      };

      if (emptyRow !== row) {
        board[emptyRow][col] = board[row][col];
        board[row][col] = 0;
        moved = true;
      }

      if (
        emptyRow !== 3
        && board[emptyRow][col] === board[emptyRow + 1][col]
      ) {
        const mergedValue = board[emptyRow + 1][col] * 2;

        board[emptyRow + 1][col] = mergedValue;
        board[emptyRow][col] = 0;
        totalCombinedValue += mergedValue;

        moved = true;
      } else {
        emptyRow--;
      }
    }
  }

  if (totalCombinedValue > 0) {
    setTimeout(() => {
      addScore(totalCombinedValue);
    }, 100);
  }

  return moved;
};
