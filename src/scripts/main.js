class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.board = initialState || this.generateEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  generateEmptyBoard() {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0));
  }

  start() {
    this.board = this.generateEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.score = 0;
    this.updateUI();
  }

  restart() {
    this.start();
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const compressed = this.compress(this.board[row]);
      const merged = this.merge(compressed);
      const finalRow = this.compress(merged);

      if (this.board[row].toString() !== finalRow.toString()) {
        moved = true;
        this.board[row] = finalRow;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
      this.updateUI();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();
    this.moveRight();
    this.transposeBoard();
  }

  transposeBoard() {
    const newBoard = this.generateEmptyBoard();

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        newBoard[row][col] = this.board[col][row];
      }
    }
    this.board = newBoard;
  }

  compress(row) {
    return row
      .filter((val) => val !== 0)
      .concat(Array(this.size).fill(0))
      .slice(0, this.size);
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0 && !this.canMakeMove()) {
      this.status = 'lose';
    }
  }

  canMakeMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (
          value === 0 ||
          (col < this.size - 1 && value === this.board[row][col + 1]) ||
          (row < this.size - 1 && value === this.board[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateUI() {
    const boardElement = document.getElementById('game-board');

    boardElement.innerHTML = '';

    this.board.forEach((row) => {
      const rowElement = document.createElement('div');

      rowElement.className = 'row';

      row.forEach((cell) => {
        const cellElement = document.createElement('div');

        cellElement.className = `cell field-cell--${cell || 'empty'}`;
        cellElement.innerText = cell || '';
        rowElement.appendChild(cellElement);
      });
      boardElement.appendChild(rowElement);
    });

    document.getElementById('score').innerText = `Score: ${this.score}`;
    document.getElementById('status').innerText = `Status: ${this.status}`;
  }
}

export default Game;
