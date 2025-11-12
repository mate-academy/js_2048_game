class Game {
  constructor(initialState = []) {
    this.boardSize = 4;
    this.initialState = initialState;
    this.resetGame();
  }

  resetGame() {
    this.board = [];

    if (this.initialState.length === this.boardSize) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      for (let i = 0; i < this.boardSize; i++) {
        this.board.push(new Array(this.boardSize).fill(0));
      }
    }

    this.score = 0;
    this.status = 'initial';
    this.hasWon = false;
    this.isStarted = false;
    this.isBoardChangedThisTurn = false;

    this.mergedThisTurn = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(false));
  }

  start() {
    if (
      !this.isStarted ||
      this.status === 'gameOver' ||
      this.status === 'win'
    ) {
      this.resetGame();
      this._addRandomTile();
      this._addRandomTile();
      this.status = 'playing';
      this.isStarted = true;

      return true;
    }

    return false;
  }

  restart() {
    return this.start();
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    return this._performMove('left');
  }

  moveRight() {
    return this._performMove('right');
  }

  moveUp() {
    return this._performMove('up');
  }

  moveDown() {
    return this._performMove('down');
  }

  _performMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const initialBoard = this.board.map((row) => [...row]);

    this.isBoardChangedThisTurn = false;

    this.mergedThisTurn = Array(this.boardSize)
      .fill(0)
      .map(() => Array(this.boardSize).fill(false));

    let board = this.board;

    if (direction === 'up' || direction === 'down') {
      board = this._transpose(board);
    }

    for (let i = 0; i < this.boardSize; i++) {
      const rowOrCol = board[i];

      if (direction === 'right' || direction === 'down') {
        rowOrCol.reverse();
      }

      const filteredRow = rowOrCol.filter((tile) => tile !== 0);
      let newRow = [...filteredRow];

      for (let j = 0; j < newRow.length - 1; j++) {
        if (
          newRow[j] !== 0 &&
          newRow[j] === newRow[j + 1] &&
          !this.mergedThisTurn[i][j]
        ) {
          newRow[j] *= 2;
          this.score += newRow[j];
          newRow[j + 1] = 0;
          this.mergedThisTurn[i][j] = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < this.boardSize) {
        newRow.push(0);
      }

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }
      board[i] = newRow;
    }

    if (direction === 'up' || direction === 'down') {
      this.board = this._transpose(board);
    } else {
      this.board = board;
    }

    this.isBoardChangedThisTurn = !this._boardsAreEqual(
      initialBoard,
      this.board,
    );

    if (this.isBoardChangedThisTurn) {
      this._addRandomTile();
      this._checkWin();
      this._checkGameOver();
    }

    return this.isBoardChangedThisTurn;
  }

  _addRandomTile() {
    const emptyCells = this._getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  _getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    return emptyCells;
  }

  _checkWin() {
    if (this.hasWon) {
      return;
    }

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';
          this.hasWon = true;

          return;
        }
      }
    }
  }

  _checkGameOver() {
    if (this.status === 'win') {
      return;
    }

    if (this._getEmptyCells().length > 0) {
      return;
    }

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize - 1; c++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return;
        }
      }
    }

    for (let c = 0; c < this.boardSize; c++) {
      for (let r = 0; r < this.boardSize - 1; r++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return;
        }
      }
    }

    this.status = 'gameOver';
  }

  _transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  _boardsAreEqual(board1, board2) {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (board1[r][c] !== board2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;
