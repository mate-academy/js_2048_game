class Game {
  static SIZE = 4;

  constructor(initialState) {
    this._size = Game.SIZE;

    const emptyRow = () => Array(this._size).fill(0);
    const emptyBoard = () => Array.from({ length: this._size }, emptyRow);

    if (Array.isArray(initialState) && initialState.length === this._size) {
      this._initial = initialState.map((row) => row.slice());
    } else {
      this._initial = emptyBoard();
    }

    this._board = this._initial.map((row) => row.slice());
    this._score = 0;
    this._status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'
  }

  // ===== PUBLIC METHODS =====

  getState() {
    return this._board.map((row) => row.slice());
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (
      this._status === 'playing' ||
      this._status === 'win' ||
      this._status === 'lose'
    ) {
      return;
    }

    this._status = 'playing';

    if (this._isBoardEmpty(this._board)) {
      this._spawnRandomTile();
      this._spawnRandomTile();
    }

    this._updateWinLoseStatus();
  }

  restart() {
    this._board = this._initial.map((row) => row.slice());
    this._score = 0;
    this._status = 'idle';
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

  //  INTERNAL LOGIC

  _performMove(direction) {
    if (this._status === 'win' || this._status === 'lose') {
      return false;
    }

    if (this._status === 'idle') {
      this.start();
    }

    const prevBoard = this._cloneBoard(this._board);
    let moveScore = 0;
    let working = this._cloneBoard(this._board);

    if (direction === 'right') {
      working = working.map((row) => row.slice().reverse());
    } else if (direction === 'up') {
      working = this._transpose(working);
    } else if (direction === 'down') {
      working = this._transpose(working).map((row) => row.slice().reverse());
    }

    let anyChanged = false;

    for (let rowIndex = 0; rowIndex < this._size; rowIndex += 1) {
      const { row, gained, changed } = this._mergeRowLeft(working[rowIndex]);

      working[rowIndex] = row;
      moveScore += gained;

      if (changed) {
        anyChanged = true;
      }
    }

    if (direction === 'right') {
      working = working.map((row) => row.slice().reverse());
    } else if (direction === 'up') {
      working = this._transpose(working);
    } else if (direction === 'down') {
      working = this._transpose(working.map((row) => row.slice().reverse()));
    }

    const moved = anyChanged && !this._boardsEqual(prevBoard, working);

    if (!moved) {
      return false;
    }

    this._board = working;
    this._score += moveScore;
    this._spawnRandomTile();
    this._updateWinLoseStatus();

    return true;
  }

  _mergeRowLeft(row) {
    const original = row.slice();
    const compact = row.filter((v) => v !== 0);
    const merged = [];
    let gained = 0;

    for (let i = 0; i < compact.length; i += 1) {
      if (i < compact.length - 1 && compact[i] === compact[i + 1]) {
        const val = compact[i] * 2;

        merged.push(val);
        gained += val;
        i += 1;
      } else {
        merged.push(compact[i]);
      }
    }

    while (merged.length < this._size) {
      merged.push(0);
    }

    const changed = !this._arraysEqual(original, merged);

    return { row: merged, gained, changed };
  }

  _spawnRandomTile() {
    const empties = [];

    for (let rowIndex = 0; rowIndex < this._size; rowIndex += 1) {
      for (let colIndex = 0; colIndex < this._size; colIndex += 1) {
        if (this._board[rowIndex][colIndex] === 0) {
          empties.push([rowIndex, colIndex]);
        }
      }
    }

    if (!empties.length) {
      return false;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this._board[r][c] = value;

    return true;
  }

  _updateWinLoseStatus() {
    if (this._has2048(this._board)) {
      this._status = 'win';

      return;
    }

    if (this._hasMoves(this._board)) {
      this._status = 'playing';
    } else {
      this._status = 'lose';
    }
  }

  _has2048(board) {
    return board.some((row) => row.includes(2048));
  }

  _hasMoves(board) {
    for (let r = 0; r < this._size; r += 1) {
      for (let c = 0; c < this._size; c += 1) {
        if (board[r][c] === 0) {
          return true;
        }

        if (c + 1 < this._size && board[r][c] === board[r][c + 1]) {
          return true;
        }

        if (r + 1 < this._size && board[r][c] === board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _isBoardEmpty(board) {
    return board.every((row) => row.every((v) => v === 0));
  }

  _transpose(board) {
    return board[0].map((_, c) => board.map((row) => row[c]));
  }

  _cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  _boardsEqual(a, b) {
    return a.every((row, i) => this._arraysEqual(row, b[i]));
  }

  _arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
}

export default Game;
