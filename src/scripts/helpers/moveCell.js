
import {
  trs, board, letVariables, score, messageStart, messageWin,
} from '../main';

export const moveCell = (constant, startIndex, endIndex, byRow, addtiton) => {
  const startCell = (byRow)
    ? trs[constant][startIndex]
    : trs[startIndex][constant];
  const endCell = (byRow)
    ? trs[constant][endIndex]
    : trs[endIndex][constant];

  const digit = startCell.innerText;
  const sum = '' + (Number(digit) * 2);

  if (byRow) {
    board[constant][startIndex] = 0;
    board[constant][endIndex] = (addtiton) ? sum : digit;
  } else {
    board[startIndex][constant] = 0;
    board[endIndex][constant] = (addtiton) ? sum : digit;
  }

  if (addtiton) {
    endCell.classList.remove(`field-cell--${digit}`);
    endCell.classList.add(`notAdd`);
    letVariables.emptyCells++;
    score.innerText = Number(score.innerText) + Number(sum);
  }

  endCell.classList.add(`field-cell--${(addtiton) ? sum : digit}`);
  endCell.innerText = `${(addtiton) ? sum : digit}`;

  startCell.classList.remove(`field-cell--${digit}`);
  startCell.innerText = '';

  letVariables.moves++;

  if (endCell.innerText === '2048') {
    messageStart.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
};
