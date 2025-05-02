'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const randomNum = (minimun, maximum) => {
  const min = Math.ceil(minimun);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const twoOrFour = () => {
  if (Math.random() < 0.9) {
    return 2;
  } else {
    return 4;
  }
};

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.state = 'idle';
    this.board = initialState || this.createBoard();
  }

  createBoard() {
    const board = [];

    for (let i = 0; i < this.size; i++) {
      const row = [];

      for (let j = 0; j < this.size; j++) {
        row.push(0);
      }

      board.push(row);
    }

    return board;
  }

  updateBoard(rows) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const value = this.board[i][j];

        rows[i].cells[j].innerText = value;

        if (value === 0) {
          rows[i].cells[j].innerText = '';
        }
      }
    }
  }

  checkForChanges(board1, board2) {
    for (let row = 0; row < board1.length; row++) {
      for (let col = 0; col < board1[row].length; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkForLose() {
    const board = this.board;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];

        if (current === 0) {
          return false;
        }

        if (j < 3 && current === board[i][j + 1]) {
          return false;
        }

        if (i < 3 && current === board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  generate() {
    const board = this.board;
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const position = randomNum(0, emptyCells.length);
      const [x, y] = emptyCells[position];

      board[x][y] = twoOrFour();
    }
  }

  combineHorizontally(left, right) {
    const board = this.board;

    for (let i = 0; i < board.length; i++) {
      const row = board[i];

      if (left) {
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] !== 0 && row[j] === row[j + 1]) {
            const combined = row[j] + row[j + 1];

            row[j] = combined;
            row[j + 1] = 0;
          }
        }
      }

      if (right) {
        for (let j = row.length - 1; j > 0; j--) {
          if (row[j] !== 0 && row[j] === row[j - 1]) {
            const combined = row[j] + row[j - 1];

            row[j] = combined;
            row[j - 1] = 0;
          }
        }
      }
    }

    return board;
  }

  combineVertically(up, down) {
    const board = this.board;
    const columns = [];

    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(board[j][i]);
      }

      columns.push(column);
    }

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (up) {
        for (let j = 0; j < column.length - 1; j++) {
          if (column[j] !== 0 && column[j] === column[j + 1]) {
            const combined = column[j] + column[j + 1];

            column[j] = combined;
            column[j + 1] = 0;
          }
        }
      }

      if (down) {
        for (let j = column.length - 1; j > 0; j--) {
          if (column[j] !== 0 && column[j] === column[j - 1]) {
            const combined = column[j] + column[j - 1];

            column[j] = combined;
            column[j - 1] = 0;
          }
        }
      }
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = columns[j][i];
      }
    }
  }

  moveHorizontally(left, right) {
    const board = this.board;

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const filtered = row.filter((value) => value !== 0);

      if (left) {
        while (filtered.length < row.length) {
          filtered.push(0);
        }
      }

      if (right) {
        while (filtered.length < row.length) {
          filtered.unshift(0);
        }
      }

      board[i] = filtered;
    }

    return board;
  }

  moveVertically(up, down) {
    const board = this.board;
    const columns = [];

    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(board[j][i]);
      }

      columns.push(column);
    }

    for (let k = 0; k < columns.length; k++) {
      const column = columns[k];
      const filtered = column.filter((value) => value !== 0);

      while (filtered.length < column.length) {
        if (up) {
          filtered.push(0);
        } else if (down) {
          filtered.unshift(0);
        }
      }

      columns[k] = filtered;
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = columns[j][i];
      }
    }
  }

  getScore(cells) {
    this.score = cells.reduce((acc, curr) => {
      const num = parseInt(curr.innerText);

      return acc + (isNaN(num) ? 0 : num);
    }, 0);

    return this.score;
  }

  start() {
    this.state = 'playing';
    this.score = 0;

    const x1 = randomNum(0, 3);
    let x2 = randomNum(0, 3);
    const y1 = randomNum(0, 3);
    let y2 = randomNum(0, 3);

    while (x1 === x2 && y1 === y2) {
      x2 = randomNum(0, 3);
      y2 = randomNum(0, 3);
    }

    this.board[y1][x1] = twoOrFour();
    this.board[y2][x2] = twoOrFour();
  }

  restart() {
    this.score = 0;
    this.state = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = Game;
