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
    this.board = initialState;
    this.score = 0;
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  renderBoard() {
    const cells = document.querySelectorAll('.game-field td');

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const index = row * 4 + col;
        const cell = cells[index];
        const value = this.board[row][col];

        cell.classList = 'field-cell';

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.textContent = value;
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }

    const scoreNumber = document.querySelector('.game-score');

    scoreNumber.textContent = `${this.score}`;
  }

  spawnNumber() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const numberToSpawn = Math.random() < 0.1 ? 4 : 2;

    this.board[randCell.row][randCell.col] = numberToSpawn;
    this.renderBoard();
  }

  isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return 'win';
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return 'playing';
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return 'playing';
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    const prevBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < 4; i++) {
      let row = this.board[i];

      row = this.filterZero(row);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
        }
      }
      row = this.filterZero(row);

      while (row.length < 4) {
        row.push(0);
      }
      this.board[i] = row;
    }
    this.renderBoard();

    if (!this.boardsAreEqual(prevBoard, this.board)) {
      this.spawnNumber();
    }
    this.checkGameStatus();
  }

  moveRight() {
    const prevBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < 4; i++) {
      let row = this.board[i].reverse();

      row = this.filterZero(row);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
        }
      }
      row = this.filterZero(row);

      while (row.length < 4) {
        row.push(0);
      }
      this.board[i] = row.reverse();
    }
    this.renderBoard();

    if (!this.boardsAreEqual(prevBoard, this.board)) {
      this.spawnNumber();
    }
    this.checkGameStatus();
  }

  moveUp() {
    const prevBoard = JSON.parse(JSON.stringify(this.board));

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      column = this.filterZero(column);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
        }
      }
      column = this.filterZero(column);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }
    this.renderBoard();

    if (!this.boardsAreEqual(prevBoard, this.board)) {
      this.spawnNumber();
    }
    this.checkGameStatus();
  }

  moveDown() {
    const prevBoard = JSON.parse(JSON.stringify(this.board));

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      column = this.filterZero(column);
      column.reverse();

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
        }
      }
      column = this.filterZero(column);

      while (column.length < 4) {
        column.push(0);
      }
      column.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }
    this.renderBoard();

    if (!this.boardsAreEqual(prevBoard, this.board)) {
      this.spawnNumber();
    }
    this.checkGameStatus();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    const messageContainer = document.querySelector('.message-container');
    const visibleMessage = messageContainer.querySelector('p:not(.hidden)');

    if (visibleMessage) {
      const mesClass = visibleMessage.classList;

      switch (mesClass) {
        case 'message message-start':
          return 'idle';
        case 'message message-win':
          return 'win';
        case 'message message-lose':
          return 'lose';
      }
    } else {
      return `playing`;
    }
  }

  checkGameStatus() {
    const curStatus = this.isGameOver();

    if (curStatus === 'win' || curStatus === 'lose') {
      this.showMessage(curStatus);
    }
  }

  showMessage(type) {
    const message = document.querySelector(`.message.message-${type}`);

    message.classList.remove('hidden');
    document.removeEventListener('keydown', this.boundKeyDown);
  }

  start() {
    const cells = document.querySelectorAll('.game-field td');
    const cellIndexes = Array.from({ length: cells.length }, (_, i) => i);
    const shuffledIndexes = cellIndexes.sort(() => 0.5 - Math.random());
    const chosenIndexes = shuffledIndexes.slice(0, 2);

    chosenIndexes.forEach((index) => {
      cells[index].textContent = '2';
      cells[index].classList.add('field-cell--2');

      const rowIndex = Math.floor(index / 4);
      const colIndex = index % 4;

      this.board[rowIndex][colIndex] = 2;
    });

    const footerMessage = document.querySelectorAll('.message');

    footerMessage.forEach((element) => element.classList.add('hidden'));
    this.boundKeyDown = this.keyDown.bind(this);
    document.addEventListener('keydown', this.boundKeyDown);
  }

  restart() {
    const cells = document.querySelectorAll('.game-field td');

    cells.forEach((cell) => {
      cell.classList = 'field-cell';
      cell.textContent = '';
    });

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        this.board[row][column] = 0;
      }
    }

    const loseMessage = document.querySelector('.message.message-lose');
    const startMessage = document.querySelector('.message.message-start');

    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
    document.removeEventListener('keydown', this.boundKeyDown);
  }

  keyDown(e) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
    }
    this.checkGameStatus();
  }
}

module.exports = Game;
