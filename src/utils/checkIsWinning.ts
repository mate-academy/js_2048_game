import { Board } from '../types/Board';

export const checkIsWinning = (board: Board) => {
  return board.some((row) => {
    return row.some((cell) => cell.value === 2048);
  });
};
