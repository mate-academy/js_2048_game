export class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = "playing";
    this.board = initialState ? this.copyBoard(initialState) : this.createEmptyBoard();
    if (!initialState) this.addRandomTile(), this.addRandomTile();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  copyBoard(board) {
    return board.map(row => [...row]);
  }

  getState() {
    return this.copyBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.restart();
  }

  restart() {
    this.score = 0;
    this.status = "playing";
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    return this.makeMove(this.board, this.mergeRowLeft.bind(this));
  }

  moveRight() {
    const reversed = this.board.map(row => [...row].reverse());
    return this.makeMove(reversed, this.mergeRowLeft.bind(this), true);
  }

  moveUp() {
    const rotated = this.rotateBoard(this.board);
    return this.makeMove(rotated, this.mergeRowLeft.bind(this), false, true);
  }

  moveDown() {
    const rotated = this.rotateBoard(this.board).map(row => row.reverse());
    return this.makeMove(rotated, this.mergeRowLeft.bind(this), true, true);
  }

  makeMove(boardInput, mergeFunction, reverse = false, rotate = false) {
    const newBoard = boardInput.map(mergeFunction);
    let finalBoard = newBoard;

    if (rotate) finalBoard = this.rotateBoardBack(finalBoard);
    if (reverse) finalBoard = finalBoard.map(row => row.reverse());

    if (JSON.stringify(this.board) !== JSON.stringify(finalBoard)) {
      this.board = finalBoard;
      this.addRandomTile();
      this.updateStatus();
      return true;
    }
    return false;
  }

  mergeRowLeft(row) {
    const filtered = row.filter(n => n !== 0);
    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;
        merged.push(value);
        this.score += value;
        if (value === 2048) this.status = "won";
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }
    return merged;
  }

  addRandomTile() {
    const empty = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) empty.push([i, j]);
      }
    }

    if (empty.length === 0) return;

    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }

  rotateBoard(board) {
    const newBoard = this.createEmptyBoard();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[j][this.size - 1 - i] = board[i][j];
      }
    }
    return newBoard;
  }

  rotateBoardBack(board) {
    const newBoard = this.createEmptyBoard();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[this.size - 1 - j][i] = board[i][j];
      }
    }
    return newBoard;
  }

  updateStatus() {
    if (this.status === "won") return;

    if (!this.canMove()) {
      this.status = "lost";
    }
  }

  canMove() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) return true;

        if (
          (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
