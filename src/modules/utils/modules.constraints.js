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
