export default class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.board = initialState || this.createEmptyBoard();
    this.status = 'start';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'start';
  }

  _slideAndMergeLine(line) {
    let nonZero = line.filter((val) => val !== 0);
    const currentLine = Array(this.size).fill(0);

    nonZero.forEach((val, i) => (currentLine[i] = val));

    let newScore = 0;
    let mergedHappened = false;

    for (let i = 0; i < this.size - 1; i++) {
      if (currentLine[i] !== 0 && currentLine[i] === currentLine[i + 1]) {
        currentLine[i] *= 2;
        newScore += currentLine[i];
        currentLine[i + 1] = 0;
        mergedHappened = true;
      }
    }

    nonZero = currentLine.filter((val) => val !== 0);

    const finalLine = Array(this.size).fill(0);

    nonZero.forEach((val, i) => (finalLine[i] = val));

    const moved = line.toString() !== finalLine.toString();

    return { line: finalLine, score: newScore, moved: moved || mergedHappened };
  }

  _reverse(board) {
    return board.map((row) => [...row].reverse());
  }

  _rotate(board) {
    const newBoard = this.createEmptyBoard();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[r][c] = board[this.size - 1 - c][r];
      }
    }

    return newBoard;
  }

  _performMove(transform) {
    if (this.status !== 'playing') {
      return false;
    }

    let transformedBoard = this.board;

    if (transform) {
      transformedBoard = transform(this.board);
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const originalLine = [...transformedBoard[r]];
      const result = this._slideAndMergeLine(originalLine);

      if (result.moved) {
        transformedBoard[r] = result.line;
        this.score += result.score;
        moved = true;
      }
    }

    if (moved) {
      if (transform) {
        if (transform === this._reverse) {
          this.board = this._reverse(transformedBoard);
        } else if (transform === this._rotate) {
          transformedBoard = this._rotate(transformedBoard);
          transformedBoard = this._rotate(transformedBoard);
          this.board = this._rotate(transformedBoard);
        }
      } else {
        this.board = transformedBoard;
      }

      this.addRandomTile();
    }

    this._checkGameStatus();

    return moved;
  }

  moveLeft() {
    return this._performMove();
  }

  moveRight() {
    return this._performMove(this._reverse);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let rotatedBoard = this._rotate(this.board);
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const originalLine = [...rotatedBoard[r]];
      const result = this._slideAndMergeLine(originalLine);

      if (result.moved) {
        rotatedBoard[r] = result.line;
        this.score += result.score;
        moved = true;
      }
    }

    if (moved) {
      rotatedBoard = this._rotate(rotatedBoard);
      rotatedBoard = this._rotate(rotatedBoard);
      this.board = this._rotate(rotatedBoard);
      this.addRandomTile();
    }

    this._checkGameStatus();

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let rotatedBoard = this._rotate(this.board);

    rotatedBoard = this._rotate(rotatedBoard);
    rotatedBoard = this._rotate(rotatedBoard);

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const originalLine = [...rotatedBoard[r]];
      const result = this._slideAndMergeLine(originalLine);

      if (result.moved) {
        rotatedBoard[r] = result.line;
        this.score += result.score;
        moved = true;
      }
    }

    if (moved) {
      this.board = this._rotate(rotatedBoard);
      this.addRandomTile();
    }

    this._checkGameStatus();

    return moved;
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ row: r, col: c });
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    const { row, col } = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  _checkGameStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    const hasEmptySpace = this.board.flat().some((val) => val === 0);

    if (hasEmptySpace) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (c < this.size - 1 && val === this.board[r][c + 1]) {
          return;
        }

        if (r < this.size - 1 && val === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
