import { Board } from '../types/Board';

export const hasEmptyCell = (board: Board) => {
  return board.some((row) => row.some((cell) => !cell.value));
};
