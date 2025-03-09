class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.hasMoved = false; // Flag to track if a move has been made
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

  move(direction) {
    this.hasMoved = false;

    const board = this.board;
    const size = board.length;

    switch (direction) {
      case 'left':
        for (let i = 0; i < size; i++) {
          board[i] = this.mergeRow(board[i]);
        }
        break;
      case 'right':
        for (let i = 0; i < size; i++) {
          board[i] = this.mergeRow(board[i].reverse()).reverse();
        }
        break;
      case 'up':
        for (let col = 0; col < size; col++) {
          const column = board.map((row) => row[col]);
          const mergedColumn = this.mergeRow(column);

          for (let row = 0; row < size; row++) {
            board[row][col] = mergedColumn[row];
          }
        }
        break;
      case 'down':
        for (let col = 0; col < size; col++) {
          const column = board.map((row) => row[col]).reverse();
          const mergedColumn = this.mergeRow(column);

          for (let row = 0; row < size; row++) {
            board[row][col] = mergedColumn[row];
          }
        }
        break;
    }

    if (this.hasMoved) {
      this.addRandomTile();
      this.checkWinLose();
    }

    this.board = board;
  }

  mergeRow(row) {
    const mergedRow = [];
    let skipNext = false;
    let moved = false;

    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        continue;
      }

      if (skipNext) {
        skipNext = false;
        continue;
      }

      if (i + 1 < row.length && row[i] === row[i + 1]) {
        mergedRow.push(row[i] * 2);
        this.score += row[i] * 2;
        this.hasMoved = true;
        moved = true;
        skipNext = true;
      } else {
        mergedRow.push(row[i]);

        if (mergedRow.length - 1 !== i) {
          moved = true;
        }
      }
    }

    while (mergedRow.length < row.length) {
      mergedRow.push(0);
    }

    if (moved) {
      this.hasMoved = true;
    }

    return mergedRow;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i] && this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      if (this.board[row] && this.board[row][col] === 0) {
        this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
      }
    }
  }

  checkWinLose() {
    if (this.isWin()) {
      this.status = 'win';
      this.updateStatus();

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
    this.updateStatus();
  }

  isWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    const statusElement = document.querySelector('.message');

    if (this.status === 'win') {
      statusElement.innerHTML = 'Winner! Congrats! You did it!';
      statusElement.classList.remove('hidden');
    } else if (this.status === 'lose') {
      statusElement.innerHTML = 'Game Over!';
      statusElement.classList.remove('hidden');
    } else {
      statusElement.classList.add('hidden');
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i > 0 && this.board[i][j] === this.board[i - 1][j]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j > 0 && this.board[i][j] === this.board[i][j - 1]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]; // Ensure the board is initialized
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.hasMoved = false;
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]; // Ensure the board is initialized
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
}

module.exports = Game;
