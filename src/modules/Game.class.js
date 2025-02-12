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
      this.updateBoard();
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
      let row = transformRow([...this.board[i]]);
      const compressed = this.compressRow(row);
      const merged = this.mergeRow(compressed);
      const finalRow = this.compressRow(merged);

      if (row.toString() !== finalRow.toString()) {
        moved = true;
        row = finalRow;
      }

      this.board[i] = transformRow([...row]);
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

  updateBoard() {
    let index = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.cells[index].textContent =
          this.board[i][j] !== 0 ? this.board[i][j] : '';
        this.cells[index].className = `field-cell tile-${this.board[i][j]}`;
        index++;
      }
    }
    this.scoreElement.textContent = this.score;
    this.checkWin();
  }

  checkWin() {
    if (this.board.flat().includes(2048)) {
      this.showMessage(this.messageWin);
    }
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
