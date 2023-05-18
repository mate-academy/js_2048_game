import { cloneDeep } from 'lodash';
import { Board } from '../types/Board';
import { hasEmptyCell } from './hasEmptyCell';

export const addRandomNumToBoard = (board: Board): Board => {
  if (!hasEmptyCell(board)) {
    return board;
  }

  const boardClone = cloneDeep(board);

  let found = false;

  while (!found) {
    const row = Math.floor(Math.random() * boardClone.length);
    const column = Math.floor(Math.random() * boardClone.length);

    const randomCell = boardClone[row][column];

    const isEmptyCell = randomCell.value === 0;

    if (isEmptyCell) {
      const randomNum = Math.random() <= 0.1 ? 4 : 2;

      randomCell.value = randomNum;
      found = true;
    }
  }

  return boardClone;
};
