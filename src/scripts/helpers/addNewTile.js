
import { letVariables, rows, board, cols, trs } from '../main';

const createTile = (digit, row, col) => {
  trs[row][col].classList.add(`field-cell--${digit}`);
  trs[row][col].innerText = `${digit}`;
  board[row][col] = `${digit}`;
};

const createNewTile = (row, col) => {
  const digit = (Math.random() < 0.1) ? 4 : 2;

  letVariables.emptyCells--;
  createTile(digit, row, col);
};

export const addNewTile = () => {
  while (letVariables.emptyCells >= 1) {
    const row = Math.floor(Math.random() * rows);

    while (board[row].includes(0)) {
      const col = Math.floor(Math.random() * cols);

      if (board[row][col] === 0) {
        return createNewTile(row, col);
      }
    }

    continue;
  }
};
