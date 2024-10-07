import {
  DEFAULT_NUM_2,
  DEFAULT_NUM_4,
  FIELD_ROW_MAX_IDX,
  FIELD_ROW_MIN_IDX,
  NUMBER_PROBABILITY_ARRAY_LENGTH,
  FIELD_ROW_LENGTH,
  VALUE_2048,
} from './constants';

export const generateCellValue = () => {
  const numbers = Array.from(
    { length: NUMBER_PROBABILITY_ARRAY_LENGTH },
    (_, idx) => {
      if (idx === NUMBER_PROBABILITY_ARRAY_LENGTH - 1) {
        return DEFAULT_NUM_4;
      }

      return DEFAULT_NUM_2;
    },
  );

  return numbers[Math.floor(Math.random() * NUMBER_PROBABILITY_ARRAY_LENGTH)];
};

export const generateRandomNumber = () =>
  Math.floor(
    Math.random() * (FIELD_ROW_MAX_IDX - FIELD_ROW_MIN_IDX + 1) +
      FIELD_ROW_MIN_IDX,
  );

export const generateRandomPosition = ({ field, exclude = [] }) => {
  const [excludeX, excludeY] = exclude;

  const positionX = generateRandomNumber();
  const positionY = generateRandomNumber();

  const isExcluded = positionX === excludeX && positionY === excludeY;
  const isOccupied = !!field[positionY][positionX];

  if (isExcluded || isOccupied) {
    return generateRandomPosition({ field, exclude });
  }

  return [positionX, positionY];
};

export const mergeCells = (row) => {
  const rowCopy = [...row];
  let counter = 0;
  let is2048 = false;

  for (let idx = 0; idx < rowCopy.length; idx++) {
    if (rowCopy[idx] === rowCopy[idx + 1]) {
      const mergedSum = rowCopy[idx] * 2;

      is2048 = mergedSum === VALUE_2048;

      counter += mergedSum;
      rowCopy[idx] = mergedSum;
      rowCopy[idx + 1] = 0;
    }
  }

  return { row: rowCopy, counter, is2048 };
};

export const filterZeros = (row) => {
  return row.filter((num) => !!num);
};

export const addLackingZeros = (row) => {
  const diff = 4 - row.length;
  const zerosArray = Array.from({ length: diff }, () => 0);

  return row.concat(zerosArray);
};

export const rotateFieldForward = (inputBoard) => {
  const outputBoard = Array.from({ length: FIELD_ROW_LENGTH }, () => []);

  for (let i = 0; i < FIELD_ROW_LENGTH; i++) {
    inputBoard.forEach((_el, idx) => {
      outputBoard[FIELD_ROW_LENGTH - 1 - idx][i] = inputBoard[i][idx];
    });
  }

  return outputBoard;
};

export const rotateFieldBackward = (inputBoard) => {
  const outputBoard = Array.from({ length: FIELD_ROW_LENGTH }, () => []);

  for (let i = 0; i < FIELD_ROW_LENGTH; i++) {
    inputBoard.forEach((_el, idx) => {
      outputBoard[idx][FIELD_ROW_LENGTH - 1 - i] = inputBoard[i][idx];
    });
  }

  return outputBoard;
};

export const horizontalShift = ({ field, rtl = false } = {}) => {
  let sum = 0;
  let isWinner = false;
  let wasChanged = false;

  for (let i = 0; i < field.length; i++) {
    const row = rtl ? field[i].reverse() : field[i];

    const firstStageFilteredRow = filterZeros(row);

    const {
      row: mergedCellsRow,
      counter,
      is2048,
    } = mergeCells(firstStageFilteredRow);

    sum += counter;
    isWinner = is2048;

    const secondStageFilteredRow = filterZeros(mergedCellsRow);
    const modifiedRow = addLackingZeros(secondStageFilteredRow);

    wasChanged = !wasChanged
      ? row.some((el, idx) => el !== modifiedRow[idx])
      : wasChanged;

    field[i] = rtl ? modifiedRow.reverse() : modifiedRow;
  }

  return {
    field,
    score: sum,
    isWinner,
    wasChanged,
  };
};

export const verticalShift = ({ field, rtl = false }) => {
  let rotatedBoard = rotateFieldForward(field);

  const { score, isWinner, wasChanged } = horizontalShift({
    field: rotatedBoard,
    rtl,
  });

  rotatedBoard = rotateFieldBackward(rotatedBoard);

  return {
    field: rotatedBoard,
    score,
    isWinner,
    wasChanged,
  };
};
