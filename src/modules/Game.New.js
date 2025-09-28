const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function copyState(state) {
  return state.map((row) => [...row]);
}

function getEmptyCells(board) {
  const cells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        cells.push([i, j]);
      }
    }
  }

  return cells;
}

function addRandomCell(board) {
  const empty = getEmptyCells(board);

  if (empty.length === 0) {
    return;
  }

  const [i, j] = empty[Math.floor(Math.random() * empty.length)];

  board[i][j] = Math.random() < 0.9 ? 2 : 4;
}

function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function moveLineLeft(line) {
  const newLine = line.filter((v) => v !== 0);
  const mergedLine = [];
  let score = 0;

  for (let i = 0; i < newLine.length; i++) {
    if (newLine[i] === newLine[i + 1]) {
      mergedLine.push(newLine[i] * 2);
      score += newLine[i] * 2;
      i++;
    } else {
      mergedLine.push(newLine[i]);
    }
  }

  while (mergedLine.length < 4) {
    mergedLine.push(0);
  }

  return { newLine: mergedLine, score };
}

class Game {
  constructor(initialState = INITIAL_STATE) {
    this.initialState = copyState(initialState);
    this.board = copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return copyState(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = copyState(this.initialState);
    addRandomCell(this.board);
    addRandomCell(this.board);
    this.score = 0;
    this.status = 'playing';
  }

  restart() {
    this.board = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const boardBefore = copyState(this.board);
    let scoreGained = 0;

    let newBoard;

    if (direction === 'left') {
      newBoard = this.board.map((row) => {
        const { newLine, score } = moveLineLeft(row);

        scoreGained += score;

        return newLine;
      });
    } else if (direction === 'right') {
      const reversed = reverseRows(this.board);
      const moved = reversed.map((row) => {
        const { newLine, score } = moveLineLeft(row);

        scoreGained += score;

        return newLine;
      });

      newBoard = reverseRows(moved);
    } else if (direction === 'up') {
      const transposed = transpose(this.board);
      const moved = transposed.map((row) => {
        const { newLine, score } = moveLineLeft(row);

        scoreGained += score;

        return newLine;
      });

      newBoard = transpose(moved);
    } else if (direction === 'down') {
      const transposed = transpose(this.board);
      const reversed = reverseRows(transposed);
      const moved = reversed.map((row) => {
        const { newLine, score } = moveLineLeft(row);

        scoreGained += score;

        return newLine;
      });

      newBoard = transpose(reverseRows(moved));
    } else {
      throw new Error('Invalid move direction');
    }

    if (JSON.stringify(boardBefore) !== JSON.stringify(newBoard)) {
      this.board = newBoard;
      this.score += scoreGained;
      addRandomCell(this.board);
      this.updateStatus();
    }
  }

  moveLeft() {
    this.move('left');
  }
  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    const canMove = this.canMove();

    if (!canMove) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = { Game, INITIAL_STATE, copyState };
