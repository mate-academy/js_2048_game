import { createTile } from '../_utils.js';
import * as UIManager from './UIManager.js';
import { board, updateBoardDOM } from './board.js';
import * as BoardModule from './board.js';
import { resetScore, updateScoreDisplay } from './scoreManager.js';
import * as GameState from './gameState.js';

export function startGame() {
  BoardModule.resetBoard();
  resetScore();
  populateRandomCell();
  populateRandomCell();
  updateBoardDOM();
  updateScoreDisplay();
  UIManager.hideMessages();
}

/**
 * Finds an empty cell in the game board and populates it with a new tile.
 *
 * This function scans the entire game board looking for empty cells.
 * It then randomly selects one of these empty cells and populates it
 * with a new tile. The new tile will have a value of either 2 (90% chance)
 * or 4 (10% chance).
 *
 * @sideEffects Modifies the state of the 'board' variable
 * and updates the DOM with a new tile.
 */

export function populateRandomCell() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const [randRow, randCol]
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    board[randRow][randCol] = value;
    createTile(randRow, randCol, value);
  }
}

/**
 * Checks the game board to see if the player has achieved the 2048 tile.
 *
 * If a cell with the value 2048 is found, the game is considered won.
 * A winning message is then displayed, and the game is marked as over.
 *
 * @sideEffects Potentially modifies the DOM by revealing the win message
 * and changes the state of 'gameOver'.
 */

export function checkForWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 2048) {
        const messageWin = document.querySelector('.message-win');

        messageWin.classList.remove('hidden');
        GameState.setGameOver(true);
      }
    }
  }
}

/**
 * Checks if the game is over by evaluating if there are no more
 * valid moves left on the board. The function performs the following checks:
 * 1. If there are any empty cells (cells with a value of 0).
 * 2. If there are any vertically adjacent cells with the same value.
 * 3. If there are any horizontally adjacent cells with the same value.
 *
 * If any of the above conditions are met, the game is not over and
 * the function returns `false`. If none of the conditions are met,
 * it displays a loss message and returns `true`, indicating the game is over.
 *
 * @returns {boolean} - Returns `true` if the game is over; otherwise, `false`.
 *
 * @sideEffects - If the game is over, it modifies the DOM by showing
 * the loss message.
 */

export function checkForGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return false;
      } // Empty cell found

      if (row < 3 && board[row][col] === board[row + 1][col]) {
        return false;
      } // Vertical match

      if (col < 3 && board[row][col] === board[row][col + 1]) {
        return false;
      } // Horizontal match
    }
  }

  const messageLose = document.querySelector('.message-lose');

  messageLose.classList.remove('hidden');

  GameState.setGameOver(true);

  return true;
}

export function updateAfterMove() {
  populateRandomCell();
  updateBoardDOM();
  updateScoreDisplay();
  checkForWin();
  checkForGameOver();
}
