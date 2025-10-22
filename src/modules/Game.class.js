'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // зберігаємо копію початкового стану для restart
    this.initialState = initialState.map((row) => [...row]);
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'

    // отримуємо всі клітинки як масив; може бути пустим у тестах
    this.cells = Array.from(document.querySelectorAll('.field-cell') || []);
    this.scoreElement = document.querySelector('.game-score') || null;
    this.messageLose = document.querySelector('.message-lose') || null;
    this.messageWin = document.querySelector('.message-win') || null;
    this.messageStart = document.querySelector('.message-start') || null;
  }

  moveLeft() {
    return this.move((row) => row);
  }
  moveRight() {
    return this.move((row) => row.reverse());
  }
  moveUp() {
    return this.moveColumns((col) => col);
  }
  moveDown() {
    return this.moveColumns((col) => col.reverse());
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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[i][c] === 0) {
          emptyCells.push({ row: i, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;
  }

  checkGameOver() {
    if (this.board.flat().includes(0)) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let c = 0; c < 4; c++) {
        if (
          (c < 3 && this.board[i][c] === this.board[i][c + 1]) ||
          (i < 3 && this.board[i][c] === this.board[i + 1][c])
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

module.exports = Game;
