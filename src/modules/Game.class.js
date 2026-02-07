'use strict';

class Game {
  #board = [];
  #score = 0;
  #status = 'idle';

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.#board = this.initialState.map((r) => [...r]);
  }

  #addRandomTile(state) {
    const flat = state.flat();
    const indexes = [];

    for (let i = 0; i < flat.length; i++) {
      if (flat[i] === 0) {
        indexes.push(i);
      }
    }

    if (indexes.length === 0) {
      return state;
    }

    const randomIndex = indexes[Math.floor(Math.random() * indexes.length)];
    const randomNumber = Math.random() < 0.1 ? 4 : 2;

    const newBoard = state.map((r) => [...r]);
    const row = Math.floor(randomIndex / 4);
    const col = randomIndex % 4;

    newBoard[row][col] = randomNumber;

    return newBoard;
  }

  #processRow(currentRow) {
    const row = currentRow.filter((el) => el > 0);
    const merged = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        const sum = row[i] * 2;

        this.#score += sum;
        merged.push(sum);
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  #applyProcess(matrix) {
    const toProcess = matrix.map((r) => [...r]);

    for (let i = 0; i < toProcess.length; i++) {
      toProcess[i] = this.#processRow(toProcess[i]);
    }

    return toProcess;
  }

  #rotateMatrix(matrix) {
    const n = matrix.length;
    const rotated = new Array(n).fill(0).map(() => new Array(n));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotated[j][n - 1 - i] = matrix[i][j];
      }
    }

    return rotated;
  }

  #move(direction) {
    if (this.#status !== 'playing') {
      return;
    }

    let tempBoard = this.#board.map((r) => [...r]);

    if (direction === 'right') {
      tempBoard = this.#rotateMatrix(this.#rotateMatrix(tempBoard));
    } else if (direction === 'up') {
      tempBoard = this.#rotateMatrix(
        this.#rotateMatrix(this.#rotateMatrix(tempBoard)),
      );
    } else if (direction === 'down') {
      tempBoard = this.#rotateMatrix(tempBoard);
    }

    const processed = this.#applyProcess(tempBoard);
    let finalBoard = processed;

    if (direction === 'right') {
      finalBoard = this.#rotateMatrix(this.#rotateMatrix(processed));
    } else if (direction === 'up') {
      finalBoard = this.#rotateMatrix(processed);
    } else if (direction === 'down') {
      finalBoard = this.#rotateMatrix(
        this.#rotateMatrix(this.#rotateMatrix(processed)),
      );
    }

    if (finalBoard.toString() !== this.#board.toString()) {
      this.#board = this.#addRandomTile(finalBoard);
    }
  }

  moveLeft() {
    this.#move('left');
  }

  moveRight() {
    this.#move('right');
  }

  moveUp() {
    this.#move('up');
  }

  moveDown() {
    this.#move('down');
  }

  getScore() {
    return this.#score;
  }

  getState() {
    return this.#board;
  }

  getStatus() {
    if (this.#status === 'idle') {
      return 'idle';
    }

    if (this.#board.flat().includes(2048)) {
      return 'win';
    }

    for (let i = 0; i < this.#board.length; i++) {
      for (let j = 0; j < this.#board.length; j++) {
        if (this.#board[i][j] === 0) {
          return 'playing';
        }

        if (j < 3 && this.#board[i][j] === this.#board[i][j + 1]) {
          return 'playing';
        }

        if (i < 3 && this.#board[i][j] === this.#board[i + 1][j]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  start() {
    this.#status = 'playing';

    if (this.#board.flat().every((v) => v === 0)) {
      this.#board = this.#addRandomTile(this.#board);
      this.#board = this.#addRandomTile(this.#board);
    }

    return this.#board;
  }

  restart() {
    this.#score = 0;
    this.#status = 'playing';
    this.#board = this.initialState.map((r) => [...r]);
    this.#board = this.#addRandomTile(this.#board);
    this.#board = this.#addRandomTile(this.#board);
  }
}

export default Game;
