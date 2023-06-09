import { Board } from '../types/Board';

export const calculateScore = (board: Board) => {
  return board.reduce((totalAcc, row) => {
    return totalAcc + row.reduce((rowAcc, cell) => rowAcc + cell.value, 0);
  }, 0);
};
