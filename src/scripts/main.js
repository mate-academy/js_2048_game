'use strict';

window.addEventListener('load', () => {
  const buttonStart = document.querySelector('.button.start');
  const table = document.querySelector('table tbody');
  const scoreElem = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  class Board {
    constructor() {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.score = 0;
      this.start = false;
    }

    appendOneBox() {
      if (!this.start) {
        return;
      }

      const ShouldAdd4 = Math.random() < 0.1;
      let xRandomIndex
      = Math.floor(Math.random() * (this.board.length));
      let yRandomIndex
      = Math.floor(Math.random() * (this.board[0].length));

      const occupiedPlaces = this.occupiedPlaces();

      while (occupiedPlaces.some(
        cell => cell.y === xRandomIndex && cell.x === yRandomIndex)) {
        xRandomIndex
        = Math.floor(Math.random() * (this.board.length));

        yRandomIndex
        = Math.floor(Math.random() * (this.board[0].length));
      }

      this.board[xRandomIndex][yRandomIndex] = ShouldAdd4 ? 4 : 2;

      this.render();

      if (this.occupiedPlaces().length === 16 && !this.availableMoves()) {
        messageLose.classList.toggle('hidden');
      }
    }

    availableMoves() {
      const move = this.occupiedPlaces().some(({ y, x }) => {
        return this.getBoardField(y, x - 1) === this.getBoardField(y, x)
        || this.getBoardField(y, x + 1) === this.getBoardField(y, x)
        || this.getBoardField(y + 1, x) === this.getBoardField(y, x)
        || this.getBoardField(y - 1, x) === this.getBoardField(y, x);
      });

      return move;
    }

    getBoardField(y, x) {
      return (this.board[y] && this.board[y][x]) || null;
    }

    check2048() {
      if (this.board.flat().some(elem => elem === 2048)) {
        messageWin.classList.toggle('hidden');
      }
    }

    updateScore(addedScore) {
      this.score += addedScore;
      scoreElem.textContent = this.score.toString();
    }

    occupiedPlaces() {
      const occupiedPlaces = [];

      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (this.board[y][x] !== 0) {
            occupiedPlaces.push({
              'y': y,
              'x': x,
            });
          }
        }
      }

      return occupiedPlaces;
    }

    render() {
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          const cell = this.board[y][x];

          table.children[y].children[x].textContent = '';
          table.children[y].children[x].className = 'field-cell';

          if (cell !== 0) {
            table.children[y].children[x].textContent = `${cell}`;
            table.children[y].children[x].classList.add(`field-cell--${cell}`);
          }
        }
      }
    }

    moveRight(col = this.board.length - 1, row = 0, hasMerged = false) {
      let merged = hasMerged;

      if (row < this.board.length) {
        if (col > 0) {
          const temp = this.board[row][col];
          const nextValue = this.board[row][col - 1];
          const isTheSameNumber = nextValue === temp && !merged;

          if (nextValue !== 0 && (temp === 0 || isTheSameNumber)) {
            this.board[row][col] = isTheSameNumber ? nextValue * 2 : nextValue;
            this.board[row][col - 1] = 0;

            if (isTheSameNumber) {
              this.updateScore(nextValue * 2);
              merged = true;
            }

            if (col < this.board.length - 1) {
              return this.moveRight(col + 1, row, merged);
            }
          }

          return this.moveRight(col - 1, row);
        } else {
          return this.moveRight(this.board.length - 1, row + 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveLeft(col = 0, row = 0, hasMerged = false) {
      let merged = hasMerged;

      if (row < this.board.length) {
        if (col < this.board.length - 1) {
          const temp = this.board[row][col];
          const nextValue = this.board[row][col + 1];
          const isTheSameNumber = nextValue === temp && !merged;

          if (nextValue !== 0 && (temp === 0 || isTheSameNumber)) {
            this.board[row][col] = isTheSameNumber ? nextValue * 2 : nextValue;
            this.board[row][col + 1] = 0;

            if (isTheSameNumber) {
              this.updateScore(nextValue * 2);
              merged = true;
            }

            if (col > 0) {
              return this.moveLeft(col - 1, row, merged);
            }
          }

          return this.moveLeft(col + 1, row);
        } else {
          return this.moveLeft(0, row + 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveUp(col = 0, row = 0, hasMerged = false) {
      let merged = hasMerged;

      if (col < this.board.length) {
        if (row < this.board.length - 1) {
          const temp = this.board[row][col];
          const nextValue = this.board[row + 1][col];
          const isTheSameNumber = nextValue === temp && !merged;

          if (nextValue !== 0 && (temp === 0 || isTheSameNumber)) {
            this.board[row][col] = isTheSameNumber ? nextValue * 2 : nextValue;
            this.board[row + 1][col] = 0;

            if (isTheSameNumber) {
              this.updateScore(nextValue * 2);
              merged = true;
            }

            if (row > 0) {
              return this.moveUp(col, row - 1, merged);
            }
          }

          return this.moveUp(col, row + 1);
        } else {
          return this.moveUp(col + 1, 0);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveDown(col = 0, row = this.board.length - 1, hasMerged = false) {
      let merged = hasMerged;

      if (col < this.board.length) {
        if (row > 0) {
          const temp = this.board[row][col];
          const nextValue = this.board[row - 1][col];
          const isTheSameNumber = nextValue === temp && !merged;

          if (nextValue !== 0 && (temp === 0 || isTheSameNumber)) {
            this.board[row][col] = isTheSameNumber ? nextValue * 2 : nextValue;
            this.board[row - 1][col] = 0;

            if (isTheSameNumber) {
              this.updateScore(nextValue * 2);
              merged = true;
            }

            if (row < this.board.length - 1) {
              return this.moveDown(col, row + 1, merged);
            }
          }

          return this.moveDown(col, row - 1);
        } else {
          return this.moveDown(col + 1, this.board.length - 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }
  }

  const htmlBoard = new Board();

  document.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowLeft') {
      htmlBoard.moveLeft();
    }

    if (ev.key === 'ArrowRight') {
      htmlBoard.moveRight();
    }

    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      htmlBoard.moveUp();
    }

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      htmlBoard.moveDown();
    }
  });
  buttonStart.addEventListener('click', startToReset);

  function startToReset() {
    if (buttonStart.classList.contains('start')) {
      htmlBoard.start = true;
      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
    }

    buttonStart.classList.add('restart');
    buttonStart.classList.remove('start');
    messageStart.classList.add('hidden');

    if (buttonStart.textContent === 'Restart') {
      htmlBoard.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
      htmlBoard.score = 0;
      scoreElem.textContent = '0';
    }

    buttonStart.textContent = 'Restart';
  }
});
