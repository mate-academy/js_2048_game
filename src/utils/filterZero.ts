import { Cell } from '../types/Cell';

export const filterZero = (row: Cell[]) => {
  return row.filter((cell) => cell.value !== 0);
};
