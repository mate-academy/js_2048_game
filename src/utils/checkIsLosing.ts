import { Board } from '../types/Board';
import { hasEmptyCell } from './hasEmptyCell';

export const checkIsLosing = (board: Board) => {
  if (hasEmptyCell(board)) {
    return false;
  }

  // eslint-disable-next-line no-plusplus
  for (let row = 0; row < board.length; row++) {
    // eslint-disable-next-line no-plusplus
    for (let cell = 0; cell < board[row].length - 1; cell++) {
      const isHorizontalCellsSame = board[row][cell].value
      === board[row][cell + 1].value;

      const isVerticalCellsSame = board[cell][row].value
      === board[cell + 1][row].value;

      if (isHorizontalCellsSame || isVerticalCellsSame) {
        return false;
      }
    }
  }

  return true;
};
