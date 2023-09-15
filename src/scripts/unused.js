/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function moveUp() {
  for (let col = 0; col < 4; col++) {
    const currentCol = [];

    // Extract the current column from the board
    for (let row = 0; row < 4; row++) {
      currentCol.push(board[row][col]);
    }

    // Filter out zeros and keep non-zero numbers
    const filteredCol = currentCol.filter(num => num !== 0);
    const mergedCol = [];

    for (let row = 0; row < filteredCol.length; row++) {
      if (
        row < filteredCol.length - 1
        && filteredCol[row] === filteredCol[row + 1]
      ) {
        mergedCol.push(filteredCol[row] * 2);
        row++; // Skip the next element
      } else {
        mergedCol.push(filteredCol[row]);
      }
    }

    const missing = 4 - mergedCol.length;
    const newCol = mergedCol.concat(Array(missing).fill(0));

    // Update the board with the new column
    for (let row = 0; row < 4; row++) {
      board[row][col] = newCol[row];
    }
  }
}

function moveRight() {
  for (let row = 0; row < 4; row++) {
    const currentRow = board[row];
    // Filter out zeros and keep non-zero numbers
    const filteredRow = currentRow.filter(num => num !== 0);
    const mergedRow = [];

    // Start from the last element, as we are moving to the right
    for (let column = filteredRow.length - 1; column >= 0; column--) {
      // Merge identical numbers and move to the next element
      if (column > 0 && filteredRow[column] === filteredRow[column - 1]) {
        mergedRow.unshift(filteredRow[column] * 2);
        column--;
      } else {
        mergedRow.unshift(filteredRow[column]);
      }
    }

    const missing = 4 - mergedRow.length;
    const newRow = Array(missing).fill(0).concat(mergedRow);

    board[row] = newRow;
  }
}

function moveDown() {
  for (let col = 0; col < 4; col++) {
    const currentCol = [];

    // Extract the current column from the board
    for (let row = 0; row < 4; row++) {
      currentCol.push(board[row][col]);
    }

    // Reverse for easier manipulation
    currentCol.reverse();

    const filteredCol = currentCol.filter(num => num !== 0);
    const mergedCol = [];

    for (let row = 0; row < filteredCol.length; row++) {
      if (
        row < filteredCol.length - 1
        && filteredCol[row] === filteredCol[row + 1]
      ) {
        mergedCol.push(filteredCol[row] * 2);
        row++; // Skip the next element
      } else {
        mergedCol.push(filteredCol[row]);
      }
    }

    const missing = 4 - mergedCol.length;
    const newCol = mergedCol.concat(Array(missing).fill(0));

    // Reverse back to original orientation
    newCol.reverse();

    // Update the board with the new column
    for (let row = 0; row < 4; row++) {
      board[row][col] = newCol[row];
    }
  }
}

function moveLeft() {
  for (let row = 0; row < 4; row++) {
    const currentRow = board[row];
    const filteredRow = currentRow.filter(num => num !== 0);
    const mergedRow = [];

    for (let col = 0; col < filteredRow.length; col++) {
      // Merge identical numbers and move to the next element
      if (
        col < filteredRow.length - 1
        && filteredRow[col] === filteredRow[col + 1]
      ) {
        mergedRow.push(filteredRow[col] * 2);
        col++;
      } else {
        mergedRow.push(filteredRow[col]);
      }
    }

    const missing = 4 - mergedRow.length;
    const newRow = mergedRow.concat(Array(missing).fill(0));

    board[row] = newRow;
  }
};

// check for empy cells

function hasEmptyCells(input) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
};
