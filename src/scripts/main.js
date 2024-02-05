'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || this.initializeBoard();
    this.score = 0;
    this.hasWon = false;
    this.movedDuringKeyPress = false;
    this.messageStart = document.querySelector('.message-start');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
  }

  initializeBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  createTile(r, c) {
    const tile = document.createElement('div');

    tile.id = r + '-' + c;
    document.getElementById('board').append(tile);

    return tile;
  }

  setGame() {
    this.board = this.initializeBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = this.createTile(r, c);

        this.updateTile(tile, this.board[r][c]);
      }
    }
  }

  restartGame() {
    this.board = this.initializeBoard();
    this.score = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = document.getElementById(r + '-' + c);

        this.updateTile(tile, this.board[r][c]);
      }
    }

    this.setTwo();
    this.setTwo();

    document.getElementById('score').innerText = this.score;

    this.messageLose.style.display = 'none';
  }

  startGame() {
    this.restartGame();
    this.messageStart.style.display = 'none';
    document.getElementById('startButton').textContent = 'Restart';

    const buttonReset = document.querySelector('.start');

    buttonReset.classList.remove('start');
    buttonReset.classList.add('restart');
  }

  updateTile(tile, num) {
    tile.innerText = '';
    tile.className = 'tile';

    if (num > 0) {
      tile.innerText = num.toString();

      if (num === 2048) {
        this.hasWon = true;
      }

      if (num <= 4096) {
        tile.classList.add('x' + num.toString());
      } else {
        tile.classList.add('x8192');
      }
    }
  }

  isGameOver() {
    return !this.hasEmptyTile() && !this.canAddNumbers();
  }

  canAddNumbers() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        // eslint-disable-next-line max-len
        if ((c < 3 && this.board[r][c] === this.board[r][c + 1]) || (r < 3 && this.board[r][c] === this.board[r + 1][c])) {
          return true;
        }
      }
    }

    return false;
  }

  filterZero(row) {
    return row.filter(num => num !== 0);
  }

  slide(rowSlide) {
    let row = rowSlide;

    row = this.filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    row = this.filterZero(row);

    while (row.length < 4) {
      row.push(0);
    }

    return row;
  }

  slideLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.board[r];

      const originalRow = [...row];

      row = this.slide(row);
      this.board[r] = row;

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
      }

      for (let c = 0; c < 4; c++) {
        const tile = document.getElementById(r + '-' + c);
        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }

    return moved;
  }

  slideRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.board[r];

      row.reverse();

      const originalRow = [...row];

      row = this.slide(row);
      this.board[r] = row.reverse();

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
      }

      for (let c = 0; c < 4; c++) {
        const tile = document.getElementById(r + '-' + c);
        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }

    return moved;
  }

  slideUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      // eslint-disable-next-line max-len
      let row = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]];

      const originalRow = [...row];

      row = this.slide(row);

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = row[r];

        const tile = document.getElementById(r + '-' + c);
        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }

    return moved;
  }

  slideDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      // eslint-disable-next-line max-len
      let row = [this.board[0][c], this.board[1][c], this.board[2][c], this.board[3][c]];

      row.reverse();

      const originalRow = [...row];

      row = this.slide(row);
      row.reverse();

      if (!this.arraysEqual(originalRow, row)) {
        moved = true;
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = row[r];

        const tile = document.getElementById(r + '-' + c);
        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }

    return moved;
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);

      if (this.board[r][c] === 0) {
        this.board[r][c] = 2;

        const tile = document.getElementById(r + '-' + c);

        tile.innerText = '2';
        tile.classList.add('x2');
        found = true;
      }
    }
  }

  hasEmptyTile() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const game = new Game();

  game.setGame();

  const button = document.getElementById('startButton');

  button.textContent = 'Start';

  button.addEventListener('click', function() {
    game.startGame();
  });

  document.addEventListener('keyup', (e) => {
    game.movedDuringKeyPress = false; // Reset the variable on each keypress

    if (e.code === 'ArrowLeft' && game.slideLeft()) {
      game.movedDuringKeyPress = true;
    } else if (e.code === 'ArrowRight' && game.slideRight()) {
      game.movedDuringKeyPress = true;
    } else if (e.code === 'ArrowUp' && game.slideUp()) {
      game.movedDuringKeyPress = true;
    } else if (e.code === 'ArrowDown' && game.slideDown()) {
      game.movedDuringKeyPress = true;
    }

    if (game.movedDuringKeyPress) {
      game.setTwo();
    }

    if (game.isGameOver()) {
      game.messageLose.classList.add('text-centered');

      setTimeout(() => {
        game.messageLose.style.display = 'block';
        game.messageLose.classList.remove('text-centered');
        game.messageLose.classList.add('text-hidden');
      }, 1000);

      setTimeout(() => {
        // eslint-disable-next-line max-len
        game.messageStart.textContent = 'Press "Restart" to begin the game. Good luck!';
        game.messageStart.style.display = 'block';
      }, 2000);
    }

    if (game.hasWon) {
      game.messageWin.style.opacity = '1';
    }
    document.getElementById('score').innerText = game.score;
  });

  // eslint-disable-next-line no-unused-vars
  function toggleRule() {
    const rule = document.getElementById('rule');

    rule.classList.toggle('rule-visible');
  }

  const ruleLink = document.querySelector('.rule__link');

  ruleLink.addEventListener('click', toggleRule);
});
