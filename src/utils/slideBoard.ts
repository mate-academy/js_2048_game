import { Board } from '../types/Board';
import { Cell } from '../types/Cell';
import { filterZero } from './filterZero';

const handleSlide = (currRow: Cell[]) => {
  let row = filterZero(currRow);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value === row[i + 1].value) {
      row[i].value *= 2;
      row[i + 1].value = 0;
    }
  }

  row = filterZero(row);

  while (row.length < currRow.length) {
    row.push({ key: Math.random(), value: 0 });
  }

  return row;
};

export const handleSlideLeft = (currBoard: Board): Board => {
  const changedBoard = currBoard.map((row) => {
    const slidedRow = handleSlide(row);

    return slidedRow;
  });

  return changedBoard;
};

export const handleSlideRight = (currBoard: Board): Board => {
  const changedBoard = currBoard.map((row) => {
    const reversedRow = [...row].reverse();

    const slidedRow = handleSlide(reversedRow);

    return slidedRow.reverse();
  });

  return changedBoard;
};

export const handleSlideUp = (currBoard: Board): Board => {
  const changedBoard = currBoard;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < changedBoard.length; i++) {
    const column = [
      changedBoard[0][i],
      changedBoard[1][i],
      changedBoard[2][i],
      changedBoard[3][i],
    ];

    const [
      firstColumn,
      secondColumn,
      thirdColumn,
      fourthColumn,
    ] = handleSlide(column);

    changedBoard[0][i] = firstColumn;
    changedBoard[1][i] = secondColumn;
    changedBoard[2][i] = thirdColumn;
    changedBoard[3][i] = fourthColumn;
  }

  return changedBoard;
};

export const handleSlideDown = (currBoard: Board): Board => {
  const changedBoard = currBoard;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < changedBoard.length; i++) {
    const column = [
      changedBoard[0][i],
      changedBoard[1][i],
      changedBoard[2][i],
      changedBoard[3][i],
    ];

    const reversedColumn = [...column].reverse();

    const slidedColumn = handleSlide(reversedColumn);

    slidedColumn.reverse();

    const [firstColumn, secondColumn, thirdColumn, fourthColumn] = slidedColumn;

    changedBoard[0][i] = firstColumn;
    changedBoard[1][i] = secondColumn;
    changedBoard[2][i] = thirdColumn;
    changedBoard[3][i] = fourthColumn;
  }

  return changedBoard;
};
