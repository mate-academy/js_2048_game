class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.cells = document.querySelectorAll('.field-cell');
    this.scoreElement = document.querySelector('.game-score');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
    this.messageStart = document.querySelector('.message-start');
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
    this.updateBoard();
    this.hideMessages();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    this.move((row) => row);
  }

  moveRight() {
    this.move((row) => row.reverse());
  }

  moveUp() {
    this.moveColumns((col) => col);
  }

  moveDown() {
    this.moveColumns((col) => col.reverse());
  }

  move(transformRow) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = transformRow([...this.board[i]]);
      const compressed = this.compressRow(row);
      const merged = this.mergeRow(compressed);
      const finalRow = this.compressRow(merged);

      if (row.toString() !== finalRow.toString()) {
        moved = true;
      }
      this.board[i] = transformRow([...finalRow]);
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
      this.updateBoard();
    }
  }

  moveColumns(transformCol) {
    this.transpose();
    this.move(transformCol);
    this.transpose();
    this.updateBoard();
  }

  transpose() {
    const firstRow = this.board[0];

    this.board = firstRow.map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  compressRow(row) {
    return row
      .filter((val) => val !== 0)
      .concat(Array(4).fill(0))
      .slice(0, 4);
  }

  mergeRow(row) {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  checkGameOver() {
    if (this.board.flat().includes(0)) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return;
        }
      }
    }
    this.status = 'gameover';
    this.showMessage(this.messageLose);
  }

  checkWin() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
      this.showMessage(this.messageWin);
    }
  }

  updateBoard() {
    let index = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.cells[index].textContent =
          this.board[i][j] !== 0 ? this.board[i][j] : '';

        this.cells[index].className =
          `field-cell field-cell--${this.board[i][j]}`;
        index++;
      }
    }
    this.scoreElement.textContent = this.score;
    this.checkWin();
  }

  showMessage(message) {
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
    this.messageStart.classList.add('hidden');
    message.classList.remove('hidden');
  }

  hideMessages() {
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
    this.messageStart.classList.add('hidden');
  }
}

export default Game;
