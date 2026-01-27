export function slide(filteredRow) {
  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
    }
  }

  const result = filteredRow.filter((v) => v !== 0);

  // TODO: make constant for row length or find the way to extract it
  while (result.length < 4) {
    result.push(0);
  }

  return result;
}

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
