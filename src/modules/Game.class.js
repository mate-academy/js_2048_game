class Game {
  constructor(initialState = null) {
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = JSON.parse(JSON.stringify(initialState));
      this.status = 'playing';
    } else {
      this.initEmptyBoard();
    }
  }

  initEmptyBoard() {
    this.board = [];

    for (let r = 0; r < 4; r++) {
      this.board.push([0, 0, 0, 0]);
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randIdx = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randIdx];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  slideAndMergeRow(row) {
    const filtered = row.filter((val) => {
      return val !== 0;
    });

    const mergedRow = [];
    let scoreGain = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1] && filtered[i] !== 0) {
        const newValue = filtered[i] * 2;

        mergedRow.push(newValue);
        scoreGain += newValue;
        i++;
      } else {
        mergedRow.push(filtered[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return { mergedRow, scoreGain };
  }

  handleMoveResult(moved) {
    if (moved) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < 4; r++) {
      const { mergedRow, scoreGain } = this.slideAndMergeRow(this.board[r]);

      if (JSON.stringify(this.board[r]) !== JSON.stringify(mergedRow)) {
        moved = true;
      }

      this.board[r] = mergedRow;
      this.score += scoreGain;
    }

    this.handleMoveResult(moved);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let r = 0; r < 4; r++) {
      const reversed = [...this.board[r]].reverse();
      const { mergedRow, scoreGain } = this.slideAndMergeRow(reversed);
      const finalRow = mergedRow.reverse();

      if (JSON.stringify(this.board[r]) !== JSON.stringify(finalRow)) {
        moved = true;
      }

      this.board[r] = finalRow;
      this.score += scoreGain;
    }

    this.handleMoveResult(moved);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < 4; c++) {
      const col = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];
      const { mergedRow, scoreGain } = this.slideAndMergeRow(col);

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== mergedRow[r]) {
          moved = true;
        }
        this.board[r][c] = mergedRow[r];
      }
      this.score += scoreGain;
    }
    this.handleMoveResult(moved);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let c = 0; c < 4; c++) {
      const col = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ].reverse();
      const { mergedRow, scoreGain } = this.slideAndMergeRow(col);
      const finalCol = mergedRow.reverse();

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== finalCol[r]) {
          moved = true;
        }
        this.board[r][c] = finalCol[r];
      }
      this.score += scoreGain;
    }

    this.handleMoveResult(moved);
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
    this.initEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  checkStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
