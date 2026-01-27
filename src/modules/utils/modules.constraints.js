/* eslint-disable curly */
export const amountOfRows = 4;

export function turnBoard(board) {
  const rowsList = [];

  for (let i = 0; i < board.length; i++) {
    rowsList.push([]);

    for (let j = 0; j < board[i].length; j++) {
      rowsList[i][j] = board[j][i];
    }
  }

  return rowsList;
}

export function filterBoard(board) {
  return board.map((v) => v.filter((dv) => dv !== 0));
}

export function filterBoardReverse(board) {
  return board.map((v) => v.filter((dv) => dv !== 0).reverse());
}

export function checkGameStatus(board) {
  let win = false;
  let playing = false;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 2048) {
        win = true;
      }

      if (
        board[i][j] === board[i][j + 1] ||
        board[i][j] === board[i + 1]?.[j] ||
        board[i][j] === 0
      ) {
        playing = true;
      }
    }
  }

  if (win) return 'win';
  if (playing) return 'playing';

  return 'loose';
}
