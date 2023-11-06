'use strict';

class Game {
  constructor(container) {
    this.container = container;

    this.field = this.container.querySelector('.game-field');
    this.startButton = this.container.querySelector('.button');
    this.score = this.container.querySelector('.game-score');

    this.messageStart = this.container.querySelector('.message-start');
    this.messageLose = this.container.querySelector('.message-lose');
    this.messageWin = this.container.querySelector('.message-win');

    this.columns = this.field.querySelectorAll('tbody > tr').length;

    this.addStartListener();
    this.addKeyListener();
  }

  init() {
    this.board = Array.from(Array(this.columns), () => (
      Array.from(Array(this.columns), () => 0)
    ));

    this.scoreValue = 0;
  }

  addStartListener() {
    this.startButton.addEventListener('click', this.start.bind(this));
  }

  start() {
    this.init();
    this.transformStartButton();
    this.addNewCell();
    this.addNewCell();
  }

  transformStartButton() {
    if (this.startButton.classList.contains('start')) {
      this.startButton.classList.remove('start');
      this.startButton.classList.add('restart');
      this.startButton.textContent = 'Restart';
      this.messageStart.classList.add('hidden');
    } else {
      this.messageWin.classList.add('hidden');
      this.messageLose.classList.add('hidden');
    };
  }

  addNewCell() {
    if (!this.hasEmptyCell()) {
      return;
    }

    let found = false;

    while (!found) {
      const rowIndex = Math.floor(Math.random() * this.columns);
      const cellIndex = Math.floor(Math.random() * this.columns);

      if (this.board[rowIndex][cellIndex] === 0) {
        this.board[rowIndex][cellIndex] = Math.random() < 0.9 ? 2 : 4;
        this.drawCell();

        found = true;
      }
    }
  }

  hasEmptyCell() {
    return this.board.some(row => row.some(cell => cell === 0));
  }

  hasCellsToMerge(board) {
    return board.some(row => row
      .some((cell, index) => cell === row[index + 1]));
  }

  isWin() {
    return this.board.some(row => row.some(cell => cell === 2048));
  }

  isGameOver() {
    if (this.hasEmptyCell()) {
      return false;
    }

    return !this.hasCellsToMerge(this.board)
      && !this.hasCellsToMerge(this.transformBoard(this.board));
  }

  drawCell() {
    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const fieldCell = this.field.rows[rowIndex].cells[cellIndex];

        fieldCell.className = '';
        fieldCell.classList.add('field-cell', `field-cell--${cell}`);
        fieldCell.textContent = cell || '';
      });
    });
  }

  addKeyListener() {
    document.addEventListener('keydown', this.move.bind(this));
  }

  move(keyEvent) {
    if (!this.board) {
      return;
    }

    if (this.isGameOver()) {
      this.messageLose.classList.remove('hidden');

      return;
    }

    if (this.isWin()) {
      this.messageWin.classList.remove('hidden');

      return;
    }

    const prevBoard = JSON.stringify(this.board);

    switch (keyEvent.key) {
      case 'ArrowLeft':
        this.slideLeft();
        break;

      case 'ArrowRight':
        this.slideRight();
        break;

      case 'ArrowDown':
        this.slideDown();
        break;

      case 'ArrowUp':
        this.slideUp();
        break;
    }

    if (prevBoard !== JSON.stringify(this.board)) {
      this.addNewCell();
    }

    this.score.textContent = this.scoreValue;
  }

  slide(row) {
    const currentRow = row.filter(cell => cell !== 0);

    for (let i = 0; i < currentRow.length - 1; i++) {
      if (currentRow[i] === currentRow[i + 1]) {
        currentRow[i] *= 2;
        currentRow.splice(i + 1, 1);
        this.scoreValue += currentRow[i];
      }
    }

    while (currentRow.length < this.columns) {
      currentRow.push(0);
    }

    return currentRow;
  }

  transformBoard(board = this.board) {
    return board[0].map((_, index) => this.board.map(row => row[index]));
  };

  slideLeft() {
    this.board = this.board.map(row => this.slide(row));
  }

  slideRight() {
    this.board = this.board.map(row => this.slide(row.reverse()).reverse());
  }

  slideUp() {
    this.board = this.transformBoard();
    this.slideLeft();
    this.board = this.transformBoard();
  };

  slideDown() {
    this.board = this.transformBoard();
    this.slideRight();
    this.board = this.transformBoard();
  };
}

const game = new Game(document.querySelector('.container'));

game.init();
